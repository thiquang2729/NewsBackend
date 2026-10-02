const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const envConfig = require('../configs/env.config');
const UserModel = require('../models/user.model');

/**
 * Middleware xác thực Bearer JWT Token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next(ApiError.unauthorized('Vui lòng cung cấp Header Authorization với Bearer token'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(ApiError.unauthorized('Định dạng token không hợp lệ (cần "Bearer <token>")'));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    // Kiểm tra tài khoản có còn tồn tại trong hệ thống không
    const user = UserModel.findById(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized('Người dùng này không còn tồn tại trong hệ thống'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token đã hết hạn, vui lòng đăng nhập lại'));
    }
    return next(ApiError.unauthorized('Token không hợp lệ'));
  }
};

/**
 * Middleware phân quyền theo Role (ví dụ 'admin', 'user')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Bạn không có quyền thực hiện hành động này'));
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
