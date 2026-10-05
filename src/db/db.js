const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { dbPath } = require("../config/env");

const absoluteDbPath = path.resolve(dbPath);
const dbDir = path.dirname(absoluteDbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(absoluteDbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

module.exports = db;
