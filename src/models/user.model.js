const db = require('../configs/database');

class UserModel {
  /**
   * Tạo người dùng mới
   */
  static create({ username, email, passwordHash, role = 'user' }) {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, email, passwordHash, role);
    return this.findById(Number(result.lastInsertRowid));
  }

  /**
   * Tìm người dùng theo email
   */
  static findByEmail(email) {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ? LIMIT 1`);
    return stmt.get(email) || null;
  }

  /**
   * Tìm người dùng theo username
   */
  static findByUsername(username) {
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ? LIMIT 1`);
    return stmt.get(username) || null;
  }

  /**
   * Tìm người dùng theo ID (không trả về password_hash)
   */
  static findById(id) {
    const stmt = db.prepare(`
      SELECT id, username, email, role, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `);
    return stmt.get(id) || null;
  }
}

module.exports = UserModel;
