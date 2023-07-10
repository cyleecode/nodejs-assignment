const {
  CONVERSION_ISSUE,
  FILE_MISSING,
  QUERY_MISSING,
} = require("../shared/error");

const errorHandler = (err, req, res, next) => {
  let statusCode;
  let errorMessage;
  if (err?.message) errorMessage = err.message;
  switch (err?.name) {
    case CONVERSION_ISSUE:
      statusCode = 500;
      break;
    case FILE_MISSING:
      statusCode = 400;
      break;
    case QUERY_MISSING:
      statusCode = 400;
      break;
    default:
      statusCode = 500;
      errorMessage = "Unknown issue";
  }

  res.status(statusCode).send(errorMessage);
};

module.exports = errorHandler;
