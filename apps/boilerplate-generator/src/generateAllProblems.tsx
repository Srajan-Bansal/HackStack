import fs from 'fs';
import path from 'path';
import { ProblemDefinationParser } from './ProblemDefinationGenerator';
import { FullProblemDefinitionParser } from './FullProblemDefinationGenerator';

const problemsDir = path.resolve(__dirname, '../../../hackstack-problems');

function generateBoilerplateForAllProblems() {
	// Get all problem directories
	const problemFolders = fs
		.readdirSync(problemsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => path.join(problemsDir, dirent.name));

	problemFolders.forEach((problemPath) => {
		console.log(`Generating boilerplate for: ${problemPath}`);
		generatePartialBoilerplate(problemPath);
		generateFullBoilerplate(problemPath);
	});
}

function generatePartialBoilerplate(generatorFilePath: string) {
	const inputFilePath = path.join(generatorFilePath, 'Structure.md');
	const boilerplatePath = path.join(generatorFilePath, 'boilerplate');

	if (!fs.existsSync(inputFilePath)) {
		console.warn(`Skipping ${generatorFilePath}, Structure.md not found.`);
		return;
	}

	const input = fs.readFileSync(inputFilePath, 'utf-8');

	const parser = new ProblemDefinationParser();
	parser.parse(input);

	const javaCode = parser.generateJavaCode();
	const jsCode = parser.generateJsCode();

	if (!fs.existsSync(boilerplatePath)) {
		fs.mkdirSync(boilerplatePath, { recursive: true });
	}

	fs.writeFileSync(path.join(boilerplatePath, 'function.java'), javaCode);
	fs.writeFileSync(path.join(boilerplatePath, 'function.js'), jsCode);

	console.log(`Partial boilerplate generated for: ${generatorFilePath}`);
}

function generateFullBoilerplate(generateFilePath: string) {
	const inputFilePath = path.join(generateFilePath, 'Structure.md');
	const boilerplatePath = path.join(generateFilePath, 'boilerplate-full');

	if (!fs.existsSync(inputFilePath)) {
		console.warn(`Skipping ${generateFilePath}, Structure.md not found.`);
		return;
	}

	const input = fs.readFileSync(inputFilePath, 'utf-8');

	const parser = new FullProblemDefinitionParser();
	parser.parse(input);

	const javaCode = parser.generateJavaCode();
	const jsCode = parser.generateJsCode();

	if (!fs.existsSync(boilerplatePath)) {
		fs.mkdirSync(boilerplatePath, { recursive: true });
	}

	fs.writeFileSync(path.join(boilerplatePath, 'function.java'), javaCode);
	fs.writeFileSync(path.join(boilerplatePath, 'function.js'), jsCode);

	console.log(`Full boilerplate generated for: ${generateFilePath}`);
}

// Generate boilerplate code for all problems
generateBoilerplateForAllProblems();
