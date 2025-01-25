import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import DifficultyBadge from './../components/DifficultyBadge';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';

const problems = {
	'1': {
		title: 'Two Sum',
		difficulty: 'easy' as const,
		description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
		examples: [
			{
				input: 'nums = [2,7,11,15], target = 9',
				output: '[0,1]',
				explanation:
					'Because nums[0] + nums[1] == 9, we return [0, 1].',
			},
		],
	},
};

const Problem = () => {
	const { id } = useParams();
	const problem = problems[id as keyof typeof problems];

	if (!problem) {
		return <div>Problem not found</div>;
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container py-8 flex gap-8'>
				<div className='mb-8'>
					<div className='mb-4 flex items-center gap-4'>
						<h1 className='text-3xl font-bold'>{problem.title}</h1>
						<DifficultyBadge difficulty={problem.difficulty} />
					</div>
					<div className='prose prose-invert max-w-none'>
						<p className='whitespace-pre-line'>
							{problem.description}
						</p>
						<h2>Examples:</h2>
						{problem.examples.map((example, index) => (
							<div
								key={index}
								className='rounded-lg bg-accent p-4'
							>
								<p>
									<strong>Input:</strong> {example.input}
								</p>
								<p>
									<strong>Output:</strong> {example.output}
								</p>
								{example.explanation && (
									<p>
										<strong>Explanation:</strong>{' '}
										{example.explanation}
									</p>
								)}
							</div>
						))}
					</div>
				</div>

				<CodeEditor />
			</main>
		</div>
	);
};

export default Problem;
