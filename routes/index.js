const express = require('express');
const router = express.Router();

// 🔹 Admin routes
router.use('/admin', require('./admin/register'));
router.use('/admin', require('./admin/login'));
router.use('/admin', require('./admin/verify'));
router.use('/admin', require('./admin/panel'));
router.use('/admin', require('./admin/dashboard'));
router.use('/admin', require('./admin/logout'));
router.use('/admin', require('./admin/reset'));
router.use('/admin', require('./admin/unsubscribe'));

// 🔹 API routes
router.use('/api', require('./api/newsletter'));
router.use('/api', require('./api/unsubscribe'));

// 🔹 Main routes
router.use('/', require('./main'));
router.use('/', require('./send-appointment')); // ή όπως εσύ ορίζεις

module.exports = router;
