const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] Đang lắng nghe tại cổng http://localhost:${PORT}`);
});
