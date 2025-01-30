import { z } from 'zod';

export const UserSignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
});

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
});

export const SubmissionInputSchema = z.object({
	code: z.string(),
	languageId: z.number(),
});

const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

const ProblemTypeSchema = z.enum([
	'Array',
	'String',
	'HashTable',
	'LinkedList',
]);

export const ProblemSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	statement: z.string(),
	difficulty: DifficultySchema,
	type: ProblemTypeSchema,
});
