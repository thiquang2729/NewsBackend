require('./configs/env.config');
const initDatabase = require('./models/initDb');
const rssService = require('./services/rss.service');
const app = require('./app');

// Khởi tạo database và các bảng
initDatabase();

// Tự động đồng bộ RSS ban đầu trong chế độ nền
rssService.syncVnExpressRss().catch(err => {
  console.warn('[SERVER] Không thể đồng bộ RSS ban đầu:', err.message);
});

const PORT = global.CONFIG.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] Đang lắng nghe tại cổng http://localhost:${PORT}`);
});

