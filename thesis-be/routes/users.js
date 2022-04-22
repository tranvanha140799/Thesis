import express from 'express';
import { signIn, signUp } from '../controllers/users.js';

const router = express.Router();

// router.get('/', (req, res) => {
//   res.send('Here');
// });
router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
