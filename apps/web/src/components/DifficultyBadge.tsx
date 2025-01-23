import { Badge } from '@radix-ui/themes';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
	difficulty: Difficulty;
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
	return (
		<span
			className={
				'rounded px-2 py-1 text-xs font-medium capitalize text-white'
			}
		>
			<Badge
				color={
					difficulty == 'easy'
						? 'green'
						: difficulty == 'medium'
							? 'yellow'
							: 'red'
				}
			>
				In progress
			</Badge>
		</span>
	);
};

export default DifficultyBadge;
