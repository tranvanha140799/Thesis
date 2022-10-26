import express from 'express';
import {
  getPaySalaries,
  getPaySalariesBySearch,
  createPaySalary,
  updatePaySalary,
  deletePaySalary,
} from '../controllers/paySalaries.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPaySalaries);
router.get('/search', getPaySalariesBySearch);
router.post('/', auth, createPaySalary);
router.patch('/:id', auth, updatePaySalary);
router.delete('/:id', auth, deletePaySalary);

export default router;
