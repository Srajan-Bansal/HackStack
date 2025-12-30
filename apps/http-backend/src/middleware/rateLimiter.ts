import rateLimit from 'express-rate-limit';

// Strict submission rate limiter
export const submissionLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // 5 submissions per minute per IP
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many submissions. Please wait before submitting again.',
	skipSuccessfulRequests: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // 100 requests per 15 min per IP
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests, please try again later.',
});

// Auth rate limiter (brute force protection)
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // 10 login attempts per 15 min
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many authentication attempts. Please try again later.',
});
