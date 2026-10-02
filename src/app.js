const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route gốc chào mừng
app.get("/", (req, res) => {
  res.json({
    message: "NV17",
    docs: "/api/health",
  });
});

// Gắn toàn bộ API routes với tiền tố /api
app.use("/api", apiRoutes);

// Middleware bắt route không tồn tại (404)
const notFoundHandler = require("./middlewares/notFound.middleware");
app.use(notFoundHandler);

// Middleware xử lý lỗi tập trung toàn cục (Error Handler)
const errorHandler = require("./middlewares/errorHandler.middleware");
app.use(errorHandler);

module.exports = app;
