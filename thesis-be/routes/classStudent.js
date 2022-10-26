import express from 'express';
import {
  getClassStudents,
  getClassStudentsBySearch,
  createClassStudent,
  updateClassStudent,
  deleteClassStudent,
} from '../controllers/classStudent.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClassStudents);
router.get('/search', getClassStudentsBySearch);
router.post('/', auth, createClassStudent);
router.patch('/:id', auth, updateClassStudent);
router.delete('/:id', auth, deleteClassStudent);

export default router;
