const Course = require("../models/course.model");
const httpStatus = require("../utils/httpStatus");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}).limit(limit).skip(skip);
  if (!courses) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "No courses found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }

  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      courses,
    },
  });
});

const getSingleCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "Course not found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      course,
    },
  });
});

const createCourse = asyncWrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(
      httpStatus.BAD_REQUEST,
      "Validation failed",
      httpStatusText.BAD_REQUEST
    );
    return next(error);
  }
  const { name, description, price } = req.body;
  const course = await Course.create({
    name,
    description,
    price,
  });
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      course,
    },
  });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id);
  if (!course) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "Course not found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }
  const updateCourse = await Course.updateOne(
    { _id: id },
    {
      $set: {
        ...req.body,
      },
    }
  );
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: {
      updateCourse,
    },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    const error = AppError.create(
      httpStatus.NOT_FOUND,
      "Course not found",
      httpStatusText.NOT_FOUND
    );
    return next(error);
  }
  await Course.findByIdAndDelete(id);
  return res.status(httpStatus.SUCCESS).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
