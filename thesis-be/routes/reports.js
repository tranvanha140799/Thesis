import express from 'express';
import {
  getReports,
  getReportsBySearch,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/reports.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReports);
router.get('/search', getReportsBySearch);
router.post('/', auth, createReport);
router.patch('/:id', auth, updateReport);
router.delete('/:id', auth, deleteReport);

export default router;
