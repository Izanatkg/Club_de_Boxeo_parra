const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', getNotices);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, createNotice);
router.get('/:id', protect, getNoticeById);
router.put('/:id', protect, updateNotice);
router.delete('/:id', protect, deleteNotice);
router.put('/:id/toggle', protect, toggleNoticeStatus);

module.exports = router;
