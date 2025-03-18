import { Router } from 'express';
import { signup, login, logout, getUser } from '../controller/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', authMiddleware, getUser);

export default router;
