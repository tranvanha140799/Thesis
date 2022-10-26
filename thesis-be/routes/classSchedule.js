import express from 'express';
import {
  getClassSchedules,
  getClassSchedulesBySearch,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
} from '../controllers/classSchedule.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClassSchedules);
router.get('/search', getClassSchedulesBySearch);
router.post('/', auth, createClassSchedule);
router.patch('/:id', auth, updateClassSchedule);
router.delete('/:id', auth, deleteClassSchedule);

export default router;
