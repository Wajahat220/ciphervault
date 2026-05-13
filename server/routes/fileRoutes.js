const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadFile,
  getFiles,
  downloadFile,
  verifyFile,
  deleteFile,
} = require('../controllers/fileController');

// Use memory storage so we handle the buffer directly
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getFiles);
router.get('/:id/download', protect, downloadFile);
router.get('/:id/verify', protect, verifyFile);
router.delete('/:id', protect, deleteFile);

module.exports = router;
