import { Code2, LogOut, User, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<header className='sticky top-0 z-50 border-b border-white/10 bg-background/80 glass'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='flex items-center gap-8'>
					<Link
						to='/'
						className='flex items-center gap-2.5 group'
						aria-label='HackStack home'
					>
						<div className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'>
							<Code2 className='h-4.5 w-4.5' />
						</div>
						<span className='text-xl font-bold tracking-tight'>
							Hack<span className='text-emerald-500'>Stack</span>
						</span>
					</Link>
					<nav className='flex gap-1' role='navigation'>
						<Link
							to='/problemset'
							className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
								isActive('/problemset')
									? 'text-foreground bg-accent'
									: 'text-foreground/60 hover:text-foreground hover:bg-accent/50'
							}`}
						>
							Problems
						</Link>
						{isAuthenticated && (
							<Link
								to='/profile'
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
									isActive('/profile')
										? 'text-foreground bg-accent'
										: 'text-foreground/60 hover:text-foreground hover:bg-accent/50'
								}`}
							>
								Profile
							</Link>
						)}
					</nav>
				</div>
				{isAuthenticated && user ? (
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-sm'>
							<div className='w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold'>
								{(user.name || user.email || '?')[0].toUpperCase()}
							</div>
							<span className='font-medium'>{user.name || user.email}</span>
						</div>
						<button
							onClick={logout}
							className='flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all'
							aria-label='Logout'
						>
							<LogOut className='h-4 w-4' />
						</button>
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<Link
							to='/login'
							className='px-4 py-2 text-sm font-medium rounded-md text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all'
						>
							Log in
						</Link>
						<Link
							to='/signup'
							className='flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25'
						>
							Get Started
							<ChevronRight className='h-3.5 w-3.5' />
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
