// routes/transactionRoutes.js
const express = require('express');
const { getBalance, withdraw, transfer, credit , transactionHistory} = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/balance', authMiddleware, getBalance);
router.post('/credit', authMiddleware, credit);
router.post('/withdraw', authMiddleware, withdraw);
router.post('/transfer', authMiddleware, transfer);
router.post('/history', authMiddleware, transactionHistory);

module.exports = router;
