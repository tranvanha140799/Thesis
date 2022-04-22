import express from 'express';
import {
  getTeachers,
  getTeachersBySearch,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teachers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTeachers);
router.get('/search', getTeachersBySearch);
router.post('/', auth, createTeacher);
router.patch('/:id', auth, updateTeacher);
router.delete('/:id', auth, deleteTeacher);

export default router;
