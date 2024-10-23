import express from 'express';
import { addTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction, getSummary } from '../controllers/transactionController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Transaction routes
router.post('/transactions', authenticateToken, addTransaction);
router.get('/transactions', authenticateToken, getAllTransactions);
router.get('/transactions/:id', authenticateToken, getTransactionById);
router.put('/transactions/:id', authenticateToken, updateTransaction);
router.delete('/transactions/:id', authenticateToken, deleteTransaction);
router.get('/summary', authenticateToken, getSummary);

export const transactionRouter=router;
