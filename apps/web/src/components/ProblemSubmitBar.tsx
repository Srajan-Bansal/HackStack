/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import CodeEditor from '../components/@monaco-editor/CodeEditor';
import { Button } from '@repo/ui/components/Button';
import { LanguageSelect } from '@repo/ui/components/LanguageSelect';
import { submitSolution, checkSubmission } from '../lib/api';
import { toast } from '@repo/ui/components/sonner';
import { Language } from '@repo/common-zod/types';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

enum SubmitStatus {
	PENDING,
	ACTIVE,
}

interface TestCase {
	index: number;
	status: string;
	runtime?: number;
	memory?: number;
}

const ProblemSubmitBar = React.memo(({ slug, code, setCode, selectedLanguage, setSelectedLanguage }: {
	slug: string;
	code: string;
	setCode: (code: string) => void;
	selectedLanguage: Language | null;
	setSelectedLanguage: (language: Language | null) => void;
}) => {
	const [status, setStatus] = useState<SubmitStatus>();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [submissionStatus, setSubmissionStatus] = useState<string>('');
	const INITIAL_POLL_INTERVAL = 1000; // Start at 1s
	const MAX_POLL_INTERVAL = 5000; // Max 5s
	const MAX_RETRIES = 20;
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

					setTestCases(response.testCases || []);
					setSubmissionStatus(response.status);

					// Continue polling only if submission is still PENDING (execution in progress)
					if (response.status === 'PENDING') {
						retries++;
						currentInterval = Math.min(currentInterval * BACKOFF_MULTIPLIER, MAX_POLL_INTERVAL);
						timeoutRef.current = setTimeout(poll, currentInterval);
						return;
					}

					// Execution complete (SUCCESS or REJECTED)
					setStatus(SubmitStatus.ACTIVE);
					const passedCount = response.testCases?.filter((tc: any) => tc.status === 'ACCEPTED').length || 0;
					const failedCount = response.testCases?.filter((tc: any) => tc.status !== 'ACCEPTED' && tc.status !== 'PENDING').length || 0;
					const pendingCount = response.testCases?.filter((tc: any) => tc.status === 'PENDING').length || 0;
					const totalCount = response.testCases?.length || 0;

					if (response.status === 'SUCCESS') {
						toast.success(`All ${totalCount} test cases passed!`);
					} else {
						const executedCount = passedCount + failedCount;
						if (pendingCount > 0) {
							toast.error(`Execution stopped at test ${executedCount + 1}. ${passedCount} passed, ${failedCount} failed, ${pendingCount} not run.`);
						} else {
							toast.error(`${failedCount}/${totalCount} test cases failed. ${passedCount} passed.`);
						}
					}
				} catch (error) {
					console.error('Error checking submission:', error);
					setStatus(SubmitStatus.ACTIVE);
					toast.error('Error checking submission status.');
				}
			}

			await poll();
		},
		[BACKOFF_MULTIPLIER, INITIAL_POLL_INTERVAL, MAX_POLL_INTERVAL, MAX_RETRIES]
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
			setTestCases([]);
			setSubmissionStatus('');

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

	const getTestCaseIcon = (status: string) => {
		switch (status) {
			case 'ACCEPTED':
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case 'WRONG_ANSWER':
				return <XCircle className="h-4 w-4 text-red-500" />;
			case 'RUNTIME_ERROR':
			case 'TIME_LIMIT_EXCEEDED':
			case 'MEMORY_LIMIT_EXCEEDED':
				return <AlertCircle className="h-4 w-4 text-orange-500" />;
			case 'PENDING':
				return <Clock className="h-4 w-4 text-gray-400 animate-pulse" />;
			default:
				return <Clock className="h-4 w-4 text-gray-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'ACCEPTED':
				return 'text-green-600 dark:text-green-400';
			case 'WRONG_ANSWER':
				return 'text-red-600 dark:text-red-400';
			case 'RUNTIME_ERROR':
			case 'TIME_LIMIT_EXCEEDED':
			case 'MEMORY_LIMIT_EXCEEDED':
				return 'text-orange-600 dark:text-orange-400';
			case 'PENDING':
				return 'text-gray-500 dark:text-gray-400';
			default:
				return 'text-gray-600 dark:text-gray-400';
		}
	};

	const passedCount = testCases.filter(tc => tc.status === 'ACCEPTED').length;
	const failedCount = testCases.filter(tc => tc.status !== 'ACCEPTED' && tc.status !== 'PENDING').length;
	const pendingCount = testCases.filter(tc => tc.status === 'PENDING').length;

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

			{testCases.length > 0 && (
				<div className='mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800'>
					<div className='flex items-center justify-between mb-3'>
						<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
							Test Results
						</h3>
						<div className='flex gap-3 text-xs'>
							<span className='text-green-600 dark:text-green-400'>✓ {passedCount}</span>
							<span className='text-red-600 dark:text-red-400'>✗ {failedCount}</span>
							<span className='text-gray-500 dark:text-gray-400'>⏳ {pendingCount}</span>
						</div>
					</div>
					<div className='max-h-32 overflow-y-auto space-y-1'>
						{testCases.slice(0, 20).map((tc) => (
							<div
								key={tc.index}
								className='flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
							>
								<div className='flex items-center gap-2'>
									{getTestCaseIcon(tc.status)}
									<span className='text-xs text-gray-600 dark:text-gray-400'>
										Test {tc.index + 1}
									</span>
								</div>
								<span className={`text-xs font-medium ${getStatusColor(tc.status)}`}>
									{tc.status === 'ACCEPTED' ? 'Passed' :
										tc.status === 'PENDING' ? 'Running...' :
											tc.status === 'RUNTIME_ERROR' ? 'Runtime Error' :
												tc.status === 'TIME_LIMIT_EXCEEDED' ? 'Time Limit' :
													tc.status === 'MEMORY_LIMIT_EXCEEDED' ? 'Memory Limit' :
														'Failed'}
								</span>
							</div>
						))}
						{testCases.length > 20 && (
							<div className='text-xs text-gray-500 dark:text-gray-400 text-center py-1'>
								... and {testCases.length - 20} more test cases
							</div>
						)}
					</div>
					{pendingCount > 0 && (
						<div className='mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
							<Loader2 className='h-3 w-3 animate-spin' />
							<span>Running tests...</span>
						</div>
					)}
				</div>
			)}

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
