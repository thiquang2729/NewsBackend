const dotenv = require("dotenv");

dotenv.config();

function required(name, fallback = undefined) {
    const value = process.env[name] ?? fallback;
    if (value === undefined || value === "") {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

module.exports = {
    port: Number(process.env.PORT || 3000),
    jwtSecret: required("JWT_SECRET"),
    dbPath: required("DB_PATH", "./news.db"),
    adminUsername: required("ADMIN_USERNAME", "admin"),
    adminPassword: process.env.ADMIN_PASSWORD || "",
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
};
