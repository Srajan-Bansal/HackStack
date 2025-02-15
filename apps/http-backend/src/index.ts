import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/errorMiddleware';
import authRouter from './routes/auth.route';
import problemRouter from './routes/problem.route';
import submissionRouter from './routes/submission.route';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(errorMiddleware);
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/v1', authRouter);
app.use('/api/v1', problemRouter);
app.use('/api/v1', submissionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server is running on port 3001');
});
