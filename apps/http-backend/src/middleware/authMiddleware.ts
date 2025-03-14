import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';

interface JwtPayload {
	id: string;
}

interface AuthenticatedRequest extends Request {
	userId?: string;
}

export const authMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.authToken;
	if (!token) {
		return handleError(res, 401, 'Unauthorized');
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;
		req.userId = decoded.id;
		return next();
	} catch (error) {
		res.clearCookie('authToken');
		return handleError(res, 401, 'Invalid token');
	}
};

export const isLoggedIn = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.authToken;
	if (!token) {
		return next();
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;
		req.userId = decoded.id;
		return next();
	} catch (error) {
		res.clearCookie('authToken');
		return next();
	}
};
