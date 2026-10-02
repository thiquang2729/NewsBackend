const NewsModel = require('../models/news.model');
const rssService = require('../services/rss.service');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const newsController = {
  /**
   * API Public: Lấy danh sách tin tức (phân trang & tìm kiếm)
   * GET /api/public/news?page=1&limit=10&search=covid
   */
  getNewsList: async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
      const search = req.query.search || '';

      // Nếu database chưa có tin nào, tự động sync từ VnExpress lần đầu
      if (NewsModel.count() === 0) {
        try {
          await rssService.syncVnExpressRss();
        } catch (syncErr) {
          console.warn('[NEWS] Lỗi tự động sync lần đầu:', syncErr.message);
        }
      }

      const { items, pagination } = NewsModel.findAll({ page, limit, search });

      return ApiResponse.success(res, {
        message: 'Lấy danh sách tin tức thành công',
        data: items,
        pagination
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * API Public: Đọc chi tiết 1 tin tức theo ID
   * GET /api/public/news/:id
   */
  getNewsDetail: async (req, res, next) => {
    try {
      const newsId = parseInt(req.params.id);
      if (isNaN(newsId)) {
        throw ApiError.badRequest('ID tin tức phải là một số hợp lệ');
      }

      const article = NewsModel.findById(newsId);
      if (!article) {
        throw ApiError.notFound(`Không tìm thấy tin tức với ID: ${newsId}`);
      }

      return ApiResponse.success(res, {
        message: 'Lấy chi tiết tin tức thành công',
        data: article
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * API Public / Utility: Đồng bộ cập nhật tin tức mới từ VnExpress RSS
   * POST /api/public/news/sync-rss hoặc GET /api/public/news/sync-rss
   */
  syncRss: async (req, res, next) => {
    try {
      const result = await rssService.syncVnExpressRss();
      return ApiResponse.success(res, {
        message: 'Đồng bộ tin tức từ VnExpress RSS thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = newsController;
