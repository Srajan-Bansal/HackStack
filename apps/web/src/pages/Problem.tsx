import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { getProblem, getBoilerplateCode } from '../lib/api';
import ProblemSubmitBar from '../components/ProblemSubmitBar';
import Spinner from '@repo/ui/components/Spinner';
import { LanguageMapping } from '@repo/language/LanguageMapping';

const Problem = () => {
	const { slug = '' } = useParams<{ slug: string }>();
	const [problem, setProblem] = useState<string | null>(null);
	const [code, setCode] = useState<string>('');
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
			getProblem(slug, selectedLanguage.value)
				.then((data) => {
					if (data) {
						setProblem(data.problemMarkdown);
						setCode(data.partialBoilerpalteCode || '');
					}
				})
				.catch(() => setProblem('Failed to load problem description.'));
		}
	}, [slug]);

	useEffect(() => {
		if (slug && selectedLanguage) {
			setIsLoading(true);
			getBoilerplateCode(slug, selectedLanguage.value)
				.then((data) => {
					if (data) setCode(data.partialBoilerpalteCode || '');
				})
				.catch(() => setCode('// Failed to load boilerplate code'))
				.finally(() => setIsLoading(false));
		}
	}, [selectedLanguage]);

	if (!problem) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Spinner />
			</div>
		);
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
				<ProblemSubmitBar
					slug={slug}
					code={code}
					setCode={setCode}
					selectedLanguage={selectedLanguage}
					setSelectedLanguage={setSelectedLanguage}
				/>
			</div>
		</div>
	);
};

export default Problem;
