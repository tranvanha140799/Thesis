import express from 'express';
import {
  getDiscounts,
  getDiscountsBySearch,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../controllers/discounts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDiscounts);
router.get('/search', getDiscountsBySearch);
router.post('/', auth, createDiscount);
router.patch('/:id', auth, updateDiscount);
router.delete('/:id', auth, deleteDiscount);

export default router;
