const db = require("../db/db");

const SORT_COLUMNS = {
    id: "id",
    title: "title",
    author: "author",
    source: "source",
    createdAt: "created_at",
    updatedAt: "updated_at",
};

function normalizeNewsRow(row) {
    if (!row) return null;

    return {
        id: row.id,
        title: row.title,
        content: row.content,
        author: row.author,
        source: row.source,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function validatePayload(payload) {
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const content = typeof payload.content === "string" ? payload.content.trim() : "";
    const author = typeof payload.author === "string" ? payload.author.trim() : "";
    const source = payload.source == null ? null : String(payload.source).trim();

    if (!title) {
        const error = new Error("title is required");
        error.statusCode = 400;
        throw error;
    }
    if (!content) {
        const error = new Error("content is required");
        error.statusCode = 400;
        throw error;
    }
    if (!author) {
        const error = new Error("author is required");
        error.statusCode = 400;
        throw error;
    }

    return { title, content, author, source: source || null };
}

function createNews(payload) {
    const data = validatePayload(payload);

    const result = db.prepare(`
        INSERT INTO news (title, content, author, source)
        VALUES (?, ?, ?, ?)
    `).run(data.title, data.content, data.author, data.source);

    return getNewsById(result.lastInsertRowid);
}

function getNewsById(id) {
    const row = db.prepare(`
        SELECT id, title, content, author, source, created_at, updated_at
        FROM news
        WHERE id = ?
    `).get(Number(id));

    return normalizeNewsRow(row);
}

function updateNews(id, payload) {
    const existing = getNewsById(id);
    if (!existing) return null;

    const data = validatePayload(payload);

    db.prepare(`
        UPDATE news
        SET title = ?, content = ?, author = ?, source = ?, updated_at = datetime('now')
        WHERE id = ?
    `).run(data.title, data.content, data.author, data.source, Number(id));

    return getNewsById(id);
}

function deleteNews(id) {
    const result = db.prepare("DELETE FROM news WHERE id = ?").run(Number(id));
    return result.changes > 0;
}

function listNews({ keyword = "", page = 0, size = 10, sortBy = "createdAt", order = "desc" }) {
    const safePage = Math.max(Number(page) || 0, 0);
    const safeSize = Math.min(Math.max(Number(size) || 10, 1), 100);

    const column = SORT_COLUMNS[sortBy] || SORT_COLUMNS.createdAt;
    const direction = String(order).toLowerCase() === "asc" ? "ASC" : "DESC";
    const normalizedKeyword = String(keyword || "").trim();
    const where = normalizedKeyword ? "WHERE title LIKE ? OR content LIKE ? OR author LIKE ?" : "";
    const search = `%${normalizedKeyword}%`;

    const countStatement = normalizedKeyword
        ? db.prepare(`SELECT COUNT(*) AS total FROM news ${where}`)
        : db.prepare("SELECT COUNT(*) AS total FROM news");

    const total = normalizedKeyword
        ? countStatement.get(search, search, search).total
        : countStatement.get().total;

    const offset = safePage * safeSize;

    const listStatement = db.prepare(`
        SELECT id, title, content, author, source, created_at, updated_at
        FROM news
        ${where}
        ORDER BY ${column} ${direction}
        LIMIT ? OFFSET ?
    `);

    const rows = normalizedKeyword
        ? listStatement.all(search, search, search, safeSize, offset)
        : listStatement.all(safeSize, offset);

    return {
        items: rows.map(normalizeNewsRow),
        pagination: {
            page: safePage,
            size: safeSize,
            total,
            totalPages: Math.ceil(total / safeSize),
        },
        sort: {
            sortBy: Object.keys(SORT_COLUMNS).includes(sortBy) ? sortBy : "createdAt",
            order: direction.toLowerCase(),
        },
        keyword: normalizedKeyword,
    };
}

module.exports = {
    createNews,
    getNewsById,
    updateNews,
    deleteNews,
    listNews,
};
