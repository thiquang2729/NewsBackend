const db = require("./db");

function initDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            source TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_news_created_at
        ON news(created_at);

        CREATE INDEX IF NOT EXISTS idx_news_title
        ON news(title);
    `);
}

module.exports = initDatabase;
