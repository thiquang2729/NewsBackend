const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middlewares/validate.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

// POST /api/auth/register
router.post('/register', validateBody(['username', 'email', 'password']), authController.register);

// POST /api/auth/login
router.post('/login', validateBody(['email', 'password']), authController.login);

// GET /api/auth/me (Cần token để lấy thông tin tài khoản hiện tại)
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
