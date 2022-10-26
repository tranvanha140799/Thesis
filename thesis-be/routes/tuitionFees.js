import express from 'express';
import {
  getTuitionFees,
  getTuitionFeesBySearch,
  createTuitionFee,
  updateTuitionFee,
  deleteTuitionFee,
} from '../controllers/tuitionFees.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTuitionFees);
router.get('/search', getTuitionFeesBySearch);
router.post('/', auth, createTuitionFee);
router.patch('/:id', auth, updateTuitionFee);
router.delete('/:id', auth, deleteTuitionFee);

export default router;
