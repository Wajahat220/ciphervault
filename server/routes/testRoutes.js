const express = require('express');
const router = express.Router();
const { aesPerformance, desPerformance, comparison } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.get('/aes-performance', protect, aesPerformance);
router.get('/des-performance', protect, desPerformance);
router.get('/comparison', protect, comparison);

module.exports = router;
