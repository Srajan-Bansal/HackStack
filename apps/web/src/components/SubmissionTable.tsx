import { SubmissionType } from '../utils/types';

const SubmissionTable = ({
	submissions,
}: {
	submissions: SubmissionType[];
}) => {
	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
				<thead>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
							Status
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
							Runtime
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
							Memory
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
							Language
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
							Submitted
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
					{submissions.length > 0 ? (
						submissions.map((submission) => (
							<tr key={submission.id}>
								<td className='px-6 py-4 text-sm'>
									<span
										className={`px-2 py-1 text-xs font-medium rounded-full ${submission.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
									>
										{submission.status}
									</span>
								</td>
								<td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
									{submission.runtime} ms
								</td>
								<td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
									{submission.memory} MB
								</td>
								<td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
									{submission.languageId}
								</td>
								<td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
									{new Date(
										submission.createdAt
									).toLocaleString()}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={5}
								className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
							>
								No submissions found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default SubmissionTable;
