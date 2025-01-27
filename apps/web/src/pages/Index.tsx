import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProblemCard from './../components/ProblemCard';
import axios from 'axios';
import { ProblemType } from '@repo/common-zod/types';

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

const Index = () => {
	const [problems, setProblems] = useState<ProblemType[]>();

	useEffect(() => {
		async function fetchProblems() {
			const response = await axios.get(
				`${BACKEND_URL}/api/v1/problemset`
			);
			console.log(response);
			setProblems(response.data);
		}

		fetchProblems();
	}, []);

	if (!problems) {
		return <div>Loading...</div>;
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container py-8'>
				<h1 className='mb-8 text-3xl font-bold'>Problems</h1>
				<div className='space-y-4'>
					{problems.map((problem) => (
						<ProblemCard
							key={problem.id}
							id={problem.id}
							title={problem.title}
							difficulty={problem.difficulty}
						/>
					))}
				</div>
			</main>
		</div>
	);
};

export default Index;
