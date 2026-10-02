class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Dữ liệu yêu cầu không hợp lệ', errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Không có quyền truy cập hoặc phiên đã hết hạn') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Bạn không có quyền thực hiện hành động này') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Không tìm thấy tài nguyên yêu cầu') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Dữ liệu đã tồn tại trong hệ thống') {
    return new ApiError(409, message);
  }

  static internal(message = 'Lỗi máy chủ nội bộ') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
