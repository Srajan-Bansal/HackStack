import { Router } from 'express';
import {
	getUserSubmissionsForProblem,
	getSubmissionDetails,
	getUserSubmissionStats,
} from './../controller/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

router.use(authMiddleware);

router.get('/problem/:problemSlug/submissions', getUserSubmissionsForProblem);
router.get('/submission/:submissionId', getSubmissionDetails);
router.get('/stats', getUserSubmissionStats);

export default router;
