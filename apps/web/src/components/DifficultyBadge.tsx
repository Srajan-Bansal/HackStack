import { Badge } from '@radix-ui/themes';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
	difficulty: Difficulty;
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
	return (
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
			aria-label={`Difficulty level: ${difficulty}`}
		>
			{difficulty}
		</Badge>
	);
};

export default DifficultyBadge;
