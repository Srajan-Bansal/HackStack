import { Link } from 'react-router-dom';
import { Button } from '@repo/ui/components/Button';
import { Code, Trophy, Users, Zap, Terminal, ArrowRight, ChevronRight, Braces } from 'lucide-react';
import Header from '../components/Header';

const Home = () => {
	return (
		<div className='min-h-screen bg-background'>
			<Header />

			{/* Hero Section */}
			<section className='relative overflow-hidden'>
				{/* Background Effects */}
				<div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5' />
				<div className='absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow' />
				<div className='absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow' style={{ animationDelay: '1.5s' }} />

				<div className='container relative mx-auto px-4 py-24 lg:py-32'>
					<div className='max-w-4xl mx-auto text-center'>
						<div className='animate-fade-in-up'>
							<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-8'>
								<Zap className='w-3.5 h-3.5' />
								Built for competitive programmers
							</div>
						</div>

						<h1 className='text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up-delay-1'>
							Master Algorithms.
							<br />
							<span className='bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
								Ship Better Code.
							</span>
						</h1>

						<p className='text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-2'>
							Practice competitive programming with curated problems, real-time code execution, and instant feedback. Level up your problem-solving skills.
						</p>

						<div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-3'>
							<Link to='/signup'>
								<Button size='lg' className='bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-8 h-12 text-base'>
									Start Solving
									<ArrowRight className='ml-2 h-4 w-4' />
								</Button>
							</Link>
							<Link to='/problemset'>
								<Button size='lg' variant='outline' className='px-8 h-12 text-base border-border/50 hover:bg-accent'>
									Browse Problems
								</Button>
							</Link>
						</div>
					</div>

					{/* Code Preview */}
					<div className='mt-20 max-w-3xl mx-auto animate-fade-in-up-delay-3'>
						<div className='rounded-xl border border-border/50 bg-card/50 glass overflow-hidden shadow-2xl shadow-black/20'>
							<div className='flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30'>
								<div className='flex gap-1.5'>
									<div className='w-3 h-3 rounded-full bg-red-500/80' />
									<div className='w-3 h-3 rounded-full bg-yellow-500/80' />
									<div className='w-3 h-3 rounded-full bg-green-500/80' />
								</div>
								<span className='text-xs text-muted-foreground ml-2 font-mono'>solution.js</span>
							</div>
							<div className='p-6 font-mono text-sm leading-relaxed'>
								<div className='text-muted-foreground'>{'// Two Sum - Find indices of two numbers that add up to target'}</div>
								<div><span className='text-purple-400'>function</span> <span className='text-cyan-400'>twoSum</span>(<span className='text-orange-300'>nums</span>, <span className='text-orange-300'>target</span>) {'{'}</div>
								<div className='pl-4'><span className='text-purple-400'>const</span> <span className='text-foreground'>map</span> = <span className='text-purple-400'>new</span> <span className='text-cyan-400'>Map</span>();</div>
								<div className='pl-4'><span className='text-purple-400'>for</span> (<span className='text-purple-400'>let</span> <span className='text-foreground'>i</span> = <span className='text-emerald-400'>0</span>; <span className='text-foreground'>i</span> {'<'} <span className='text-orange-300'>nums</span>.<span className='text-foreground'>length</span>; <span className='text-foreground'>i</span>++) {'{'}</div>
								<div className='pl-8'><span className='text-purple-400'>const</span> <span className='text-foreground'>complement</span> = <span className='text-orange-300'>target</span> - <span className='text-orange-300'>nums</span>[<span className='text-foreground'>i</span>];</div>
								<div className='pl-8'><span className='text-purple-400'>if</span> (<span className='text-foreground'>map</span>.<span className='text-cyan-400'>has</span>(<span className='text-foreground'>complement</span>)) <span className='text-purple-400'>return</span> [<span className='text-foreground'>map</span>.<span className='text-cyan-400'>get</span>(<span className='text-foreground'>complement</span>), <span className='text-foreground'>i</span>];</div>
								<div className='pl-8'><span className='text-foreground'>map</span>.<span className='text-cyan-400'>set</span>(<span className='text-orange-300'>nums</span>[<span className='text-foreground'>i</span>], <span className='text-foreground'>i</span>);</div>
								<div className='pl-4'>{'}'}</div>
								<div>{'}'}</div>
								<div className='mt-2 text-emerald-400'>{'// All test cases passed  (3/3)'}</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='border-y border-border/50 bg-muted/20'>
				<div className='container mx-auto px-4 py-12'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
						{[
							{ value: '50+', label: 'Coding Problems' },
							{ value: '5+', label: 'Languages Supported' },
							{ value: '100+', label: 'Test Cases' },
							{ value: '24/7', label: 'Code Execution' },
						].map((stat) => (
							<div key={stat.label} className='text-center'>
								<div className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
									{stat.value}
								</div>
								<div className='text-sm text-muted-foreground mt-1'>{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section className='container mx-auto px-4 py-24'>
				<div className='text-center mb-16'>
					<h2 className='text-3xl lg:text-4xl font-bold mb-4'>
						Everything you need to{' '}
						<span className='bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
							level up
						</span>
					</h2>
					<p className='text-muted-foreground max-w-2xl mx-auto'>
						A complete platform designed to help you practice, learn, and master competitive programming.
					</p>
				</div>

				<div className='grid md:grid-cols-3 gap-6'>
					<div className='group relative rounded-xl border border-border/50 bg-card/50 p-6 hover:border-emerald-500/30 hover:bg-card transition-all duration-300'>
						<div className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4'>
							<Braces className='w-5 h-5' />
						</div>
						<h3 className='text-lg font-semibold mb-2'>Diverse Problems</h3>
						<p className='text-sm text-muted-foreground leading-relaxed'>
							From arrays to dynamic programming - problems across all difficulty levels and topics.
						</p>
					</div>
					<div className='group relative rounded-xl border border-border/50 bg-card/50 p-6 hover:border-cyan-500/30 hover:bg-card transition-all duration-300'>
						<div className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 mb-4'>
							<Terminal className='w-5 h-5' />
						</div>
						<h3 className='text-lg font-semibold mb-2'>Real-time Execution</h3>
						<p className='text-sm text-muted-foreground leading-relaxed'>
							Write, run, and test your code instantly with our integrated code execution engine.
						</p>
					</div>
					<div className='group relative rounded-xl border border-border/50 bg-card/50 p-6 hover:border-purple-500/30 hover:bg-card transition-all duration-300'>
						<div className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 mb-4'>
							<Trophy className='w-5 h-5' />
						</div>
						<h3 className='text-lg font-semibold mb-2'>Track Progress</h3>
						<p className='text-sm text-muted-foreground leading-relaxed'>
							Monitor your growth with detailed statistics on submissions, acceptance rates, and streaks.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='container mx-auto px-4 pb-24'>
				<div className='relative rounded-2xl overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600' />
					<div
						className='absolute inset-0 opacity-30'
						style={{
							backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
							backgroundSize: '30px 30px',
						}}
					/>
					<div className='relative px-8 py-16 text-center'>
						<h2 className='text-3xl lg:text-4xl font-bold text-white mb-4'>
							Ready to start solving?
						</h2>
						<p className='text-white/80 max-w-xl mx-auto mb-8'>
							Join HackStack today and take your programming skills to the next level.
						</p>
						<Link to='/signup'>
							<Button size='lg' className='bg-white text-emerald-700 hover:bg-white/90 px-8 h-12 text-base font-semibold shadow-lg'>
								Create Free Account
								<ChevronRight className='ml-1 h-4 w-4' />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='border-t border-border/50'>
				<div className='container mx-auto px-4 py-8'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
						<div className='flex items-center gap-2'>
							<div className='flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'>
								<Code className='h-3.5 w-3.5' />
							</div>
							<span className='text-sm font-semibold'>HackStack</span>
						</div>
						<p className='text-sm text-muted-foreground'>
							Built for developers who love to solve problems.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
