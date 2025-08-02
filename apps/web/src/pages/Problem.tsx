import { useParams } from 'react-router-dom';
import Header from './../components/Header';
import { useEffect, useState, useMemo } from 'react';
import { getProblem } from '../lib/api';
import { Language } from '@repo/common-zod/types';
import ProblemSubmitBar from '../components/ProblemSubmitBar';
import Spinner from '@repo/ui/components/Spinner';
import { LanguageMapping } from '@repo/language/LanguageMapping';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@repo/ui/components/Resizable';
import ProblemDesp from '../components/ProblemDesp';

const Problem = () => {
	const { slug = '' } = useParams<{ slug: string }>();
	const [problem, setProblem] = useState<string | null>(null);
	const [code, setCode] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const languages = useMemo(
		() =>
			Object.entries(LanguageMapping).map(([key, lang]) => ({
				value: key,
				label: lang.name,
				monaco: lang.monaco,
				judge0: lang.judge0,
			})),
		[]
	);

	const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(() => {
		const savedLanguage = localStorage.getItem('preferredLanguage');
		return (
			languages.find((lang) => lang.value === savedLanguage) ||
			languages.find((lang) => lang.value === 'javascript') ||
			languages[0] ||
			null
		);
	});

	useEffect(() => {
		if (slug && selectedLanguage) {
			setIsLoading(true);
			getProblem(slug, selectedLanguage.value)
				.then((data) => {
					if (data) {
						setProblem(data.problemMarkdown);
						setCode(data.partialBoilerpalteCode || '');
					}
				})
				.catch(() => {
					setProblem('Failed to load problem description.');
					setCode('// Failed to load boilerplate code');
				})
				.finally(() => setIsLoading(false));
		}
	}, [slug, selectedLanguage]);

	useEffect(() => {
		if (selectedLanguage) {
			localStorage.setItem('preferredLanguage', selectedLanguage.value);
		}
	}, [selectedLanguage]);

	if (!problem) {
		return (
			<div
				className='flex items-center justify-center h-screen'
				role='status'
				aria-live='polite'
			>
				<Spinner />
				<span className='sr-only'>Loading problem...</span>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main
				className='flex mx-6'
				role='main'
			>
				<ResizablePanelGroup direction='horizontal'>
					<ResizablePanel
						minSize={20}
						maxSize={80}
						defaultSize={50}
						aria-label='Problem description panel'
					>
						<ProblemDesp
							problem={problem}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							problemSlug={slug}
						/>
					</ResizablePanel>
					<ResizableHandle
						withHandle
						className='border-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
						aria-label='Resize panels'
					/>
					<ResizablePanel
						minSize={20}
						maxSize={80}
						defaultSize={50}
						aria-label='Code editor and submission panel'
					>
						<ProblemSubmitBar
							slug={slug}
							code={code}
							setCode={setCode}
							selectedLanguage={selectedLanguage}
							setSelectedLanguage={setSelectedLanguage}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</main>
		</div>
	);
};

export default Problem;
