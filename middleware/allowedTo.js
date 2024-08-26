const httpStatus = require("../utils/httpStatus");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = AppError.create(
        httpStatus.UNAUTHORIZED,
        "Unauthorized",
        httpStatusText.UNAUTHORIZED
      );
      return next(error);
    }
    next();
  };
};
