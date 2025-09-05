const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  crop_id: {
    type: String,
    required: true,
    unique: true
  },
  plantingDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  waterIntake: {
    type: String,
    required: true
  },
  fertilizerIntake: {
    type: String,
    required: true
  },
  employee_id: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Plant",plantSchema);