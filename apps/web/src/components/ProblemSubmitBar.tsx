import { useState } from 'react';
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
			setTokens(
				response.judge0response.map(
					(sub: { token: string }) => sub.token
				)
			);
			pollForResult(MAX_RETRIES);
		} else {
			setStatus(SubmitStatus.ACTIVE);
		}
	}

	function pollForResult(maxRetries: number) {
		let retries = 0;

		const interval = setInterval(async () => {
			if (tokens.length === 0 || retries >= maxRetries) {
				clearInterval(interval);
				setStatus(SubmitStatus.ACTIVE);

				if (retries >= maxRetries) {
					toast.error('Submission failed. Please try again.');
				}
				return;
			}

			const response = await checkBatchSubmission(tokens);

			if (response && response.length) {
				const pendingTokens = response
					.filter(
						(sub: { status: { id: number } }) =>
							sub.status.id === 1 || sub.status.id === 2
					)
					.map((sub: { token: string }) => sub.token);

				setTokens(pendingTokens);

				if (pendingTokens.length === 0) {
					clearInterval(interval);
					setStatus(SubmitStatus.ACTIVE);
					toast.success('Submission completed successfully!');
					return;
				}
			}

			retries++;
		}, POLL_INTERVAL);

		return () => clearInterval(interval);
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
					language={selectedLanguage?.monaco || 'java'}
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
