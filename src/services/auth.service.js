const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/apiError');
const envConfig = require('../configs/env.config');

class AuthService {
  /**
   * Tạo JWT Token từ thông tin người dùng
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    );
  }

  /**
   * Đăng ký tài khoản mới
   */
  static async register({ username, email, password, role = 'user' }) {
    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw ApiError.badRequest('Định dạng email không hợp lệ');
    }

    if (password.length < 6) {
      throw ApiError.badRequest('Mật khẩu phải chứa ít nhất 6 ký tự');
    }

    // Kiểm tra trùng email
    const existingEmail = UserModel.findByEmail(email);
    if (existingEmail) {
      throw ApiError.conflict('Email này đã được sử dụng');
    }

    // Kiểm tra trùng username
    const existingUsername = UserModel.findByUsername(username);
    if (existingUsername) {
      throw ApiError.conflict('Tên đăng nhập này đã được sử dụng');
    }

    // Băm mật khẩu
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Lưu người dùng vào database
    const newUser = UserModel.create({
      username,
      email,
      passwordHash,
      role
    });

    // Tạo JWT token
    const token = this.generateToken(newUser);

    return {
      user: newUser,
      token
    };
  }

  /**
   * Đăng nhập tài khoản
   */
  static async login({ email, password }) {
    const user = UserModel.findByEmail(email);
    if (!user) {
      throw ApiError.badRequest('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Email hoặc mật khẩu không chính xác');
    }

    // Loại bỏ password_hash khi trả về cho client
    const { password_hash, ...safeUser } = user;
    const token = this.generateToken(safeUser);

    return {
      user: safeUser,
      token
    };
  }
}

module.exports = AuthService;
