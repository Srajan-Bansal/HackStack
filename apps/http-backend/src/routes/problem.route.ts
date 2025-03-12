import { Router } from 'express';
import {
	getProblems,
	getProblem,
	deleteProblem,
	getPartialBoilerplateCodeByLanguageId,
	createProblem,
} from '../controller/problem.controller';

const router: Router = Router();

router.get('/problemset', getProblems);
router.get('/problem/:problemSlug', getProblem);
router.get(
	'/problem/:problemSlug/getBoilerplateCode',
	getPartialBoilerplateCodeByLanguageId
);
router.post('/problem', createProblem);
router.put('/problem/:problemSlug', deleteProblem);

export default router;
