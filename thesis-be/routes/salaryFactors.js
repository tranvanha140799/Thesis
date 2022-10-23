import express from 'express';
import {
  getSalaryFactors,
  getSalaryFactorsBySearch,
  createSalaryFactor,
  updateSalaryFactor,
  deleteSalaryFactor,
} from '../controllers/salaryFactors.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSalaryFactors);
router.get('/search', getSalaryFactorsBySearch);
router.post('/', auth, createSalaryFactor);
router.patch('/:id', auth, updateSalaryFactor);
router.delete('/:id', auth, deleteSalaryFactor);

export default router;
