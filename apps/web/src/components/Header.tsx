import { Code2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header className='border-b border-border bg-background'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='flex items-center gap-6'>
					<Link
						to='/'
						className='flex items-center gap-2'
					>
						<Code2 className='h-6 w-6' />
						<span className='text-xl font-bold'>CodeChallenge</span>
					</Link>
					<nav className='flex gap-4'>
						<Link
							to='/'
							className='text-foreground/60 hover:text-foreground'
						>
							Problems
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
