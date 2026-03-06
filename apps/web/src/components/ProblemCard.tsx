import { Link } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import { ProblemSchema } from '@repo/common-zod/types';
import { z } from 'zod';

type ProblemType = z.infer<typeof ProblemSchema>;

type ProblemCardProps = Pick<
	ProblemType,
	'id' | 'title' | 'difficulty' | 'slug'
> & {
	acceptanceRate?: number;
	isEven?: boolean;
};

const ProblemCard = ({
	id,
	title,
	difficulty,
	slug,
	acceptanceRate = 0,
	isEven = false,
}: ProblemCardProps) => {
	return (
		<Link
			to={`/problem/${slug}`}
			className={`grid grid-cols-[60px_1fr_100px_110px] gap-4 items-center px-6 py-3.5 transition-colors hover:bg-emerald-500/5 focus:outline-none focus:bg-emerald-500/5 ${
				isEven ? 'bg-transparent' : 'bg-muted/20'
			}`}
			aria-label={`Solve problem ${id}: ${title} - ${difficulty} difficulty`}
		>
			<span className='text-sm text-muted-foreground font-mono'>
				{id}
			</span>
			<span className='font-medium text-sm hover:text-emerald-500 transition-colors'>
				{title}
			</span>
			<DifficultyBadge
				difficulty={
					difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
				}
			/>
			<span
				className='text-sm text-muted-foreground text-right'
				aria-label={`Acceptance rate: ${acceptanceRate.toFixed(1)} percent`}
			>
				{acceptanceRate.toFixed(1)}%
			</span>
		</Link>
	);
};

export default ProblemCard;
