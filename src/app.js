const express = require("express");
const cors = require("cors");
const path = require("path");
const { port } = require("./config/env");
const initDatabase = require("./db/init");
const authRoutes = require("./routes/auth.routes");
const newsRoutes = require("./routes/news.routes");
const fileRoutes = require("./routes/file.routes");
const errorHandler = require("./middleware/errorHandler");

initDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "News API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/private/news", newsRoutes);
app.use("/api/private/files", fileRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
