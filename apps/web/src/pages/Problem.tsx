import { useParams } from 'react-router-dom';
import Header from './../components/Header';
// import DifficultyBadge from './../components/DifficultyBadge';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { getProblem, submitSolution, checkSubmission } from '../lib/api';
// import { ProblemSchema } from '@repo/common-zod/types';
// import { z } from 'zod';
import SubmitButton from '../components/SubmitButton';

// type ProblemType = z.infer<typeof ProblemSchema>;

const Problem = () => {
	const { slug } = useParams<{ slug: string }>();
	const [problem, setProblem] = useState<string | null>(null);
	const [code, setCode] = useState<string>('');
	const [tokens, setTokens] = useState<string[]>([]);

	useEffect(() => {
		if (slug) {
			console.log(slug);
			getProblem(slug).then((data) => {
				setProblem(data.problemMarkdown);
				setCode(data.partialBoilerpalteCode);
			});
		}
	}, [slug]);

	const languageId = 'js';
	async function handleSubmit() {
		if (slug && code && languageId) {
			const response = await submitSolution(slug, code, languageId);
			console.log('response judge0response', response.judge0response);
			setTokens(response.judge0response);
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
					{/* <DifficultyBadge difficulty={problem.difficulty} /> */}
					<Markdown rehypePlugins={[remarkGfm]}>
						{problem || 'No description available.'}
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
