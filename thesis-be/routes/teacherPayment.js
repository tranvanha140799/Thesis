import express from 'express';
import {
  getTeacherPayments,
  getTeacherPaymentsBySearch,
  createTeacherPayment,
  updateTeacherPayment,
  deleteTeacherPayment,
} from '../controllers/teacherPayment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTeacherPayments);
router.get('/search', getTeacherPaymentsBySearch);
router.post('/', auth, createTeacherPayment);
router.patch('/:id', auth, updateTeacherPayment);
router.delete('/:id', auth, deleteTeacherPayment);

export default router;
