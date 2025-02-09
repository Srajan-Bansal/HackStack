import {
	PrismaClient,
	Difficulty,
	ProblemType,
	TestCaseStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const problem1 = await prisma.problem.create({
		data: {
			title: 'Two Sum',
			slug: 'two-sum',
			description:
				'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
			difficulty: Difficulty.EASY,
			type: [ProblemType.Array, ProblemType.HashTable],
		},
	});

	const problem2 = await prisma.problem.create({
		data: {
			title: 'Reverse String',
			slug: 'reverse-string',
			description: 'Write a function that reverses a string.',
			difficulty: Difficulty.EASY,
			type: [ProblemType.String],
		},
	});

	console.log('✅ Problems & Test Cases Created!');
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
