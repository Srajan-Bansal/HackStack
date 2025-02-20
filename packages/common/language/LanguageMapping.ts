export const LanguageMapping: {
	[key: string]: {
		judge0: number;
		internal: number;
		name: string;
		monaco: string;
		fileExtension: string;
	};
} = {
	java: {
		judge0: 62,
		internal: 1,
		name: 'Java',
		monaco: 'java',
		fileExtension: 'java',
	},
	js: {
		judge0: 63,
		internal: 2,
		name: 'JavaScript',
		monaco: 'javascript',
		fileExtension: 'js',
	},
};
