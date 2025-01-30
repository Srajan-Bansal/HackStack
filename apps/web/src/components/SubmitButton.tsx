import { Button } from '@radix-ui/themes';

const SubmitButton = ({
	color,
	children,
	onClick,
}: {
	color?:
		| 'ruby'
		| 'gray'
		| 'gold'
		| 'bronze'
		| 'brown'
		| 'yellow'
		| 'amber'
		| 'orange'
		| 'tomato'
		| 'red'
		| 'crimson'
		| 'pink'
		| 'plum'
		| 'purple'
		| 'violet'
		| 'iris'
		| 'indigo'
		| 'blue'
		| 'cyan'
		| 'teal'
		| 'mint'
		| 'green'
		| 'lime';
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
	return (
		<Button
			color={color}
			variant='solid'
			onClick={onClick}
			className='cursor-pointer'
		>
			{children}
		</Button>
	);
};

export default SubmitButton;
