import express from 'express';
import {
  getSalaries,
  getSalariesBySearch,
  createSalary,
  updateSalary,
  deleteSalary,
} from '../controllers/salaries.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSalaries);
router.get('/search', getSalariesBySearch);
router.post('/', auth, createSalary);
router.patch('/:id', auth, updateSalary);
router.delete('/:id', auth, deleteSalary);

export default router;
