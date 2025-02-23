import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().nullable(),
	provider: z.enum(['email', 'google', 'github']),
	password: z.string(),
	role: z.enum(['USER', 'ADMIN']),
	createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const OAuthProfileSchema = z.object({
	emails: z.array(z.object({ value: z.string().email() })).optional(),
	displayName: z.string().optional(),
	username: z.string().optional(),
});

export type OAuthProfile = z.infer<typeof OAuthProfileSchema>;

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
	languageId: z.enum(['java', 'js']),
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

export const SubmissionCallback = z.object({
	data: z.object({
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
	}),
});
