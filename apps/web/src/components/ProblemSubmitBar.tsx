import React, { useState, useCallback } from 'react';
import CodeEditor from '../components/@monaco-editor/CodeEditor';
import { Button } from '@repo/ui/components/Button';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { submitSolution, checkSubmission } from '../lib/api';
import { toast } from '@repo/ui/components/sonner';
import { Language } from '@repo/common-zod/types';

enum SubmitStatus {
	PENDING,
	ACTIVE,
}

const ProblemSubmitBar = React.memo(
	({
		slug,
		code,
		setCode,
		selectedLanguage,
		setSelectedLanguage,
	}: {
		slug: string;
		code: string;
		setCode: (code: string) => void;
		selectedLanguage: Language | null;
		setSelectedLanguage: (language: Language | null) => void;
	}) => {
		const [status, setStatus] = useState<SubmitStatus>();
		const POLL_INTERVAL = 2000;
		const MAX_RETRIES = 30;

		const pollForResult = useCallback(
			async (submissionId: string, maxRetries: number) => {
				let retries = 0;

				async function poll() {
					if (retries >= maxRetries) {
						setStatus(SubmitStatus.ACTIVE);
						toast.error('Submission timeout. Please try again.');
						return;
					}

					try {
						const response = await checkSubmission(submissionId);
						console.log('Submission status:', response);

						if (!response) {
							setStatus(SubmitStatus.ACTIVE);
							toast.error('Failed to check submission status.');
							return;
						}

						// Check submission status
						if (response.status === 'SUCCESS') {
							setStatus(SubmitStatus.ACTIVE);
							toast.success('Submission completed successfully!');
							return;
						} else if (response.status === 'REJECTED') {
							setStatus(SubmitStatus.ACTIVE);
							toast.error('Submission failed. Check your code and try again.');
							return;
						} else if (response.status === 'PENDING') {
							retries++;
							setTimeout(poll, POLL_INTERVAL);
						}
					} catch (error) {
						console.error('Error checking submission:', error);
						setStatus(SubmitStatus.ACTIVE);
						toast.error('Error checking submission status.');
					}
				}

				await poll();
			},
			[POLL_INTERVAL]
		);

		const handleSubmit = useCallback(async () => {
			if (!slug || !code || !selectedLanguage) return;
			setStatus(SubmitStatus.PENDING);

			try {
				const response = await submitSolution(slug, code, selectedLanguage.value);
				if (response && response.submissionId) {
					console.log('Submission ID:', response.submissionId);
					pollForResult(response.submissionId, MAX_RETRIES);
				} else {
					setStatus(SubmitStatus.ACTIVE);
					toast.error('Failed to submit code. Please try again.');
				}
			} catch (error) {
				console.error('Error submitting code:', error);
				setStatus(SubmitStatus.ACTIVE);
				toast.error('Failed to submit code. Please try again.');
			}
		}, [slug, code, selectedLanguage, MAX_RETRIES, pollForResult]);

		return (
			<div className='flex flex-col h-full w-full min-w-0 bg-white shadow-lg rounded-lg p-6'>
				<h2 className='text-xl font-semibold text-gray-800 mb-4'>
					Code Editor
				</h2>
				<div className='mb-4'>
					<LanguageSelect
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
					/>
				</div>
				<div className='flex-1 border border-gray-300 rounded-lg overflow-hidden mb-4'>
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
						disabled={status === SubmitStatus.PENDING}
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</div>
			</div>
		);
	}
);

ProblemSubmitBar.displayName = 'ProblemSubmitBar';

export default ProblemSubmitBar;
