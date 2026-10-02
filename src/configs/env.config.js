const path = require('path');
const dotenv = require('dotenv');

// Nạp các biến từ file .env
dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'nv17_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB_PATH: path.resolve(process.cwd(), process.env.DB_PATH || './src/data/database.sqlite'),
  VNEXPRESS_RSS_URL: process.env.VNEXPRESS_RSS_URL || 'https://vnexpress.net/rss/tin-moi-nhat.rss'
};

// Đăng ký biến toàn cục global.CONFIG để dễ truy cập ở bất cứ đâu
global.CONFIG = envConfig;

module.exports = envConfig;
