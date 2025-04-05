import { Router } from 'express';
import {
	createBatchSubmission,
	checkBatchSubmission,
	checkSubmission,
	getUserSubmissions,
} from '../controller/submission.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

router.use(authMiddleware);

router.post('/createSubmission/:problemSlug', createBatchSubmission);
router.post('/check', checkBatchSubmission);
router.get('/checkSubmission', checkSubmission);
router.get('/userSubmissions/:problemSlug', getUserSubmissions);

export default router;
