const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    adminUsername,
    adminPassword,
    adminPasswordHash,
    jwtSecret,
} = require("../config/env");

async function login(req, res) {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "username and password are required",
        });
    }

    const usernameOk = username === adminUsername;

    let passwordOk = false;

    if (adminPasswordHash) {
        passwordOk = await bcrypt.compare(password, adminPasswordHash);
    } else if (adminPassword) {
        // Demo fallback for the starter project. Prefer ADMIN_PASSWORD_HASH.
        passwordOk = password === adminPassword;
    }

    if (!usernameOk || !passwordOk) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password",
        });
    }

    const token = jwt.sign(
        {
            sub: username,
            role: "admin",
        },
        jwtSecret,
        { expiresIn: "2h" }
    );

    return res.json({
        success: true,
        data: {
            token,
            tokenType: "Bearer",
            expiresIn: "2h",
        },
    });
}

module.exports = { login };
