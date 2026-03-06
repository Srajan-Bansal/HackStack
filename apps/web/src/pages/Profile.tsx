import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Spinner from '@repo/ui/components/Spinner';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface UserStats {
	totalSubmissions: number;
	acceptedSubmissions: number;
	solvedProblems: number;
	totalProblems: number;
	byDifficulty: {
		easy: number;
		medium: number;
		hard: number;
	};
	totalByDifficulty: {
		easy: number;
		medium: number;
		hard: number;
	};
}

const CircularProgress = ({
	solved,
	total,
}: {
	solved: number;
	total: number;
}) => {
	const radius = 58;
	const stroke = 7;
	const circumference = 2 * Math.PI * radius;
	const progress = total > 0 ? (solved / total) * circumference : 0;

	return (
		<div className='relative w-40 h-40'>
			<svg className='w-full h-full -rotate-90' viewBox='0 0 130 130'>
				<circle
					cx='65'
					cy='65'
					r={radius}
					fill='none'
					stroke='currentColor'
					strokeWidth={stroke}
					className='text-muted/30'
				/>
				<circle
					cx='65'
					cy='65'
					r={radius}
					fill='none'
					stroke='url(#progress-gradient)'
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={circumference}
					strokeDashoffset={circumference - progress}
					className='transition-all duration-1000 ease-out'
				/>
				<defs>
					<linearGradient
						id='progress-gradient'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='0%'
					>
						<stop offset='0%' stopColor='#10b981' />
						<stop offset='100%' stopColor='#06b6d4' />
					</linearGradient>
				</defs>
			</svg>
			<div className='absolute inset-0 flex flex-col items-center justify-center'>
				<span className='text-3xl font-bold'>{solved}</span>
				<span className='text-xs text-muted-foreground'>
					/{total} Solved
				</span>
			</div>
		</div>
	);
};

const DifficultyRow = ({
	label,
	solved,
	total,
	color,
	bgColor,
}: {
	label: string;
	solved: number;
	total: number;
	color: string;
	bgColor: string;
}) => {
	const percentage = total > 0 ? (solved / total) * 100 : 0;
	return (
		<div>
			<div className='flex items-center justify-between mb-1.5'>
				<span className={`text-sm font-medium ${color}`}>{label}</span>
				<span className='text-sm text-muted-foreground'>
					<span className='font-semibold text-foreground'>{solved}</span>
					/{total}
				</span>
			</div>
			<div className='w-full h-2 bg-muted/40 rounded-full overflow-hidden'>
				<div
					className={`h-full rounded-full transition-all duration-700 ease-out ${bgColor}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};

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
		: '0.0';

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container mx-auto px-4 py-8'>
				<div className='max-w-4xl mx-auto'>
					{/* Profile Header */}
					<div className='rounded-xl border border-border/50 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 p-8 mb-6'>
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

					<div className='grid md:grid-cols-2 gap-6 mb-6'>
						{/* Solved Problems — LeetCode style */}
						<div className='rounded-xl border border-border/50 bg-card/50 p-6'>
							<div className='flex items-center gap-8'>
								<CircularProgress
									solved={stats?.solvedProblems || 0}
									total={stats?.totalProblems || 0}
								/>
								<div className='flex-1 space-y-4'>
									<DifficultyRow
										label='Easy'
										solved={stats?.byDifficulty.easy || 0}
										total={stats?.totalByDifficulty.easy || 0}
										color='text-emerald-500'
										bgColor='bg-emerald-500'
									/>
									<DifficultyRow
										label='Medium'
										solved={stats?.byDifficulty.medium || 0}
										total={stats?.totalByDifficulty.medium || 0}
										color='text-yellow-500'
										bgColor='bg-yellow-500'
									/>
									<DifficultyRow
										label='Hard'
										solved={stats?.byDifficulty.hard || 0}
										total={stats?.totalByDifficulty.hard || 0}
										color='text-red-500'
										bgColor='bg-red-500'
									/>
								</div>
							</div>
						</div>

						{/* Submission Stats */}
						<div className='rounded-xl border border-border/50 bg-card/50 p-6'>
							<h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5'>
								Submissions
							</h3>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-muted-foreground'>
										Total Submissions
									</span>
									<span className='text-lg font-bold'>
										{stats?.totalSubmissions || 0}
									</span>
								</div>
								<div className='h-px bg-border/50' />
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-2.5 h-2.5 rounded-full bg-emerald-500' />
										<span className='text-sm text-muted-foreground'>
											Accepted
										</span>
									</div>
									<span className='text-lg font-bold text-emerald-500'>
										{stats?.acceptedSubmissions || 0}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-2.5 h-2.5 rounded-full bg-red-500' />
										<span className='text-sm text-muted-foreground'>
											Rejected
										</span>
									</div>
									<span className='text-lg font-bold text-red-500'>
										{(stats?.totalSubmissions || 0) -
											(stats?.acceptedSubmissions || 0)}
									</span>
								</div>
								<div className='h-px bg-border/50' />
								<div className='flex items-center justify-between'>
									<span className='text-sm text-muted-foreground'>
										Acceptance Rate
									</span>
									<span className='text-lg font-bold'>{acceptanceRate}%</span>
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
