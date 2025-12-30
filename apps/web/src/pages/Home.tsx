import { Link } from 'react-router-dom';
import { Button } from '@repo/ui/components/Button';
import { Code, Trophy, Users } from 'lucide-react';
import Header from '../components/Header';

const Home = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
			<Header />
			<div className='container mx-auto px-4 py-16'>
				{/* Hero Section */}
				<div className='text-center mb-16'>
					<h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
						Welcome to HackStack
					</h1>
					<p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
						Master competitive programming through practice and challenges
					</p>
					<div className='flex gap-4 justify-center'>
						<Link to='/signup'>
							<Button size='lg'>Get Started</Button>
						</Link>
						<Link to='/problemset'>
							<Button size='lg' variant='outline'>
								Browse Problems
							</Button>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className='grid md:grid-cols-3 gap-8 mt-16'>
					<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
						<Code className='w-12 h-12 text-blue-600 mb-4' />
						<h3 className='text-xl font-semibold mb-2 dark:text-white'>
							Diverse Problems
						</h3>
						<p className='text-gray-600 dark:text-gray-300'>
							Solve problems ranging from easy to hard across multiple topics
						</p>
					</div>
					<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
						<Trophy className='w-12 h-12 text-yellow-600 mb-4' />
						<h3 className='text-xl font-semibold mb-2 dark:text-white'>
							Track Progress
						</h3>
						<p className='text-gray-600 dark:text-gray-300'>
							Monitor your growth and see your solved problems
						</p>
					</div>
					<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
						<Users className='w-12 h-12 text-green-600 mb-4' />
						<h3 className='text-xl font-semibold mb-2 dark:text-white'>
							Join Community
						</h3>
						<p className='text-gray-600 dark:text-gray-300'>
							Learn from others and share your solutions
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
