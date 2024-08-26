const express = require("express");
const userRole = require("../utils/userRole");
const router = express.Router();
const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/courses.controller");
const allowedTo = require("../middleware/allowedTo");
const verifyToken = require("../middleware/verifyToken");
const validationSchema = require("../middleware/courseValidationSchema");

router
  .route("/")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN),
    getAllCourses
  )
  .post(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    validationSchema(),
    createCourse
  );

router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    getSingleCourse
  )
  .patch(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    updateCourse
  )
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    deleteCourse
  );

module.exports = router;
