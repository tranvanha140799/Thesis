import express from 'express';
import {
  getSalaryPaymentDetails,
  getSalaryPaymentDetailsBySearch,
  createSalaryPaymentDetail,
  updateSalaryPaymentDetail,
  deleteSalaryPaymentDetail,
} from '../controllers/salaryPaymentDetail.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSalaryPaymentDetails);
router.get('/search', getSalaryPaymentDetailsBySearch);
router.post('/', auth, createSalaryPaymentDetail);
router.patch('/:id', auth, updateSalaryPaymentDetail);
router.delete('/:id', auth, deleteSalaryPaymentDetail);

export default router;
