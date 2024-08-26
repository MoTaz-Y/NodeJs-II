const httpStatusText = require("./httpStatusText");

const httpStatus = require("./httpStatus");

class AppError extends Error {
  constructor(statusCode, message, statusText) {
    super();
  }
  create(statusCode, message, statusText) {
    this.statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    this.message = message;
    this.statusText = statusText || httpStatusText.INTERNAL_SERVER_ERROR;
    return this;
  }
}

module.exports = AppError;
