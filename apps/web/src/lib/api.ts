import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const getProblems = async () => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/problemset`);
	return response.data;
};

export const getProblem = async (problemSlug: string, languageId: string) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}`,
		{
			params: { languageId },
		}
	);
	return response.data;
};

export const getBoilerplateCode = async (
	problemSlug: string,
	languageId: string
) => {
	const response = await axios.get(
		`${BACKEND_URL}/api/v1/problem/${problemSlug}/getBoilerplateCode`,
		{
			params: { languageId },
		}
	);
	return response.data;
};

export const submitSolution = async (
	problemSlug: string,
	code: string,
	languageId: string
) => {
	const response = await axios.post(
		`${BACKEND_URL}/api/v1/createSubmission/${problemSlug}`,
		{ code, languageId }
	);
	console.log(response.data);
	return response.data;
};

export const checkBatchSubmission = async (tokens: string[]) => {
	const response = await axios.post(`${BACKEND_URL}/api/v1/check`, {
		tokens,
	});
	return response.data;
};
