import fs from 'fs/promises';
import path from 'path';

const PROBLEMS_PATH = path.resolve(
	__dirname,
	'../../../../../hackstack-problems'
);

export const getProblemMarkdown = async (slug: string): Promise<string> => {
	try {
		const filePath = path.join(PROBLEMS_PATH, slug, 'Problem.md');
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		throw new Error('Problem markdown file not found');
	}
};
