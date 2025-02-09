import fs from 'fs/promises';
import path from 'path';

const MOUNT_PATH = process.env.MOUNT_PATH;

export const getProblemMarkdown = async (slug: string): Promise<string> => {
	try {
		const filePath = path.join(
			__dirname,
			`../../../problems/${slug}/Problem.md`
		);
		return await fs.readFile(filePath, { encoding: 'utf-8' });
	} catch (error) {
		throw new Error('Problem markdown file not found');
	}
};
