const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  reportedUser: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("reports", reportSchema);