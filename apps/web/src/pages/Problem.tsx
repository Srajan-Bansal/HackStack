import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import DifficultyBadge from './../components/DifficultyBadge';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { getProblem, submitSolution, checkSubmission } from '../lib/api';
import { ProblemSchema } from '@repo/common-zod/types';
import { z } from 'zod';
import SubmitButton from '../components/SubmitButton';

type ProblemType = z.infer<typeof ProblemSchema>;

const markdown = `
# Two Sum

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.

## Example

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

\`\`\`
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: Because nums[1] + nums[2] == 6, we return [1, 2].
\`\`\`

## Constraints

- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- nums contains each integer at least once
`;

const Problem = () => {
	const { slug } = useParams<{ slug: string }>();
	const [problem, setProblem] = useState<ProblemType | null>(null);
	const [code, setCode] = useState<string>('');
	const [tokens, setTokens] = useState<string[]>([]);

	useEffect(() => {
		if (slug) {
			console.log(slug);
			getProblem(slug).then((data) => {
				setProblem(data);
			});
		}
	}, [slug]);

	const languageId = 62;
	async function handleSubmit() {
		if (slug && code && languageId) {
			const response = await submitSolution(slug, code, languageId);
			console.log(response);
			setTokens(response);
		}
	}

	async function handleCheckResult() {
		if (slug && tokens) {
			const response = await checkSubmission(tokens);
			console.log(response);
		} else {
			console.log('No tokens');
		}
	}

	if (!problem) {
		return <div>Problem not found</div>;
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<div className='flex mx-6'>
				<div className='container py-8 flex gap-8 flex-col w-1/2'>
					<DifficultyBadge difficulty={problem.difficulty} />
					<Markdown rehypePlugins={[remarkGfm]}>
						{markdown || 'No description available.'}
					</Markdown>
				</div>
				<div className='w-1/2 py-8'>
					<CodeEditor
						value={code}
						setValue={setCode}
					/>

					<SubmitButton
						color={'green'}
						children={'Submit'}
						onClick={handleSubmit}
					/>

					<SubmitButton
						color={'green'}
						children={'CheckResult'}
						onClick={handleCheckResult}
					/>
				</div>
			</div>
		</div>
	);
};

export default Problem;
