/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import CodeEditor from '../components/@monaco-editor/CodeEditor';
import { Button } from '@repo/ui/components/Button';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { submitSolution, checkSubmission } from '../lib/api';
import { toast } from '@repo/ui/components/sonner';
import { Language } from '@repo/common-zod/types';
import { Loader2 } from 'lucide-react';

enum SubmitStatus {
	PENDING,
	ACTIVE,
}

const ProblemSubmitBar = React.memo(({ slug, code, setCode, selectedLanguage, setSelectedLanguage }: {
	slug: string;
	code: string;
	setCode: (code: string) => void;
	selectedLanguage: Language | null;
	setSelectedLanguage: (language: Language | null) => void;
}) => {
	const [status, setStatus] = useState<SubmitStatus>();
	const INITIAL_POLL_INTERVAL = 1000; // Start at 1s
	const MAX_POLL_INTERVAL = 5000; // Max 5s
	const MAX_RETRIES = 20; // Reduced from 30
	const BACKOFF_MULTIPLIER = 1.5;

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const submitInProgress = useRef(false);

	const pollForResult = useCallback(
		async (submissionId: string) => {
			let retries = 0;
			let currentInterval = INITIAL_POLL_INTERVAL;

			async function poll() {
				if (retries >= MAX_RETRIES) {
					setStatus(SubmitStatus.ACTIVE);
					toast.error('Submission timeout. Please refresh to check status.');
					return;
				}

				try {
					const response = await checkSubmission(submissionId);

					if (!response) {
						setStatus(SubmitStatus.ACTIVE);
						toast.error('Failed to check submission status.');
						return;
					}

					if (response.status === 'SUCCESS' || response.status === 'REJECTED') {
						setStatus(SubmitStatus.ACTIVE);
						const passedCount = response.testCases?.filter((tc: any) => tc.status === 'SUCCESS').length || 0;
						const totalCount = response.testCases?.length || 0;

						if (response.status === 'SUCCESS') {
							toast.success(`All ${totalCount} test cases passed!`);
						} else {
							toast.error(`${totalCount - passedCount}/${totalCount} test cases failed.`);
						}
						return;
					}

					retries++;
					currentInterval = Math.min(currentInterval * BACKOFF_MULTIPLIER, MAX_POLL_INTERVAL);
					timeoutRef.current = setTimeout(poll, currentInterval);
				} catch (error) {
					console.error('Error checking submission:', error);
					setStatus(SubmitStatus.ACTIVE);
					toast.error('Error checking submission status.');
				}
			}

			await poll();
		},
		[]
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleSubmit = useCallback(
		async () => {
			if (!slug || !code || !selectedLanguage || submitInProgress.current) {
				return;
			}

			submitInProgress.current = true;
			setStatus(SubmitStatus.PENDING);

			try {
				const response = await submitSolution(slug, code, selectedLanguage.value);
				if (response && response.submissionId) {
					console.log('Submission ID:', response.submissionId);
					pollForResult(response.submissionId);
				} else {
					setStatus(SubmitStatus.ACTIVE);
					toast.error('Failed to submit code.');
				}
			} catch (error) {
				console.error('Error submitting code:', error);
				setStatus(SubmitStatus.ACTIVE);
				toast.error('Failed to submit code.');
			} finally {
				setTimeout(() => {
					submitInProgress.current = false;
				}, 1000);
			}
		},
		[slug, code, selectedLanguage, pollForResult]
	);

	return (
		<div className='flex flex-col h-full w-full min-w-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6'>
			<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
				Code Editor
			</h2>
			<div className='mb-4'>
				<LanguageSelect
					selectedLanguage={selectedLanguage}
					setSelectedLanguage={setSelectedLanguage}
				/>
			</div>
			<div className='flex-1 min-h-0 border border-gray-300 rounded-lg overflow-hidden mb-4'>
				<CodeEditor
					key={selectedLanguage?.monaco}
					value={code}
					onChange={(value) => setCode(value || '')}
					language={selectedLanguage?.monaco}
				/>
			</div>
			<div className='flex justify-end space-x-4 mt-4'>
				<Button
					type='submit'
					disabled={status === SubmitStatus.PENDING || submitInProgress.current}
					onClick={handleSubmit}
					className='min-w-[120px]'
				>
					{status === SubmitStatus.PENDING ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Submitting...
						</>
					) : (
						'Submit'
					)}
				</Button>
			</div>
		</div>
	);
}
);

ProblemSubmitBar.displayName = 'ProblemSubmitBar';

export default ProblemSubmitBar;
