require('./configs/env.config');
const initDatabase = require('./models/initDb');
const app = require('./app');

// Khởi tạo database và các bảng
initDatabase();

const PORT = global.CONFIG.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] Đang lắng nghe tại cổng http://localhost:${PORT}`);
});

