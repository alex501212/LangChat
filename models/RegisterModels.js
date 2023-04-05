const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nativeLang: {
    type: String,
    required: true,
  },
  targetLang: {
    type: String,
    required: true,
  },
  signupdate: {
    type: Date,
    default: Date.now,
  },
  banEndDate: {
    type: Date,
    default: null
  },
});

module.exports = mongoose.model("accounts", registerSchema);
