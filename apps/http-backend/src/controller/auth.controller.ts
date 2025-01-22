import { Request, Response } from 'express';
import { UserSignupSchema, UserLoginSchema } from '@repo/common-zod/types';
import prisma from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';
import bcrypt from 'bcryptjs';

const generateToken = (id: string): string => {
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const sendCookie = (res: Response, token: string) => {
	const cookieOptions = {
		maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string),
		httpOnly: true,
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		secure: process.env.NODE_ENV === 'production',
	};
	res.cookie('authToken', token, cookieOptions as any);
};

export const signup = async (req: Request, res: Response) => {
	const parsedSchema = UserSignupSchema.safeParse(req.body);

	if (!parsedSchema.success) {
		return handleError(res, 400, 'Invalid signup data');
	}

	const { email, password } = parsedSchema.data;

	const hashPassword = await bcrypt.hash(password, 12);

	const newUser = await prisma.user.upsert({
		where: { email: email },
		create: {
			email: email,
			password: hashPassword,
		},
		update: {},
	});

	const token = generateToken(newUser.id);
	sendCookie(res, token);

	res.status(200).json({ id: newUser.id });
};

export const login = async (req: Request, res: Response) => {
	const parsedSchema = UserLoginSchema.safeParse(req.body);

	if (!parsedSchema.success) {
		return handleError(res, 400, 'Invalid login data');
	}

	const { email, password } = parsedSchema.data;

	const user = await prisma.user.findUnique({
		where: { email: email },
	});

	if (!user) {
		return handleError(res, 401, 'Invalid email or password');
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);

	if (!isPasswordCorrect) {
		return handleError(res, 401, 'Invalid email or password');
	}

	const token = generateToken(user.id);
	sendCookie(res, token);

	res.status(200).json({ id: user.id });
};

export const logout = async (req: Request, res: Response) => {
	res.clearCookie('authToken');
	res.status(200).json({ message: 'Logged out' });
};
