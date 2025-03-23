import { Router } from 'express';
import {
	getProblems,
	getProblem,
	deleteProblem,
	getPartialBoilerplateCodeByLanguageId,
	createProblem,
} from '../controller/problem.controller';
import { isLoggedIn } from '../middleware/authMiddleware';

const router: Router = Router();

router.get('/problemset', isLoggedIn, getProblems);
router.get('/problem/:problemSlug', getProblem);
router.get(
	'/problem/:problemSlug/getBoilerplateCode',
	getPartialBoilerplateCodeByLanguageId
);
router.post('/problem', createProblem);
router.put('/problem/:problemSlug', deleteProblem);

export default router;
