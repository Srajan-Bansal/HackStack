import axios from 'axios';

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export const getProblems = async () => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/problemset`);

	return response.data;
};

export const getProblem = async (problemSlug: string) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}`
	);

	return response.data;
};

export const submitSolution = async (
	problemSlug: string,
	code: string,
	languageId: number
) => {
	const response = await axios.post(
		`${BACKEND_URL}/api/v1/createSubmission/${problemSlug}`,
		{ code, languageId }
	);

	console.log('submitSolution', response);
	return response.data;
};

export const checkSubmission = async (tokens: string[]) => {
	const response = await axios.post(`${BACKEND_URL}/api/v1/check`, {
		tokens,
	});

	console.log('checkSubmission', response.data);
	return response.data;
};
