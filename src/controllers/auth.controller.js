const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

const authController = {
  /**
   * API Đăng ký tài khoản: POST /api/auth/register
   */
  register: async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;
      const result = await AuthService.register({ username, email, password, role });
      return ApiResponse.created(res, {
        message: 'Đăng ký tài khoản thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * API Đăng nhập tài khoản: POST /api/auth/login
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      return ApiResponse.success(res, {
        message: 'Đăng nhập thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * API Lấy thông tin tài khoản hiện tại: GET /api/auth/me
   */
  getProfile: async (req, res, next) => {
    try {
      return ApiResponse.success(res, {
        message: 'Lấy thông tin cá nhân thành công',
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
