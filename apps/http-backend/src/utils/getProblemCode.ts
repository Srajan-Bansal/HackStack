import fs from 'fs';

type SUPPORTED_LANGS = 'java' | 'js';

interface Problem {
	slug: string;
	fullBoilerPlate: string;
	inputs: string[];
	outputs: string[];
}

const MOUNT_PATH = process.env.MOUNT_PATH || './../../../problems';
export const getProblemCode = async (
	slug: string,
	languageId: SUPPORTED_LANGS
): Promise<Problem> => {
	const fullBoilerPlate = await getFullBoilerplate({
		slug,
		languageId,
	});

	const inputs = await getProblemInputs(slug);
	const outputs = await getProblemOutputs(slug);

	return {
		slug: slug,
		fullBoilerPlate,
		inputs,
		outputs,
	};
};

const getFullBoilerplate = async ({
	slug,
	languageId,
}: {
	slug: string;
	languageId: SUPPORTED_LANGS;
}): Promise<string> => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			`${MOUNT_PATH}/${slug}/boilerplate-full/function.${languageId}`,
			{ encoding: 'utf-8' },
			(err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			}
		);
	});
};

const getProblemInputs = async (slug: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		fs.readdir(`${MOUNT_PATH}/${slug}/tests/inputs`, async (err, files) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				await Promise.all(
					files.map(async (file) => {
						return new Promise((resolve, reject) => {
							fs.readFile(
								`${MOUNT_PATH}/${slug}/tests/inputs/${file}`,
								{ encoding: 'utf-8' },
								(err, data) => {
									if (err) {
										reject(err);
									} else {
										resolve(data);
									}
								}
							);
						});
					})
				)
					.then((data) => {
						resolve(data as any);
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	});
};

const getProblemOutputs = async (slug: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		fs.readdir(
			`${MOUNT_PATH}/${slug}/tests/outputs`,
			async (err, files) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					await Promise.all(
						files.map(async (file) => {
							return new Promise((resolve, reject) => {
								fs.readFile(
									`${MOUNT_PATH}/${slug}/tests/outputs/${file}`,
									{ encoding: 'utf-8' },
									(err, data) => {
										if (err) {
											reject(err);
										} else {
											resolve(data);
										}
									}
								);
							});
						})
					)
						.then((data) => {
							resolve(data as any);
						})
						.catch((err) => {
							reject(err);
						});
				}
			}
		);
	});
};
