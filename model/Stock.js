const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the user model schema
const StockSchema = new Schema({
  detail: {
    type: String,
    require: true,
    default: '0'
  },
  description: {
    type: String,
    require: false,
    default: ''
  },
  barid: {
    type: String,
    require: true,
    default: '0'
  },
  beid: {
    type: String,
    require: true,
    default: '0'
  },
  disc: {
    type: Number,
    default: 0
  },
  discper: {
    type: Number,
    default: 0
  },
  jmid: {
    type: String,
    require: true,
    default: '0'
  },
  qty: {
    type: Number,
    require: true,
    default: 0
  },
  priceperu: {
    type: Number,
    require: true,
  },
  taxactive: {
    type: Number,
    require: true,
    default: false
  },
  imagename:{
    type: String,
    require: false,
    default: ""
  }
});

module.exports = Stock = mongoose.model("stocks", StockSchema);
