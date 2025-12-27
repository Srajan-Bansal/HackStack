import { PrismaClient, Difficulty, ProblemType } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const PROBLEMS_PATH = path.resolve(__dirname, '../../../../hackstack-problems');

interface ProblemMetadata {
	title: string;
	slug: string;
	difficulty: Difficulty;
	type: ProblemType[];
}

// Problem metadata mapping
const problemsMetadata: Record<string, Omit<ProblemMetadata, 'slug'>> = {
	'two-sum': {
		title: 'Two Sum',
		difficulty: 'EASY',
		type: ['Array', 'HashTable'],
	},
	'reverse-string': {
		title: 'Reverse String',
		difficulty: 'EASY',
		type: ['String'],
	},
	'palindrome-check': {
		title: 'Palindrome Check',
		difficulty: 'EASY',
		type: ['String'],
	},
	'max-element': {
		title: 'Max Element',
		difficulty: 'EASY',
		type: ['Array'],
	},
	'count-vowels': {
		title: 'Count Vowels',
		difficulty: 'EASY',
		type: ['String'],
	},
	'factorial': {
		title: 'Factorial',
		difficulty: 'EASY',
		type: ['Math'],
	},
	'fibonacci': {
		title: 'Fibonacci',
		difficulty: 'EASY',
		type: ['Math'],
	},
	'valid-parentheses': {
		title: 'Valid Parentheses',
		difficulty: 'MEDIUM',
		type: ['String', 'Stack'],
	},
	'anagram-check': {
		title: 'Anagram Check',
		difficulty: 'EASY',
		type: ['String', 'HashTable'],
	},
	'sort-array': {
		title: 'Sort Array',
		difficulty: 'MEDIUM',
		type: ['Array', 'Sorting'],
	},
	'find-median': {
		title: 'Find Median',
		difficulty: 'MEDIUM',
		type: ['Array', 'Sorting', 'Math'],
	},
	'gcd-of-two-numbers': {
		title: 'GCD of Two Numbers',
		difficulty: 'EASY',
		type: ['Math'],
	},
};

async function getProblemMarkdown(slug: string): Promise<string> {
	try {
		const filePath = path.join(PROBLEMS_PATH, slug, 'Problem.md');
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		throw new Error(`Problem markdown file not found for slug: ${slug}`);
	}
}

async function getBoilerplateCode(slug: string, language: string): Promise<string | null> {
	try {
		const extension = language === 'java' ? 'java' : 'js';
		const filePath = path.join(PROBLEMS_PATH, slug, 'boilerplate', `function.${extension}`);
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		return null;
	}
}

async function getFullBoilerplateCode(slug: string, language: string): Promise<string | null> {
	try {
		const extension = language === 'java' ? 'java' : 'js';
		const filePath = path.join(PROBLEMS_PATH, slug, 'boilerplate-full', `function.${extension}`);
		return await fs.readFile(filePath, 'utf-8');
	} catch {
		return null;
	}
}

async function seedProblems() {
	console.log('Starting problem seeding...\n');

	let problemId = 1;

	for (const [slug, metadata] of Object.entries(problemsMetadata)) {
		try {
			console.log(`Processing: ${metadata.title} (${slug})...`);

			const description = await getProblemMarkdown(slug);

			const problem = await prisma.problem.upsert({
				where: { slug },
				update: {
					title: metadata.title,
					description,
					difficulty: metadata.difficulty,
					type: metadata.type,
				},
				create: {
					id: problemId,
					title: metadata.title,
					description,
					slug,
					difficulty: metadata.difficulty,
					type: metadata.type,
					hidden: false,
				},
			});

			console.log(`  ✓ Problem created/updated (ID: ${problem.id})`);

			// Seed boilerplate code for JavaScript
			const jsLanguage = await prisma.language.findFirst({
				where: { name: 'JavaScript' },
			});

			if (jsLanguage) {
				const jsPartialCode = await getBoilerplateCode(slug, 'javascript');
				const jsFullCode = await getFullBoilerplateCode(slug, 'javascript');

				if (jsPartialCode) {
					await prisma.defaultCode.upsert({
						where: {
							problemId_languageId_DefaultCodeType: {
								problemId: problem.id,
								languageId: jsLanguage.id,
								DefaultCodeType: 'PARTIALBOILERPLATECODE',
							},
						},
						update: { code: jsPartialCode },
						create: {
							code: jsPartialCode,
							problemId: problem.id,
							languageId: jsLanguage.id,
							DefaultCodeType: 'PARTIALBOILERPLATECODE',
						},
					});
					console.log('  ✓ JavaScript partial boilerplate seeded');
				}

				if (jsFullCode) {
					await prisma.defaultCode.upsert({
						where: {
							problemId_languageId_DefaultCodeType: {
								problemId: problem.id,
								languageId: jsLanguage.id,
								DefaultCodeType: 'FULLBOILERPLATECODE',
							},
						},
						update: { code: jsFullCode },
						create: {
							code: jsFullCode,
							problemId: problem.id,
							languageId: jsLanguage.id,
							DefaultCodeType: 'FULLBOILERPLATECODE',
						},
					});
					console.log('  ✓ JavaScript full boilerplate seeded');
				}
			}

			// Seed boilerplate code for Java
			const javaLanguage = await prisma.language.findFirst({
				where: { name: 'Java' },
			});

			if (javaLanguage) {
				const javaPartialCode = await getBoilerplateCode(slug, 'java');
				const javaFullCode = await getFullBoilerplateCode(slug, 'java');

				if (javaPartialCode) {
					await prisma.defaultCode.upsert({
						where: {
							problemId_languageId_DefaultCodeType: {
								problemId: problem.id,
								languageId: javaLanguage.id,
								DefaultCodeType: 'PARTIALBOILERPLATECODE',
							},
						},
						update: { code: javaPartialCode },
						create: {
							code: javaPartialCode,
							problemId: problem.id,
							languageId: javaLanguage.id,
							DefaultCodeType: 'PARTIALBOILERPLATECODE',
						},
					});
					console.log('  ✓ Java partial boilerplate seeded');
				}

				if (javaFullCode) {
					await prisma.defaultCode.upsert({
						where: {
							problemId_languageId_DefaultCodeType: {
								problemId: problem.id,
								languageId: javaLanguage.id,
								DefaultCodeType: 'FULLBOILERPLATECODE',
							},
						},
						update: { code: javaFullCode },
						create: {
							code: javaFullCode,
							problemId: problem.id,
							languageId: javaLanguage.id,
							DefaultCodeType: 'FULLBOILERPLATECODE',
						},
					});
					console.log('  ✓ Java full boilerplate seeded');
				}
			}

			console.log('');
			problemId++;
		} catch (error) {
			console.error(`  ✗ Error processing ${slug}:`, error);
			console.log('');
		}
	}

	console.log('✓ Problem seeding completed successfully!');
}

async function main() {
	await seedProblems();
}

main()
	.catch((e) => {
		console.error('Seeding failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
