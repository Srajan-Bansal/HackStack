import { Response } from 'express';

export const handleError = (
	res: Response,
	statusCode: number,
	message: string
) => {
	res.status(statusCode).json({ error: message });
};
