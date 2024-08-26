const jwt = require("jsonwebtoken");
const httpStatus = require("../utils/httpStatus");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = AppError.create(
      httpStatus.UNAUTHORIZED,
      "Unauthorized",
      httpStatusText.UNAUTHORIZED
    );
    return next(error);
  }
  jwt.varify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const error = AppError.create(
        httpStatus.UNAUTHORIZED,
        "Unauthorized",
        httpStatusText.UNAUTHORIZED
      );
      return next(error);
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
