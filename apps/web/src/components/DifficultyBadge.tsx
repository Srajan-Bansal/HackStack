type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
	difficulty: Difficulty;
}

const colorMap = {
	easy: 'text-emerald-500',
	medium: 'text-yellow-500',
	hard: 'text-red-500',
};

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
	return (
		<span
			className={`text-xs font-semibold capitalize ${colorMap[difficulty]}`}
			aria-label={`Difficulty level: ${difficulty}`}
		>
			{difficulty}
		</span>
	);
};

export default DifficultyBadge;
