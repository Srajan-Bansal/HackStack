import { Theme } from '@radix-ui/themes';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';
import Index from './pages/Index';
import Problem from './pages/Problem';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import Spinner from '@repo/ui/components/Spinner';

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
				element={<Navigate to='/problemset' />}
			/>
			<Route
				path='/problemset'
				element={<Index />}
			/>
			<Route
				path='/problem/:slug'
				element={<Problem />}
			/>
		</Routes>
	);
};

const App = () => {
	return (
		<Theme>
			<BrowserRouter>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</BrowserRouter>
		</Theme>
	);
};

export default App;
