import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProblemCard from './../components/ProblemCard';
import { ProblemSchema } from '@repo/common-zod/types';
import { getProblems } from '../lib/api';
import { z } from 'zod';
import Spinner from '@repo/ui/components/Spinner';

type ProblemType = z.infer<typeof ProblemSchema>;

const Index = () => {
	const [problems, setProblems] = useState<ProblemType[]>();

	useEffect(() => {
		getProblems().then(setProblems);
	}, []);

	if (!problems) {
		return <Spinner />;
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
							slug={problem.slug}
							difficulty={problem.difficulty}
						/>
					))}
				</div>
			</main>
		</div>
	);
};

export default Index;
