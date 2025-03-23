import prisma from '.';
import { LanguageMapping } from '@repo/language/LanguageMapping';

async function main() {
	for (const key in LanguageMapping) {
		const lang = LanguageMapping[key];
		if (!lang) return;

		await prisma.language.upsert({
			where: { id: lang.internal },
			update: {
				fileExtension: lang.fileExtension,
				monaco: lang.monaco,
			},
			create: {
				id: lang.internal,
				name: lang.name,
				judge0Id: lang.judge0,
				fileExtension: lang.fileExtension,
				monaco: lang.monaco,
			},
		});
	}

	console.log('Languages populated from LanguageMapping!');
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
