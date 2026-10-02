const ApiError = require('../utils/apiError');

/**
 * Middleware kiểm tra các trường bắt buộc trong req.body
 * @param {Array<string>} requiredFields - Danh sách tên các trường bắt buộc
 */
const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return next(
        ApiError.badRequest(
          `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`,
          missingFields.map(field => ({ field, message: `${field} không được để trống` }))
        )
      );
    }

    next();
  };
};

module.exports = {
  validateBody
};
