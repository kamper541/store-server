const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const multer = require("multer");
const upload = require("./store/storage");
const Grid = require("gridfs-stream");
require('dotenv').config()

// Initialize the app
const app = express();

// Middleware
// Form data middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// Json body middleware
app.use(bodyParser.json());

// Cors middleware
app.use(cors());

// Setting static directory
app.use(express.static(path.join(__dirname, "public")));

// Use the passport middleware
app.use(passport.initialize());

// Bring the passport strategy
require("./config/passport")(passport);

// Bring in the database config.
const URI = require("./config/keys").mongoURI;
let gfs, gridfsBucket;
mongoose
  .connect(URI, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected... ${URI}`);
    const { db } = mongoose.connection;
    gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });
    gfs = Grid(db, mongoose.mongo);
    gfs.collection("uploads");
    console.log(`Gfs connected... ${gfs}`);
  })
  .catch((err) => {
    console.log(`Unable to connect to the database... ${err}`);
  });

// Bring in the Users route
const users = require("./routers/api/users");
app.use("/api/users", users);

// Bring in the Stocks route
const stocks = require("./routers/api/stocks");
app.use("/api/stocks", stocks);

// Bring in the Invoices route
const invoices = require("./routers/api/invoices");
app.use("/api/invoices", invoices);

const PORT = process.env.PORT || 9000;

app.post("/api/upload", upload.single("file"), (req, res) => {
  return res.status(201).json({
    file: req.file,
  });
});

app.get("/api/images", (req, res) => {
  gfs.files.find().toArray((error, files) => {
    if (!files || files.length == 0) {
      return res.status(404).json({
        msg: "No images",
      });
    } else {
      return res.status(201).json({
        files: files,
      });
    }
  });
});

app.get("/api/images/:imagename", (req, res) => {
  gfs.files.findOne({ filename: req.params.imagename }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({
        err: "No file",
      });
    }
    console.log(file);
    const readstream = gridfsBucket.openDownloadStream(file._id);
    readstream.pipe(res);
  });
});

app.post("/api/images/delete_all_images", (req, res) => {
  gfs.files.deleteMany().then(() => {
    return res.status(400).json({
      msg: "Deleted all images",
      status: "success",
    });
  });
})

app.use((err, req, res, next) => {
  if (err.code == "INCORRECT_FILETYPE") {
    return res.status(422).json({
      error: "Only images are allowed",
    });
  }
  if (err.code == "LIMIT_FILE_SIZE") {
    return res.status(422).json({
      err: "File to large (> 500KB) ",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
