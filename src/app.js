const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route gốc chào mừng
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng bạn đến với API Backend Nhiệm vụ 17',
    docs: '/api/health'
  });
});

// Gắn toàn bộ API routes với tiền tố /api
app.use('/api', apiRoutes);

module.exports = app;
