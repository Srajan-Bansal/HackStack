import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Spinner from '@repo/ui/components/Spinner';
import axios from 'axios';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface UserStats {
	totalSubmissions: number;
	acceptedSubmissions: number;
	solvedProblems: number;
	byDifficulty: {
		easy: number;
		medium: number;
		hard: number;
	};
}

const Profile = () => {
	const { user } = useAuth();
	const [stats, setStats] = useState<UserStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axios.get(`${BACKEND_URL}/api/v1/user/stats`, {
					withCredentials: true,
				});
				setStats(response.data);
			} catch (error) {
				console.error('Failed to fetch stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className='min-h-screen bg-background'>
				<Header />
				<div className='flex items-center justify-center h-96'>
					<Spinner />
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container mx-auto px-4 py-8'>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold mb-8 dark:text-white'>
						Profile Statistics
					</h1>

					{/* User Info */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
						<h2 className='text-xl font-semibold mb-4 dark:text-white'>
							User Information
						</h2>
						<p className='text-gray-600 dark:text-gray-300'>
							<span className='font-medium'>Name:</span> {user?.name || 'Anonymous'}
						</p>
						<p className='text-gray-600 dark:text-gray-300'>
							<span className='font-medium'>Email:</span> {user?.email}
						</p>
					</div>

					{/* Stats Grid */}
					<div className='grid md:grid-cols-3 gap-6 mb-8'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-500 dark:text-gray-400 text-sm'>
										Total Submissions
									</p>
									<p className='text-3xl font-bold dark:text-white'>
										{stats?.totalSubmissions || 0}
									</p>
								</div>
								<Trophy className='w-12 h-12 text-blue-500' />
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-500 dark:text-gray-400 text-sm'>
										Accepted
									</p>
									<p className='text-3xl font-bold text-green-600'>
										{stats?.acceptedSubmissions || 0}
									</p>
								</div>
								<CheckCircle className='w-12 h-12 text-green-500' />
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-gray-500 dark:text-gray-400 text-sm'>
										Rejected
									</p>
									<p className='text-3xl font-bold text-red-600'>
										{(stats?.totalSubmissions || 0) -
											(stats?.acceptedSubmissions || 0)}
									</p>
								</div>
								<XCircle className='w-12 h-12 text-red-500' />
							</div>
						</div>
					</div>

					{/* Problems Solved */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
						<h2 className='text-xl font-semibold mb-6 dark:text-white'>
							Problems Solved: {stats?.solvedProblems || 0}
						</h2>

						<div className='space-y-4'>
							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-green-600'>Easy</span>
									<span className='text-sm font-medium dark:text-white'>
										{stats?.byDifficulty.easy || 0}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className='bg-green-600 h-2.5 rounded-full'
										style={{
											width: `${((stats?.byDifficulty.easy || 0) / (stats?.solvedProblems || 1)) * 100}%`,
										}}
									></div>
								</div>
							</div>

							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-yellow-600'>
										Medium
									</span>
									<span className='text-sm font-medium dark:text-white'>
										{stats?.byDifficulty.medium || 0}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className='bg-yellow-600 h-2.5 rounded-full'
										style={{
											width: `${((stats?.byDifficulty.medium || 0) / (stats?.solvedProblems || 1)) * 100}%`,
										}}
									></div>
								</div>
							</div>

							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-red-600'>Hard</span>
									<span className='text-sm font-medium dark:text-white'>
										{stats?.byDifficulty.hard || 0}
									</span>
								</div>
								<div className='w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className='bg-red-600 h-2.5 rounded-full'
										style={{
											width: `${((stats?.byDifficulty.hard || 0) / (stats?.solvedProblems || 1)) * 100}%`,
										}}
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;
