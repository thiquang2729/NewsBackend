const db = require('../configs/database');

class NewsModel {
  /**
   * Lưu tin tức từ RSS vào database (bỏ qua nếu link đã tồn tại)
   */
  static insertOrIgnore({ title, description, content, link, image, pubDate, author = 'VnExpress', source = 'VnExpress' }) {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO news (title, description, content, link, image, pub_date, author, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, content, link, image, pubDate, author, source);
    return result.changes > 0;
  }

  /**
   * Lấy danh sách tin tức có phân trang và tìm kiếm (Public)
   */
  static findAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search.trim()}%`;

    // Đếm tổng số bài viết
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total
      FROM news
      WHERE title LIKE ? OR description LIKE ?
    `);
    const { total } = countStmt.get(searchPattern, searchPattern);

    // Lấy dữ liệu bài viết theo trang
    const selectStmt = db.prepare(`
      SELECT id, title, description, content, link, image, pub_date, author, source, created_at
      FROM news
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);
    const items = selectStmt.all(searchPattern, searchPattern, limit, offset);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    };
  }

  /**
   * Lấy chi tiết một bài viết theo ID
   */
  static findById(id) {
    const stmt = db.prepare(`
      SELECT id, title, description, content, link, image, pub_date, author, source, created_at, updated_at
      FROM news
      WHERE id = ?
      LIMIT 1
    `);
    return stmt.get(id) || null;
  }

  /**
   * Đếm tổng số lượng tin tức hiện có
   */
  static count() {
    const stmt = db.prepare(`SELECT COUNT(*) as total FROM news`);
    return stmt.get().total;
  }
}

module.exports = NewsModel;
