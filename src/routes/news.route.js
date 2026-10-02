const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

// GET /api/public/news - Xem danh sách tin tức (hỗ trợ ?page=1&limit=10&search=abc)
router.get('/', newsController.getNewsList);

// GET & POST /api/public/news/sync-rss - Đồng bộ tin tức từ VnExpress RSS
router.get('/sync-rss', newsController.syncRss);
router.post('/sync-rss', newsController.syncRss);

// GET /api/public/news/:id - Xem chi tiết một bài viết theo ID
router.get('/:id', newsController.getNewsDetail);

module.exports = router;
