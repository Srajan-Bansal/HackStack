import React, { useState, useCallback } from 'react';
import CodeEditor from '../components/@monaco-editor/CodeEditor';
import { Button } from '@repo/ui/components/Button';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { submitSolution, checkBatchSubmission } from '../lib/api';
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
		const POLL_INTERVAL = 10000;
		const MAX_RETRIES = 10;

		const pollForResult = useCallback(
			async (currentTokens: string[], maxRetries: number) => {
				let retries = 0;

				async function poll() {
					if (currentTokens.length === 0 || retries >= maxRetries) {
						setStatus(SubmitStatus.ACTIVE);
						if (retries >= maxRetries) {
							toast.error('Submission failed. Please try again.');
						}
						return;
					}

					const response = await checkBatchSubmission(currentTokens);
					console.log('Batch Response:', response);

					if (!response || !response.submissions) {
						setStatus(SubmitStatus.ACTIVE);
						toast.error('Submission failed. Please try again.');
						return;
					}

					const submissions = response.submissions;

					const failedSubmissions = submissions.filter(
						(sub: { status: { id: number } }) => sub.status.id >= 4
					);

					if (failedSubmissions.length > 0) {
						setStatus(SubmitStatus.ACTIVE);
						toast.error(
							'Submission failed. Check your code and try again.'
						);
						return;
					}

					const pendingTokens = submissions
						.filter(
							(sub: { status: { id: number } }) =>
								sub.status.id === 1 || sub.status.id === 2
						)
						.map((sub: { token: string }) => sub.token);

					if (pendingTokens.length === 0) {
						setStatus(SubmitStatus.ACTIVE);
						toast.success('Submission completed successfully!');
						return;
					}

					currentTokens = pendingTokens;
					retries++;

					setTimeout(poll, POLL_INTERVAL);
				}

				await poll();
			},
			[POLL_INTERVAL]
		);

		const handleSubmit = useCallback(async () => {
			if (!slug || !code || !selectedLanguage) return;
			setStatus(SubmitStatus.PENDING);

			const response = await submitSolution(
				slug,
				code,
				selectedLanguage.value
			);
			if (response && response.judge0response) {
				const newTokens = response.judge0response.map(
					(sub: { token: string }) => sub.token
				);
				console.log('Tokens:', newTokens);
				pollForResult(newTokens, MAX_RETRIES);
			} else {
				setStatus(SubmitStatus.ACTIVE);
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
