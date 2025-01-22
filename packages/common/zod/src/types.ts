import { z } from 'zod';

export const UserSignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
});

export const UserLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
});
