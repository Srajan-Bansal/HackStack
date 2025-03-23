import React, { createContext, useContext, useState, useEffect } from 'react';
import { userLogin, userSignup, userLogout } from './../lib/api';
import { toast } from '@repo/ui/components/sonner';

interface User {
	id: string;
	email: string;
	name: string | null;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsAuthenticated(true);
			} catch {
				localStorage.removeItem('user');
				toast.error('Invalid user data');
				setIsAuthenticated(false);
			}
		} else {
			setIsAuthenticated(false);
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await userLogin(email, password);
			console.log(response);
			if (response && response.user) {
				localStorage.setItem('user', JSON.stringify(response.user));
				setUser(response.user);
				setIsAuthenticated(true);
			}
		} catch (err: any) {
			const errorMessage =
				err?.response?.data?.message || 'Something went wrong';
			setError(errorMessage);
			toast.error(errorMessage);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	const signup = async (email: string, password: string, name: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await userSignup(email, password, name);

			if (response && response.user) {
				localStorage.setItem('user', JSON.stringify(response.user));
				setUser(response.user);
				setIsAuthenticated(true);
			}
		} catch (err: any) {
			const errorMessage =
				err?.response?.data?.message || 'Something went wrong';
			setError(errorMessage);
			toast.error(errorMessage);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await userLogout();

			if (response) {
				localStorage.removeItem('user');
				setUser(null);
				setIsAuthenticated(false);
			}
		} catch {
			localStorage.removeItem('user');
			setUser(null);
			setIsAuthenticated(false);
			setError('Logout error');
			toast.error('Logout error');
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				error,
				login,
				signup,
				logout,
				isAuthenticated,
				clearError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
};
