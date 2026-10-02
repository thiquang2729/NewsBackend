const express = require('express');
const router = express.Router();
const healthRoute = require('./health.route');
const authRoute = require('./auth.route');
const newsRoute = require('./news.route');

router.use('/', healthRoute);
router.use('/auth', authRoute);
router.use('/public/news', newsRoute);

module.exports = router;
