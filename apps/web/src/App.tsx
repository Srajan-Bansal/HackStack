import { Theme } from '@radix-ui/themes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Problem from './pages/Problem';

const App = () => {
	return (
		<Theme>
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={<Index />}
					/>
					<Route
						path='/problem/:slug'
						element={<Problem />}
					/>
				</Routes>
			</BrowserRouter>
		</Theme>
	);
};

export default App;
