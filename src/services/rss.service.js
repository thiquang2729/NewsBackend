const Parser = require('rss-parser');
const NewsModel = require('../models/news.model');
const envConfig = require('../configs/env.config');

class RssService {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['content', 'description']
      }
    });
  }

  /**
   * Trích xuất URL hình ảnh từ chuỗi HTML thẻ <img> trong RSS VnExpress
   */
  extractImageFromHtml(html) {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  }

  /**
   * Loại bỏ các thẻ HTML để lấy văn bản thuần túy
   */
  stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim();
  }

  /**
   * Đồng bộ tin tức từ VnExpress RSS Feed vào SQLite
   */
  async syncVnExpressRss(feedUrl = envConfig.VNEXPRESS_RSS_URL) {
    try {
      console.log(`[RSS] Đang tải tin tức từ: ${feedUrl}...`);
      const feed = await this.parser.parseURL(feedUrl);

      let newArticlesCount = 0;

      for (const item of feed.items) {
        const rawHtml = item.content || item.description || '';
        const image = this.extractImageFromHtml(rawHtml);
        const description = item.contentSnippet || this.stripHtml(rawHtml);

        const inserted = NewsModel.insertOrIgnore({
          title: item.title,
          description,
          content: description,
          link: item.link,
          image: image || null,
          pubDate: item.pubDate,
          author: 'VnExpress',
          source: 'VnExpress'
        });

        if (inserted) {
          newArticlesCount++;
        }
      }

      console.log(`[RSS] Đồng bộ thành công: ${newArticlesCount} tin mới đã được thêm.`);
      return {
        feedTitle: feed.title,
        totalFetched: feed.items.length,
        newArticlesCount,
        totalInDatabase: NewsModel.count()
      };
    } catch (error) {
      console.error('[RSS ERROR] Không thể đồng bộ tin tức RSS:', error.message);
      throw error;
    }
  }
}

module.exports = new RssService();
