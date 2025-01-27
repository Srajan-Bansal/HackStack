import { Link } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import { ProblemType } from '@repo/common-zod/types';

type ProblemCardProps = Pick<ProblemType, 'id' | 'title' | 'difficulty'> & {
	acceptanceRate?: number;
};

const ProblemCard = ({
	id,
	title,
	difficulty,
	acceptanceRate = 0,
}: ProblemCardProps) => {
	return (
		<Link
			to={`/problem/${id}`}
			className='flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent'
		>
			<div className='flex items-center gap-4'>
				<span className='text-sm text-muted-foreground'>{id}.</span>
				<span className='font-medium'>{title}</span>
			</div>
			<div className='flex items-center gap-4'>
				<DifficultyBadge
					difficulty={
						difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
					}
				/>
				<span className='text-sm text-muted-foreground'>
					{acceptanceRate.toFixed(1)}%
				</span>
			</div>
		</Link>
	);
};

export default ProblemCard;
