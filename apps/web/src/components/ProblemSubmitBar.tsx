import { useState, useRef } from 'react';
import CodeEditor from '../components/@monaco-editor/CodeEditor';
import { Button } from '@repo/ui/components/Button';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { submitSolution, checkBatchSubmission } from '../lib/api';
import { toast } from '@repo/ui/components/sonner';

enum SubmitStatus {
	PENDING,
	ACTIVE,
}

const ProblemSubmitBar = ({
	slug,
	code,
	setCode,
	selectedLanguage,
	setSelectedLanguage,
}: {
	slug: string;
	code: string;
	setCode: React.Dispatch<React.SetStateAction<string>>;
	selectedLanguage: any;
	setSelectedLanguage: React.Dispatch<React.SetStateAction<any>>;
}) => {
	const [tokens, setTokens] = useState<string[]>([]);
	const [status, setStatus] = useState<SubmitStatus>();
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const POLL_INTERVAL = 5000;
	const MAX_RETRIES = 10;

	async function handleSubmit() {
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
			setTokens(newTokens);
			pollForResult(newTokens, MAX_RETRIES);
		} else {
			setStatus(SubmitStatus.ACTIVE);
		}
	}

	function pollForResult(currentTokens: string[], maxRetries: number) {
		let retries = 0;

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(async () => {
			if (currentTokens.length === 0 || retries >= maxRetries) {
				clearInterval(intervalRef.current!);
				setStatus(SubmitStatus.ACTIVE);

				if (retries >= maxRetries) {
					toast.error('Submission failed. Please try again.');
				}
				return;
			}

			const response = await checkBatchSubmission(currentTokens);
			console.log('Batch Response:', response);

			if (response && response.submissions) {
				const submissions = response.submissions;

				const failedSubmissions = submissions.filter(
					(sub: { status: { id: number } }) => sub.status.id >= 4
				);
				if (failedSubmissions.length > 0) {
					clearInterval(intervalRef.current!);
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
					clearInterval(intervalRef.current!);
					setStatus(SubmitStatus.ACTIVE);
					toast.success('Submission completed successfully!');
					return;
				}

				setTokens(pendingTokens);
				currentTokens = pendingTokens;
			}

			retries++;
		}, POLL_INTERVAL);
	}

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
};

export default ProblemSubmitBar;
