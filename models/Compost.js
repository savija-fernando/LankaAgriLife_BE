const mongoose = require("mongoose");

const compostSchema = new mongoose.Schema({
  compost_id: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["fermenting", "ready", "used", "discarded"], // you can customize statuses
    required: true
  },
  fermentingDate: {
    type: Date,
    required: true
  },
  employee_id: {
    type: String,
    required: true,
    ref: "Employee" // references employee collection
  },
  waste_id: {
    type: String,
    required: true,
    ref: "Waste" // references waste collection
  },
  inventory_id: {
    type: String,
    required: true,
    ref: "Inventory" // references inventory collection
  }
}, { timestamps: true });

module.exports = mongoose.model("Compost", compostSchema);