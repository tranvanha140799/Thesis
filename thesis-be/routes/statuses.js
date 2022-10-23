import express from 'express';
import {
  getStatuses,
  getStatusesBySearch,
  createStatus,
  updateStatus,
  deleteStatus,
} from '../controllers/statuses.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStatuses);
router.get('/search', getStatusesBySearch);
router.post('/', auth, createStatus);
router.patch('/:id', auth, updateStatus);
router.delete('/:id', auth, deleteStatus);

export default router;
