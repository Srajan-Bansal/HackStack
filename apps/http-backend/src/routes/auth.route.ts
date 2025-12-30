import { Router } from 'express';
import { signup, login, logout, getUser } from '../controller/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router: Router = Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

router.get('/me', authMiddleware, getUser);

export default router;
