import { Theme } from '@radix-ui/themes';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/Index';
import Problem from './pages/Problem';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import Spinner from '@repo/ui/components/Spinner';
import ErrorBoundary from './components/ErrorBoundary';

const RedirectIfAuthenticated = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return (
			<Navigate
				to='/problemset'
				replace
			/>
		);
	}

	return <Outlet />;
};

const AppRoutes = () => {
	const { loading } = useAuth();

	if (loading) {
		return <Spinner />;
	}

	return (
		<Routes>
			<Route element={<RedirectIfAuthenticated />}>
				<Route
					path='/login'
					element={<Auth />}
				/>
				<Route
					path='/signup'
					element={<Auth />}
				/>
			</Route>
			<Route
				path='/'
				element={<Home />}
			/>
			<Route
				path='/problemset'
				element={<Index />}
			/>
			<Route
				path='/problem/:slug'
				element={<Problem />}
			/>
			<Route
				path='/profile'
				element={<Profile />}
			/>
		</Routes>
	);
};

const App = () => {
	return (
		<ErrorBoundary>
			<Theme>
				<BrowserRouter>
					<AuthProvider>
						<AppRoutes />
					</AuthProvider>
				</BrowserRouter>
			</Theme>
		</ErrorBoundary>
	);
};

export default App;
