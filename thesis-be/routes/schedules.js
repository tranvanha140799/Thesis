import express from 'express';
import {
  getSchedules,
  getSchedulesBySearch,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/schedules.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSchedules);
router.get('/search', getSchedulesBySearch);
router.post('/', auth, createSchedule);
router.patch('/:id', auth, updateSchedule);
router.delete('/:id', auth, deleteSchedule);

export default router;
