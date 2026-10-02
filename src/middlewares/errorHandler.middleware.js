const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Lỗi máy chủ nội bộ';
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'JSON body không đúng định dạng';
  } else if (err.message) {
    message = err.message;
  }

  // Log lỗi chi tiết nếu ở môi trường dev hoặc lỗi 500
  if (statusCode === 500) {
    console.error('[ERROR_HANDLER]', err);
  }

  return ApiResponse.error(res, {
    message,
    statusCode,
    errors
  });
};

module.exports = errorHandler;
