import { Router } from 'express';
import {
	getProblems,
	getProblem,
	deleteProblem,
	getPartialBoilerplateCodeByLanguageId,
} from '../controller/problem.controller';

const router: Router = Router();

router.get('/problemset', getProblems);
router.get('/problem/:problemSlug', getProblem);
router.get(
	'/problem/:problemSlug/getBoilerplateCode',
	getPartialBoilerplateCodeByLanguageId
);

router.put('/problem/:problemSlug', deleteProblem);

export default router;
