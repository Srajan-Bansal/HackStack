import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import { CodeEditor } from '../components/@monaco-editor/CodeEditor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import {
	getProblem,
	submitSolution,
	checkSubmission,
	getBoilerplateCode,
} from '../lib/api';
import { Button } from '@repo/ui/components/Button';
import Spinner from '@repo/ui/components/Spinner';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { LanguageMapping } from '@repo/language/LanguageMapping';

const Problem = () => {
	const { slug } = useParams<{ slug: string }>();
	const [problem, setProblem] = useState<string | null>(null);
	const [code, setCode] = useState<string>('');
	const [tokens, setTokens] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState(() => {
		return (
			Object.entries(LanguageMapping)
				.map(([key, lang]) => ({
					value: key,
					label: lang.name,
					monaco: lang.monaco,
					judge0: lang.judge0,
				}))
				.find((lang) => lang.value === 'java') || null
		);
	});

	useEffect(() => {
		if (slug && selectedLanguage) {
			getProblem(slug, selectedLanguage.value).then((data) => {
				setProblem(data.problemMarkdown);
				setCode(data.partialBoilerpalteCode);
			});
		}
	}, [slug]);

	useEffect(() => {
		if (slug && selectedLanguage) {
			setIsLoading(true);

			getBoilerplateCode(slug, selectedLanguage.value)
				.then((data) => {
					setCode(data.partialBoilerpalteCode);
				})
				.catch(() => setCode('// Failed to load boilerpate code'))
				.finally(() => setIsLoading(false));
		}
	}, [selectedLanguage]);

	async function handleSubmit() {
		if (slug && code && selectedLanguage) {
			const response = await submitSolution(
				slug,
				code,
				selectedLanguage.value
			);
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
					<LanguageSelect
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
					/>

					{!isLoading && (
						<CodeEditor
							key={selectedLanguage?.monaco}
							value={code}
							setValue={setCode}
							language={selectedLanguage?.monaco || 'java'}
						/>
					)}

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
