const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  revenue_id: {
    type: String,
    required: true,
    unique: true
  },
  salesData: {
    type: Number,
    required: true
  },
  expenseData: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  //rsupervisor_id: {
    //type: String,
    //type: mongoose.Schema.Types.ObjectId,
    //required: true,
    //ref: revenueSupervisor // reference to supervisor collection if exists
  //}
}, { timestamps: true });

module.exports = mongoose.model("Revenue", revenueSchema);
//module.exports = mongoose.model("RevenueSupervisor", revenue_supervisorSchema);