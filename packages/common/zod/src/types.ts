import { z } from 'zod';

export const UserSignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
	name: z.string().min(6, 'Name is required'),
});

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
});

export const SubmissionInputSchema = z.object({
	code: z.string(),
	languageId: z.enum(['java', 'js']),
});

const DifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD']);

const ProblemTypeSchema = z.enum([
	'Array',
	'String',
	'HashTable',
	'LinkedList',
	'Math',
	'Stack',
	'Sorting',
]);

export const ProblemSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	statement: z.string(),
	difficulty: DifficultySchema,
	type: ProblemTypeSchema,
});

export const SubmissionCallback = z.object({
	stdout: z.string().nullable(),
	time: z.string(),
	memory: z.number(),
	stderr: z.string().nullable(),
	token: z.string(),
	compile_output: z.string().nullable(),
	message: z.string().nullable(),
	status: z.object({
		id: z.number(),
		description: z.string(),
	}),
});

export const CreateProblemSchema = z.array(
	z.object({
		id: z.number(),
		title: z.string().min(1, 'Title is required'),
		problemSlug: z.string().min(1, 'Problem slug is required'),
		difficulty: DifficultySchema,
		problemType: z.array(ProblemTypeSchema),
		hidden: z.boolean().default(false),
	})
);
