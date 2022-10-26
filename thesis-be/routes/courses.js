import express from 'express';
import {
  getCourses,
  getCoursesBySearch,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/search', getCoursesBySearch);
router.post('/', auth, createCourse);
router.patch('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

export default router;
