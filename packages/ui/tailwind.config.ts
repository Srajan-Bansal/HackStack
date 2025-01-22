import sharedConfig from '@repo/tailwind-config';

/** @type {import('tailwindcss').Config} */
module.exports = {
	...sharedConfig,
	content: [...sharedConfig.content, './src/**/*.{js,ts,jsx,tsx}'],
};
