import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { useLocation, Link } from 'react-router-dom';
import { Code2, Braces, Terminal, Trophy } from 'lucide-react';

export default function Auth() {
	const location = useLocation();
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-start'>
					<Link to='/' className='flex items-center gap-2'>
						<div className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'>
							<Code2 className='h-4.5 w-4.5' />
						</div>
						<span className='text-xl font-bold tracking-tight'>
							Hack<span className='text-emerald-500'>Stack</span>
						</span>
					</Link>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='w-full max-w-xs'>
						{location.pathname === '/login' && <LoginForm />}
						{location.pathname === '/signup' && <SignupForm />}
					</div>
				</div>
			</div>
			<div className='relative hidden lg:flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 overflow-hidden'>
				{/* Background pattern */}
				<div
					className='absolute inset-0 opacity-20'
					style={{
						backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
						backgroundSize: '40px 40px',
					}}
				/>

				{/* Floating orbs */}
				<div className='absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-20 right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float' style={{ animationDelay: '3s' }} />

				{/* Content */}
				<div className='relative z-10 max-w-md px-8 text-center'>
					<div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 glass mx-auto mb-8'>
						<Terminal className='w-8 h-8 text-white' />
					</div>
					<h2 className='text-3xl font-bold text-white mb-4'>
						Code. Solve. Grow.
					</h2>
					<p className='text-white/70 mb-10'>
						Join thousands of developers sharpening their competitive programming skills on HackStack.
					</p>
					<div className='grid grid-cols-3 gap-6'>
						{[
							{ icon: Braces, label: '50+ Problems' },
							{ icon: Terminal, label: 'Live Execution' },
							{ icon: Trophy, label: 'Track Progress' },
						].map(({ icon: Icon, label }) => (
							<div key={label} className='flex flex-col items-center gap-2'>
								<div className='w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center'>
									<Icon className='w-5 h-5 text-white/80' />
								</div>
								<span className='text-xs text-white/60'>{label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
