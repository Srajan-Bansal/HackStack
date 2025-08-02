import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

const EXPIRY_TIME = Number(import.meta.env.VITE_LOCALSTORAGE_EXPIRES_IN);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveUserToLocalStorage = (user: User) => {
	const userWithExpiry = {
		...user,
		expiry: new Date().getTime() + EXPIRY_TIME,
	};
	localStorage.setItem('user', JSON.stringify(userWithExpiry));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		const now = new Date().getTime();
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				if (parsedUser.expiry && now < parsedUser.expiry) {
					setUser(parsedUser);
					setIsAuthenticated(true);
				} else {
					localStorage.removeItem('user');
					setIsAuthenticated(false);
				}
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

	const login = useCallback(async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await userLogin(email, password);
			if (response && response.user) {
				saveUserToLocalStorage(response.user);
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
	}, []);

	const signup = useCallback(async (email: string, password: string, name: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await userSignup(email, password, name);

			if (response && response.user) {
				saveUserToLocalStorage(response.user);
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
	}, []);

	const logout = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			await userLogout();
			localStorage.removeItem('user');
			setUser(null);
			setIsAuthenticated(false);
			toast.success('Successfully logged out');
		} catch (err: any) {
			localStorage.removeItem('user');
			setUser(null);
			setIsAuthenticated(false);
			const errorMessage =
				err?.response?.data?.message || 'Logout failed';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const contextValue = useMemo(() => ({
		user,
		loading,
		error,
		login,
		signup,
		logout,
		isAuthenticated,
		clearError,
	}), [user, loading, error, login, signup, logout, isAuthenticated, clearError]);

	return (
		<AuthContext.Provider value={contextValue}>
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
