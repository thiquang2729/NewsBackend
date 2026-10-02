class ApiResponse {
  /**
   * Trả về response thành công chuẩn
   */
  static success(res, { message = 'Thao tác thành công', data = null, pagination = null, statusCode = 200 }) {
    const responsePayload = {
      success: true,
      message,
      data
    };

    if (pagination) {
      responsePayload.pagination = pagination;
    }

    return res.status(statusCode).json(responsePayload);
  }

  /**
   * Trả về response 201 Created chuẩn
   */
  static created(res, { message = 'Tạo mới thành công', data = null }) {
    return this.success(res, { message, data, statusCode: 201 });
  }

  /**
   * Trả về response lỗi chuẩn
   */
  static error(res, { message = 'Đã có lỗi xảy ra', statusCode = 500, errors = null }) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ApiResponse;
