import fs from 'fs';
import path from 'path';
import { ProblemDefinationParser } from './ProblemDefinationGenerator';
import { FullProblemDefinitionParser } from './FullProblemDefinationGenerator';

function generatePartialBoilerplate(generatorFilePath: string) {
	const inputFilePath = path.join(
		__dirname,
		generatorFilePath,
		'Structure.md'
	);
	const boilerplatePath = path.join(
		__dirname,
		generatorFilePath,
		'boilerplate'
	);

	// Read the input file
	const input = fs.readFileSync(inputFilePath, 'utf-8');

	// Parse the input
	const parser = new ProblemDefinationParser();
	parser.parse(input);

	// Generate the boilerplate code
	const javaCode = parser.generateJavaCode();
	const jsCode = parser.generateJsCode();

	// Ensure the boilerplate directory exists
	if (!fs.existsSync(boilerplatePath)) {
		fs.mkdirSync(boilerplatePath, { recursive: true });
	}

	// Write the boilerplate code to respective files
	fs.writeFileSync(path.join(boilerplatePath, 'function.java'), javaCode);
	fs.writeFileSync(path.join(boilerplatePath, 'function.js'), jsCode);

	console.log(`Boilerplate code generated successfully!`);
}

function generateFullBoilerplate(generateFilePath: string) {
	const inputFilePath = path.join(
		__dirname,
		generateFilePath,
		'Structure.md'
	);
	const boilerplatePath = path.join(
		__dirname,
		generateFilePath,
		'boilerplate-full'
	);

	// Read the input file
	const input = fs.readFileSync(inputFilePath, 'utf-8');

	// Parse the input
	const parser = new FullProblemDefinitionParser();
	parser.parse(input);

	// Generate the boilerplate code
	const javaCode = parser.generateJavaCode();
	const jsCode = parser.generateJsCode();

	// Ensure the boilerplate directory exists
	if (!fs.existsSync(boilerplatePath)) {
		fs.mkdirSync(boilerplatePath, { recursive: true });
	}

	// Write the boilerplate code to respective files
	fs.writeFileSync(path.join(boilerplatePath, 'function.java'), javaCode);
	fs.writeFileSync(path.join(boilerplatePath, 'function.js'), jsCode);

	console.log(`Boilerplate code generated successfully!`);
}

const problemPath = './../../problems/max-element';

// Generate boilerplate code
generatePartialBoilerplate(problemPath);
generateFullBoilerplate(problemPath);
