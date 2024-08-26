const httpStatus = require("./httpStatus");
const httpStatusText = require("./httpStatusText");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode
    ? err.statusCode
    : httpStatus.INTERNAL_SERVER_ERROR;
  res.status(statusCode);
  res.json({
    message: err.message,
    status: err.statusText || httpStatusText[statusCode],
    code: err.statusCode || httpStatus[statusCode],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = errorHandler;
