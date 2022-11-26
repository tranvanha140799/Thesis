import express from 'express';
import {
  getClassTeachers,
  getClassTeachersBySearch,
  createClassTeacher,
  updateClassTeacher,
  deleteClassTeacher,
} from '../controllers/classTeacher.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClassTeachers);
router.get('/search', getClassTeachersBySearch);
router.post('/', auth, createClassTeacher);
router.patch('/:id', auth, updateClassTeacher);
router.delete('/:id', auth, deleteClassTeacher);

export default router;
