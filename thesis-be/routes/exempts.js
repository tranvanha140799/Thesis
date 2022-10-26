import express from 'express';
import {
  getExempts,
  getExemptsBySearch,
  createExempt,
  updateExempt,
  deleteExempt,
} from '../controllers/exempts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getExempts);
router.get('/search', getExemptsBySearch);
router.post('/', auth, createExempt);
router.patch('/:id', auth, updateExempt);
router.delete('/:id', auth, deleteExempt);

export default router;
