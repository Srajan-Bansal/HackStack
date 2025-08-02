import { Code2, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
	const { user, logout, isAuthenticated } = useAuth();

	return (
		<header className='border-b border-border bg-background'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='flex items-center gap-6'>
					<Link
						to='/'
						className='flex items-center gap-2'
						aria-label='HackStack home'
					>
						<Code2 className='h-6 w-6' />
						<span className='text-xl font-bold'>HackStack</span>
					</Link>
					<nav className='flex gap-4' role='navigation'>
						<Link
							to='/problemset'
							className='text-foreground/60 hover:text-foreground transition-colors'
						>
							Problems
						</Link>
					</nav>
				</div>
				{isAuthenticated && user ? (
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2 text-sm'>
							<User className='h-4 w-4' />
							<span>{user.name || user.email}</span>
						</div>
						<button
							onClick={logout}
							className='flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors'
							aria-label='Logout'
						>
							<LogOut className='h-4 w-4' />
							Logout
						</button>
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<Link
							to='/login'
							className='px-3 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors'
						>
							Login
						</Link>
						<Link
							to='/signup'
							className='px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
						>
							Sign Up
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
