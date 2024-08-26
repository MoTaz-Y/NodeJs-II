const express = require("express");
const userRole = require("../utils/userRole");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require("../controller/users.controller");
const { registerUser, loginUser } = require("../controller/users.auth");
const allowedTo = require("../middleware/allowedTo");
const verifyToken = require("../middleware/verifyToken");
const validationSchema = require("../middleware/userValidationSchema");
const multer = require("multer");
const httpStatus = require("../utils/httpStatus");
const httpStatusText = require("../utils/httpStatusText");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(
      AppError.create(
        httpStatus.BAD_REQUEST,
        "Only image files are allowed!",
        httpStatusText.BAD_REQUEST
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
router
  .route("/")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN),
    getAllUsers
  );
router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    getSingleUser
  )
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.SUPERADMIN, userRole.USER),
    deleteUser
  );
router
  .route("/register")
  .post(upload.single("avatar"), validationSchema(), registerUser);
router.route("/login").post(validationSchema(), loginUser);

module.exports = router;
