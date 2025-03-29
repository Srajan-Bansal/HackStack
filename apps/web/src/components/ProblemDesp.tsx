import { useEffect, useState } from 'react';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@repo/ui/components/react-tabs';
import { getUserSubmmissions } from '../lib/api';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Spinner from '@repo/ui/components/Spinner';
import SubmissionTable from './SubmissionTable';
import { SubmissionType } from '../utils/types';

const ProblemDesp = ({
	problem,
	isLoading,
	setIsLoading,
	problemSlug,
}: {
	problem: string;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	problemSlug: string;
}) => {
	const [submissions, setSubmissions] = useState<SubmissionType[]>([]);

	useEffect(() => {
		setIsLoading(true);
		if (problemSlug) {
			getUserSubmmissions(problemSlug)
				.then((data) => {
					setIsLoading(false);
					setSubmissions(data);
					console.log(data);
				})
				.catch(() => setIsLoading(false));
		}
	}, []);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<Tabs
			defaultValue='description'
			className='w-full'
		>
			<TabsList className='grid grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 p-1 ro unded-t-md'>
				<TabsTrigger
					value='description'
					className={tabNameClassName}
				>
					Description
				</TabsTrigger>
				<TabsTrigger
					value='solutions'
					className={tabNameClassName}
				>
					Solutions
				</TabsTrigger>
				<TabsTrigger
					value='submissions'
					className={tabNameClassName}
				>
					Submissions
				</TabsTrigger>
			</TabsList>
			<div className='border border-gray-200 dark:border-gray-700 rounded-b-md'>
				<TabsContent
					value='description'
					className='p-6 focus:outline-none'
				>
					<div className='flex gap-8 flex-col w-full min-w-0'>
						<Markdown rehypePlugins={[remarkGfm]}>
							{problem || 'No description available.'}
						</Markdown>
					</div>
				</TabsContent>
				<TabsContent
					value='solutions'
					className='p-6 focus:outline-none'
				>
					<div className='flex flex-col gap-4'>
						<h3 className='text-xl font-medium'>
							Community Solutions
						</h3>
						<p className='text-gray-600 dark:text-gray-400'>
							No community solutions available yet.
						</p>
					</div>
				</TabsContent>
				<TabsContent
					value='submissions'
					className='p-6 focus:outline-none'
				>
					<div className='flex flex-col gap-4'>
						<h3 className='text-xl font-medium'>
							Your Submissions
						</h3>
						{isLoading ? (
							<div className='flex justify-center py-8'>
								<Spinner />
							</div>
						) : (
							<SubmissionTable submissions={submissions} />
						)}
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
};

export default ProblemDesp;

const tabNameClassName =
	'rounded-sm bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400';
