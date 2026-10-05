const newsService = require("../services/news.service");

function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

async function create(req, res, next) {
    try {
        const news = newsService.createNews(req.body);
        return res.status(201).json({
            success: true,
            data: news,
        });
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const data = newsService.listNews({
            keyword: req.query.keyword,
            page: req.query.page,
            size: req.query.size,
            sortBy: req.query.sortBy,
            order: req.query.order,
        });

        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid news id",
            });
        }

        const news = newsService.getNewsById(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid news id",
            });
        }

        const news = newsService.updateNews(id, req.body);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid news id",
            });
        }

        const deleted = newsService.deleteNews(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        return res.json({
            success: true,
            message: "News deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    list,
    getById,
    update,
    remove,
};
