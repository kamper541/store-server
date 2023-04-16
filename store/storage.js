const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
// const url = require("../config/keys").mongoURI;
require('dotenv').config()

const storage = new GridFsStorage({
  url: require("../config/keys").mongoURI,
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.includes(file.mimetype)) {
      const fileInfo = {
        filename: `${file.originalname}`,
        bucketName: 'uploads'
      }
      return fileInfo;
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
