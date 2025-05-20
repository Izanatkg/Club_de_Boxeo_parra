const express = require('express');
const router = express.Router();
const { createSale, getSales, updateSale, deleteSale } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSale);
router.get('/', protect, getSales);
router.put('/:id', protect, updateSale);
router.delete('/:id', protect, deleteSale);

module.exports = router;
