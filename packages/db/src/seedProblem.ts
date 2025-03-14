import { PrismaClient } from '@prisma/client';
import { getProblemMarkdown } from './../../../apps/http-backend/src/utils/getProblemMarkdown';

const prisma = new PrismaClient();

const FILEPATH = './../../../apps/problems/max-element/';
const SLUG = 'max-element';

const problemMarkdown = getProblemMarkdown(SLUG);

async function main() {
	const problems = [
		{
			title: 'Max Element',
			description: problemMarkdown,
			slug: SLUG,
			difficulty: 'Easy',
			type: ['Array', 'String', 'HashTable', 'LinkedList'],
		},
	];

	for (const problem of problems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: {},
			create: {
				id: 1,
				title: problem.title,
				description: problem.description,
				slug: problem.slug,
				difficulty: problem.difficulty,
				type: problem.type,
			},
		});
	}

	console.log('Problems populated successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		// process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
