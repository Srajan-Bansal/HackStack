import { Router } from 'express';
import {
	createBatchSubmission,
	checkBatchSubmission,
} from '../controller/submission.controller';

const router: Router = Router();

router.post('/createSubmission/:problemSlug', createBatchSubmission);
router.post('/check', checkBatchSubmission);

export default router;
