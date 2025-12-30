import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@repo/ui/components/Button';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null });
		window.location.href = '/';
	};

	public render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
					<div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md'>
						<h1 className='text-2xl font-bold text-red-600 mb-4'>
							Oops! Something went wrong
						</h1>
						<p className='text-gray-600 dark:text-gray-300 mb-4'>
							We're sorry for the inconvenience. Please try again.
						</p>
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<pre className='bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs overflow-auto mb-4'>
								{this.state.error.toString()}
							</pre>
						)}
						<Button
							onClick={this.handleReset}
							className='w-full'
						>
							Return to Home
						</Button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
