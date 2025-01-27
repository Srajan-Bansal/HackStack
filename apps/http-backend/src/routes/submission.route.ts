import { Router } from 'express';
import { createSubmission } from '../controller/submission.controller';

const router: Router = Router();

router.post('/createSubmission', createSubmission);

export default router;
