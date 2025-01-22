import { Router } from 'express';
import {
	getProblems,
	getProblem,
	getProblemSubmissions,
	submitProblem,
} from '../controller/problem.controller';

const router: Router = Router();

router.get('/problemset', getProblems);
router.get('/problem/:slug', getProblem);

router.post('/problem/:slug/submit', submitProblem);
router.get('/problem/:slug/submissions', getProblemSubmissions);

export default router;
