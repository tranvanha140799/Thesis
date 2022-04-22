import express from 'express';
import {
  getStudents,
  getStudentsBySearch,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/students.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/search', getStudentsBySearch);
router.post('/', auth, createStudent);
router.patch('/:id', auth, updateStudent);
router.delete('/:id', auth, deleteStudent);

export default router;
