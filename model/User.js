const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the user model schema
const UserSchema = new Schema({
  storename: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address:{
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  country:{
    type: String,
    required: true
  },
  postalcode:{
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
