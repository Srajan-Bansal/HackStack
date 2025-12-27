export const LanguageMapping: {
	[key: string]: {
		internal: number;
		name: string;
		monaco: string;
		fileExtension: string;
	};
} = {
	java: {
		internal: 1,
		name: 'Java',
		monaco: 'java',
		fileExtension: 'java',
	},
	js: {
		internal: 2,
		name: 'JavaScript',
		monaco: 'javascript',
		fileExtension: 'js',
	},
};
