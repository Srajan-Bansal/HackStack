import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProblemCard from './../components/ProblemCard';
import { ProblemSchema } from '@repo/common-zod/types';
import { getProblems } from '../lib/api';
import { z } from 'zod';
import Spinner from '@repo/ui/components/Spinner';
import { toast } from '@repo/ui/components/sonner';
import { Search, SlidersHorizontal } from 'lucide-react';

type ProblemType = z.infer<typeof ProblemSchema>;

const Index = () => {
	const [problems, setProblems] = useState<ProblemType[]>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

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

	const filteredProblems = problems?.filter((p) => {
		const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
		const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter;
		return matchesSearch && matchesDifficulty;
	});

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
				{/* Page Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold mb-2'>Problems</h1>
					<p className='text-muted-foreground'>Sharpen your skills with curated coding challenges</p>
				</div>

				{/* Filters Bar */}
				<div className='flex flex-col sm:flex-row gap-3 mb-6'>
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<input
							type='text'
							placeholder='Search problems...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full h-9 pl-9 pr-4 rounded-lg border border-border/50 bg-card/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all'
						/>
					</div>
					<div className='flex gap-1.5'>
						{['all', 'easy', 'medium', 'hard'].map((level) => (
							<button
								key={level}
								onClick={() => setDifficultyFilter(level)}
								className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
									difficultyFilter === level
										? level === 'easy'
											? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
											: level === 'medium'
												? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
												: level === 'hard'
													? 'bg-red-500/15 text-red-500 border border-red-500/30'
													: 'bg-accent text-foreground border border-border'
										: 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
								}`}
							>
								{level}
							</button>
						))}
					</div>
				</div>

				{/* Problem Table */}
				{filteredProblems && filteredProblems.length > 0 ? (
					<div className='rounded-xl border border-border/50 overflow-hidden'>
						{/* Table Header */}
						<div className='grid grid-cols-[60px_1fr_100px_110px] gap-4 px-6 py-3 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
							<span>#</span>
							<span>Title</span>
							<span>Difficulty</span>
							<span className='text-right'>Acceptance</span>
						</div>
						{/* Rows */}
						<div className='divide-y divide-border/30'>
							{filteredProblems.map((problem, index) => (
								<ProblemCard
									key={problem.id}
									id={problem.id}
									title={problem.title}
									slug={problem.slug}
									difficulty={problem.difficulty}
									acceptanceRate={(problem as any).acceptanceRate}
									isEven={index % 2 === 0}
								/>
							))}
						</div>
					</div>
				) : (
					<div className='text-center py-16 rounded-xl border border-border/50'>
						<div className='text-4xl mb-3'>
							<Search className='w-12 h-12 mx-auto text-muted-foreground/40' />
						</div>
						<h2 className='text-lg font-semibold mb-1'>No problems found</h2>
						<p className='text-sm text-muted-foreground'>
							{search || difficultyFilter !== 'all'
								? 'Try adjusting your filters'
								: 'Check back later for new challenges!'}
						</p>
					</div>
				)}

				{/* Problem Count */}
				{filteredProblems && (
					<div className='mt-4 text-sm text-muted-foreground'>
						Showing {filteredProblems.length} of {problems?.length || 0} problems
					</div>
				)}
			</main>
		</div>
	);
};

export default Index;
