import express from 'express';
import {
  getExpenseOfMonthSheets,
  getExpenseOfMonthSheetsBySearch,
  createExpenseOfMonthSheet,
  updateExpenseOfMonthSheet,
  deleteExpenseOfMonthSheet,
} from '../controllers/expenseOfMonthSheets.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getExpenseOfMonthSheets);
router.get('/search', getExpenseOfMonthSheetsBySearch);
router.post('/', auth, createExpenseOfMonthSheet);
router.patch('/:id', auth, updateExpenseOfMonthSheet);
router.delete('/:id', auth, deleteExpenseOfMonthSheet);

export default router;
