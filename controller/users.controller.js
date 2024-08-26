const User = require("../models/users.models");
const httpStatus = require("../utils/httpStatus");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}).limit(limit).skip(skip);
  if (!users) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "No users found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }

  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      users,
    },
  });
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "User not found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      user,
    },
  });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "User not found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }
  await User.findByIdAndDelete(id);
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
};
