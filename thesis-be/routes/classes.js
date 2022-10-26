import express from 'express';
import {
  getClasses,
  getClassesBySearch,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classes.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClasses);
router.get('/search', getClassesBySearch);
router.post('/', auth, createClass);
router.patch('/:id', auth, updateClass);
router.delete('/:id', auth, deleteClass);

export default router;
