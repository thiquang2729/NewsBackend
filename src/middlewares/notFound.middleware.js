const ApiError = require('../utils/apiError');

/**
 * Middleware bắt các route không tồn tại (404)
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Đường dẫn ${req.method} ${req.originalUrl} không tồn tại trên hệ thống`));
};

module.exports = notFoundHandler;
