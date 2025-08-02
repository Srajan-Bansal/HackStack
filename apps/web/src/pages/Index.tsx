import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProblemCard from './../components/ProblemCard';
import { ProblemSchema } from '@repo/common-zod/types';
import { getProblems } from '../lib/api';
import { z } from 'zod';
import Spinner from '@repo/ui/components/Spinner';
import { toast } from '@repo/ui/components/sonner';

type ProblemType = z.infer<typeof ProblemSchema>;

const Index = () => {
	const [problems, setProblems] = useState<ProblemType[]>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProblems = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getProblems();
				setProblems(data);
			} catch (err: any) {
				const errorMessage = err?.response?.data?.message || 'Failed to load problems';
				setError(errorMessage);
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchProblems();
	}, []);

	if (loading) {
		return (
			<div className='min-h-screen bg-background'>
				<Header />
				<div className='flex items-center justify-center h-96'>
					<Spinner />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-background'>
				<Header />
				<main className='container py-8'>
					<div className='flex flex-col items-center justify-center h-96 gap-4'>
						<h1 className='text-2xl font-bold text-red-500'>Error Loading Problems</h1>
						<p className='text-muted-foreground'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
						>
							Retry
						</button>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container py-8'>
				<h1 className='mb-8 text-3xl font-bold'>Problems</h1>
				{problems && problems.length > 0 ? (
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
				) : (
					<div className='text-center py-12'>
						<h2 className='text-xl font-semibold mb-2'>No problems found</h2>
						<p className='text-muted-foreground'>Check back later for new challenges!</p>
					</div>
				)}
			</main>
		</div>
	);
};

export default Index;
