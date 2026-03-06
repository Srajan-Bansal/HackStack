import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Spinner from '@repo/ui/components/Spinner';
import axios from 'axios';
import { Trophy, CheckCircle, XCircle, Target } from 'lucide-react';

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

	const acceptanceRate = stats?.totalSubmissions
		? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1)
		: '0';

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container mx-auto px-4 py-8'>
				<div className='max-w-4xl mx-auto'>
					{/* Profile Header */}
					<div className='rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 p-8 mb-8'>
						<div className='flex items-center gap-5'>
							<div className='w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20'>
								{(user?.name || user?.email || '?')[0].toUpperCase()}
							</div>
							<div>
								<h1 className='text-2xl font-bold'>
									{user?.name || 'Anonymous'}
								</h1>
								<p className='text-muted-foreground text-sm'>{user?.email}</p>
							</div>
						</div>
					</div>

					{/* Stats Grid */}
					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
						<div className='rounded-xl border border-border/50 bg-card/50 p-5'>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Total Submissions</span>
								<Target className='w-4 h-4 text-blue-500' />
							</div>
							<div className='text-2xl font-bold'>{stats?.totalSubmissions || 0}</div>
						</div>
						<div className='rounded-xl border border-border/50 bg-card/50 p-5'>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Accepted</span>
								<CheckCircle className='w-4 h-4 text-emerald-500' />
							</div>
							<div className='text-2xl font-bold text-emerald-500'>{stats?.acceptedSubmissions || 0}</div>
						</div>
						<div className='rounded-xl border border-border/50 bg-card/50 p-5'>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Rejected</span>
								<XCircle className='w-4 h-4 text-red-500' />
							</div>
							<div className='text-2xl font-bold text-red-500'>{(stats?.totalSubmissions || 0) - (stats?.acceptedSubmissions || 0)}</div>
						</div>
						<div className='rounded-xl border border-border/50 bg-card/50 p-5'>
							<div className='flex items-center justify-between mb-3'>
								<span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Acceptance Rate</span>
								<Trophy className='w-4 h-4 text-yellow-500' />
							</div>
							<div className='text-2xl font-bold'>{acceptanceRate}%</div>
						</div>
					</div>

					{/* Problems Solved Breakdown */}
					<div className='rounded-xl border border-border/50 bg-card/50 p-6'>
						<h2 className='text-lg font-semibold mb-6'>
							Problems Solved
							<span className='ml-2 text-emerald-500'>
								{stats?.solvedProblems || 0}
							</span>
						</h2>

						<div className='space-y-5'>
							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-emerald-500'>Easy</span>
									<span className='text-sm font-medium'>{stats?.byDifficulty.easy || 0}</span>
								</div>
								<div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
									<div
										className='h-full bg-emerald-500 rounded-full transition-all duration-500'
										style={{ width: `${((stats?.byDifficulty.easy || 0) / Math.max(stats?.solvedProblems || 1, 1)) * 100}%` }}
									/>
								</div>
							</div>
							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-yellow-500'>Medium</span>
									<span className='text-sm font-medium'>{stats?.byDifficulty.medium || 0}</span>
								</div>
								<div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
									<div
										className='h-full bg-yellow-500 rounded-full transition-all duration-500'
										style={{ width: `${((stats?.byDifficulty.medium || 0) / Math.max(stats?.solvedProblems || 1, 1)) * 100}%` }}
									/>
								</div>
							</div>
							<div>
								<div className='flex justify-between mb-2'>
									<span className='text-sm font-medium text-red-500'>Hard</span>
									<span className='text-sm font-medium'>{stats?.byDifficulty.hard || 0}</span>
								</div>
								<div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
									<div
										className='h-full bg-red-500 rounded-full transition-all duration-500'
										style={{ width: `${((stats?.byDifficulty.hard || 0) / Math.max(stats?.solvedProblems || 1, 1)) * 100}%` }}
									/>
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
