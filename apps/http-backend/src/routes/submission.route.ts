import { Router } from 'express';
import {
	createSubmission,
	checkSubmission,
	getUserSubmissions,
} from '../controller/submission.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

router.use(authMiddleware);

router.post('/createSubmission/:problemSlug', createSubmission);
router.get('/checkSubmission', checkSubmission);
router.get('/userSubmissions/:problemSlug', getUserSubmissions);

export default router;
