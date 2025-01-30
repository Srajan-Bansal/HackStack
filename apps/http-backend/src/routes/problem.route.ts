import { Router } from 'express';
import { getProblems, getProblem } from '../controller/problem.controller';

const router: Router = Router();

router.get('/problemset', getProblems);
router.get('/problem/:problemSlug', getProblem);

export default router;
