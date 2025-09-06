const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  inventory_id: {
    type: String,
    required: true,
    ref: "Inventory" // references inventory collection
  }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);