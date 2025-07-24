import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';

interface JwtPayload {
	id: string;
	iat: number;
	exp: number;
}

export interface AuthenticatedRequest extends Request {
	userId?: string;
}

export const authMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.authToken;
	if (!token) {
		return handleError(res, 401, 'Unauthorized - No token provided');
	}

	if (!process.env.JWT_SECRET) {
		console.error('JWT_SECRET is not configured');
		return handleError(res, 500, 'Internal server error');
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
		req.userId = decoded.id;
		next();
	} catch (error) {
		res.clearCookie('authToken', {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			secure: process.env.NODE_ENV === 'production',
		});

		if (error instanceof jwt.TokenExpiredError) {
			return handleError(res, 401, 'Token expired');
		} else if (error instanceof jwt.JsonWebTokenError) {
			return handleError(res, 401, 'Invalid token');
		} else {
			return handleError(res, 401, 'Token verification failed');
		}
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

	if (!process.env.JWT_SECRET) {
		console.error('JWT_SECRET is not configured');
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
		req.userId = decoded.id;
		next();
	} catch (error) {
		res.clearCookie('authToken', {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			secure: process.env.NODE_ENV === 'production',
		});
		next();
	}
};
