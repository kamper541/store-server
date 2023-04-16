const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the user model schema
const ImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

module.exports = Image = mongoose.model("images", ImageSchema);
