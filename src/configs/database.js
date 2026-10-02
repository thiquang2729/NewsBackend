const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const envConfig = require('./env.config');

const dbDir = path.dirname(envConfig.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Khởi tạo kết nối SQLite Database
const db = new DatabaseSync(envConfig.DB_PATH);

// Bật kiểm tra khóa ngoại (Foreign Keys)
db.exec('PRAGMA foreign_keys = ON;');

// Đăng ký biến toàn cục global.db theo yêu cầu xây dựng biến toàn cục
global.db = db;

console.log(`[DATABASE] Đã kết nối SQLite thành công tại: ${envConfig.DB_PATH}`);

module.exports = db;
