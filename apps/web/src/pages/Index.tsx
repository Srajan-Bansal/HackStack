import Header from '../components/Header';
import ProblemCard from './../components/ProblemCard';

const problems = [
	{
		id: 1,
		title: 'Two Sum',
		difficulty: 'easy',
		acceptanceRate: 48.5,
	},
	{
		id: 2,
		title: 'Add Two Numbers',
		difficulty: 'medium',
		acceptanceRate: 39.2,
	},
	{
		id: 3,
		title: 'Longest Substring Without Repeating Characters',
		difficulty: 'medium',
		acceptanceRate: 33.8,
	},
	{
		id: 4,
		title: 'Median of Two Sorted Arrays',
		difficulty: 'hard',
		acceptanceRate: 35.1,
	},
] as const;

const Index = () => {
	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container py-8'>
				<h1 className='mb-8 text-3xl font-bold'>Problems</h1>
				<div className='space-y-4'>
					{problems.map((problem) => (
						<ProblemCard
							key={problem.id}
							{...problem}
						/>
					))}
				</div>
			</main>
		</div>
	);
};

export default Index;
