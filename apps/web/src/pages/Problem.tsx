import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import DifficultyBadge from './../components/DifficultyBadge';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

const markdown =
	'# Two Sum\n \n Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n You may assume that each input would have exactly one solution, and you may not use the same element twice.\n You can return the answer in any order.\n \n ## Example\n \n ```\n Input: nums = [2,7,11,15], target = 9\n Output: [0,1]\n Explaination: Because nums[0] + nums[1] == 9, we return [0, 1].\n ```\n \n ```\n Input: nums = [3, 2, 4], target = 6\n Output: [1, 2]\n Explaination: Because nums[1] + nums[2] == 6, we return [1, 2].\n ```\n \n ## Constraints\n \n - 1 <= nums.length <= 10^5\n - -10^9 <= nums[i] <= 10^9\n - -10^9 <= target <= 10^9\n - nums contains each integer at least once';

const Problem = () => {
	const { id } = useParams();
	const problem = problems[id as keyof typeof problems];

	if (!problem) {
		return <div>Problem not found</div>;
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<div className='flex mx-6'>
				<div className='container py-8 flex gap-8 flex-col w-1/2'>
					<DifficultyBadge difficulty={'hard'} />
					<Markdown rehypePlugins={[remarkGfm]}>
						{markdown || 'No description available.'}
					</Markdown>
				</div>
				<div className='w-1/2 py-8'>
					<CodeEditor />
				</div>
			</div>
		</div>
	);
};

export default Problem;
