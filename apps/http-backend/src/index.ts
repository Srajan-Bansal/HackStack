import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/errorMiddleware';
import authRouter from './routes/auth.route';
import problemRouter from './routes/problem.route';
import submissionRouter from './routes/submission.route';
import userRouter from './routes/user.route';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(errorMiddleware);
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/v1', authRouter);
app.use('/api/v1', problemRouter);
app.use('/api/v1', submissionRouter);
app.use('/api/v1', userRouter);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Server closed gracefully');
		process.exit(0);
	});
});
