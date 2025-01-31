import express, { Request, Response } from 'express';
import morgan from 'morgan';
import prisma from '@repo/db/client';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.post('/submissions-callback', async (req: Request, res: Response) => {
	console.log(req.body);
	res.send('ok');
});

app.listen(5000, () => {
	console.log('Server is running on port 5000');
});
