import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { getProblem, submitSolution, checkSubmission } from '../lib/api';
import { Button } from '@repo/ui/components/Button';
import Spinner from '@repo/ui/components/Spinner';

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

	const languageId = 'java';
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
		return <Spinner />;
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<div className='flex mx-6'>
				<div className='container py-8 flex gap-8 flex-col w-1/2'>
					<Markdown rehypePlugins={[remarkGfm]}>
						{problem || 'No description available.'}
					</Markdown>
				</div>
				<div className='w-1/2 py-8'>
					<CodeEditor
						value={code}
						setValue={setCode}
					/>

					<Button
						size='sm'
						onClick={handleSubmit}
					>
						Submit
					</Button>
					<Button
						size='sm'
						onClick={handleCheckResult}
					>
						Result
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Problem;
