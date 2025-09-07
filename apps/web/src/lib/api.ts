import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const getProblems = async () => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/problemset`, {
		withCredentials: true,
	});
	return response.data;
};

export const getProblem = async (problemSlug: string, languageId: string) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}`,
		{
			params: { languageId },
			withCredentials: true,
		}
	);
	return response.data;
};

export const getBoilerplateCode = async (problemSlug: string, languageId: string) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}/getBoilerplateCode`,
		{
			params: { languageId },
			withCredentials: true,
		}
	);
	return response.data;
};

export const submitSolution = async (problemSlug: string, code: string, languageId: string) => {
	const response = await axios.post(
		`${BACKEND_URL}/api/v1/createSubmission/${problemSlug}`,
		{ code, languageId },
		{ withCredentials: true }
	);
	return response.data;
};

export const checkBatchSubmission = async (tokens: string[]) => {
	const response = await axios.post(`${BACKEND_URL}/api/v1/check`, { tokens, }, { withCredentials: true });
	return response.data;
};

export const getUser = async () => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/me`, {
		withCredentials: true,
	});
	return response.data;
};

export const userLogin = async (email: string, password: string) => {
	const response = await axios.post(
		`${BACKEND_URL}/api/v1/login`,
		{
			email,
			password,
		},
		{ withCredentials: true }
	);
	return response.data;
};

export const userSignup = async (email: string, password: string, name: string) => {
	const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, { email, password, name }, { withCredentials: true });
	return response.data;
};

export const userLogout = async () => {
	const response = await axios.post(`${BACKEND_URL}/api/v1/logout`, {
		withCredentials: true,
	});
	return response.data;
};

export const getUserSubmissions = async (problemSlug: string) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}/submissions`,
		{
			withCredentials: true,
		}
	);
	return response.data;
};
