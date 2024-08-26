const User = require("../models/users.models");
const httpStatus = require("../utils/httpStatus");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const generateJWT = require("../utils/generateJWT");

const registerUser = asyncWrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      httpStatusText.BAD_REQUEST
    );
    return next(error);
  }
  const { fName, lName, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    const error = AppError.create(
      httpStatus.BAD_REQUEST,
      "User already exists",
      httpStatusText.BAD_REQUEST
    );
    return next(error);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    fName,
    lName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });
  const token = await generateJWT({
    email: user.email,
    _id: user._id,
    role: user.role,
  });
  user.token = token;
  await user.save();
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      user,
    },
  });
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = AppError.create(
      httpStatus.BAD_REQUEST,
      "Invalid credentials",
      httpStatusText.BAD_REQUEST
    );
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = AppError.create(
      httpStatus.BAD_REQUEST,
      "Invalid credentials",
      httpStatusText.BAD_REQUEST
    );
    return next(error);
  }
  const token = await generateJWT({
    email: user.email,
    _id: user._id,
    role: user.role,
  });
  user.token = token;
  await user.save();
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      user,
    },
  });
});


module.exports = {
  registerUser,
  loginUser,
};