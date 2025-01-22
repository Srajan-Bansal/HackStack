import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';

const config: Config = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./index.html',
		'../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
		'node_modules/@repo/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	presets: [sharedConfig],
};

export default config;
