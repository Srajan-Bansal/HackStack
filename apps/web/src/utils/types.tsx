export type SubmissionType = {
	id: string;
	status: string;
	runtime: number;
	memory: number;
	languageId: number;
	Language?: {
		name: string;
	};
	createdAt: string;
};
