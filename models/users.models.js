const mongoose = require("mongoose");
const userRole = require("../utils/userRole");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [userRole.ADMIN, userRole.USER, userRole.GUEST, userRole.SUPERADMIN],
    default: userRole.GUEST,
  },
  token: {
    type: String,
  },
  avatar: {
    type: String,
    default: "uploads/profile.webp",
  },
});

module.exports = mongoose.model("User", userSchema);
