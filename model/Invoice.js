const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the user model schema
const InvoiceSchema = new Schema({
  customer_id: {
    type: String,
    require: true,
    default: "0",
  },
  note: {
    type: String,
    require: true
  },
  description:{
    type: String,
    require: false,
    default: ""
  },
  storename: {
    type: String,
  },
  order_stock: {
    type: Array,
    require: true,
    default: {},
  },
  status: {
    type: String,
    default: "pending",
  },
  date_issued: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Invoice = mongoose.model("invoices", InvoiceSchema);
