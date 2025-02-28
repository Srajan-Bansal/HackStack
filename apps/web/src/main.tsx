import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './gloabal.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@repo/ui/components/sonner';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<Toaster />
			<App />
		</ThemeProvider>
	</StrictMode>
);
