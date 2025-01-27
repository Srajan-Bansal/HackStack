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
			statement:
				'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
			difficulty: Difficulty.EASY,
			type: [ProblemType.Array, ProblemType.HashTable],
			testCases: {
				create: [
					{
						input: 'nums = [2,7,11,15], target = 9',
						output: '[0,1]',
						status: TestCaseStatus.PENDING,
					},
					{
						input: 'nums = [3, 2, 4], target = 6',
						output: '[1,2]',
						status: TestCaseStatus.PENDING,
					},
				],
			},
		},
	});

	const problem2 = await prisma.problem.create({
		data: {
			title: 'Reverse String',
			slug: 'reverse-string',
			statement: 'Write a function that reverses a string.',
			difficulty: Difficulty.EASY,
			type: [ProblemType.String],
			testCases: {
				create: [
					{
						input: 'hello',
						output: 'olleh',
						status: TestCaseStatus.PENDING,
					},
					{
						input: 'world',
						output: 'dlrow',
						status: TestCaseStatus.PENDING,
					},
				],
			},
		},
	});

	console.log('Problems and Test Cases created!');
}

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
