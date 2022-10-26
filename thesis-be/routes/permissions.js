import express from 'express';
import {
  getPermissions,
  getPermissionsBySearch,
  createPermission,
  updatePermission,
  deletePermission,
} from '../controllers/permissions.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPermissions);
router.get('/search', getPermissionsBySearch);
router.post('/', auth, createPermission);
router.patch('/:id', auth, updatePermission);
router.delete('/:id', auth, deletePermission);

export default router;
