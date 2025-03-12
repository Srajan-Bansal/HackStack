import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const languages = [
		{ id: 1, name: 'Java', judgeOId: 62 },
		{ id: 2, name: 'JavaScript', judgeOId: 63 },
	];

	for (const lang of languages) {
		await prisma.language.upsert({
			where: { id: lang.id },
			update: {},
			create: {
				id: lang.id,
				name: lang.name,
				judgeOId: lang.judgeOId,
			},
		});
	}

	console.log('Languages populated successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		// process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
