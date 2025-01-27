import { Badge } from '@radix-ui/themes';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
	difficulty: Difficulty;
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
	return (
		<span>
			<Badge
				className='capitalize'
				color={
					difficulty === 'easy'
						? 'green'
						: difficulty === 'medium'
							? 'yellow'
							: difficulty === 'hard'
								? 'red'
								: 'cyan'
				}
			>
				{difficulty}
			</Badge>
		</span>
	);
};

export default DifficultyBadge;
