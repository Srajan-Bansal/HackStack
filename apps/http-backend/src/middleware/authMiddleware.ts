import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/errorHandler';

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

	const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

	if (typeof decoded !== 'string' && 'id' in decoded) {
		req.userId = decoded.id;
	} else {
		return handleError(res, 401, 'Unauthorized');
	}
	next();
};
