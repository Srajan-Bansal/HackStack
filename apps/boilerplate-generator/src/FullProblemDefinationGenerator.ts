export class FullProblemDefinitionParser {
	problemName = '';
	functionName = '';
	inputFields: { type: string; name: string }[] = [];
	outputFields: { type: string; name: string }[] = [];

	parse(input: string): void {
		const lines = input.split('\n').map((line) => line.trim());
		let currentSection: string | null = null;

		lines.forEach((line) => {
			if (line.startsWith('Problem Name:')) {
				this.problemName = this.extractQuotedValue(line);
			} else if (line.startsWith('Function Name:')) {
				this.functionName = this.extractValue(line);
			} else if (line.startsWith('Input Structure:')) {
				currentSection = 'input';
			} else if (line.startsWith('Output Structure:')) {
				currentSection = 'output';
			} else if (line.startsWith('Input Field:')) {
				if (currentSection === 'input') {
					const field = this.extractField(line);
					if (field) this.inputFields.push(field);
				}
			} else if (line.startsWith('Output Field:')) {
				if (currentSection === 'output') {
					const field = this.extractField(line);
					if (field) this.outputFields.push(field);
				}
			}
		});
	}

	extractQuotedValue(line: string): string {
		const match = line.match(/: "(.*)"$/);
		return match?.[1] ?? '';
	}

	extractValue(line: string): string {
		const match = line.match(/: (\w+)$/);
		return match?.[1] ?? '';
	}

	extractField(line: string): { type: string; name: string } | null {
		const match = line.match(/Field: (\w+(?:<[\w,\s]+>)?(?:\[\])?) (\w+)$/);
		return match && match[1] && match[2]
			? { type: match[1], name: match[2] }
			: null;
	}

	generateJsCode(): string {
		const inputs = this.inputFields.map((field) => field.name).join(', ');
		const jsDocParams = this.inputFields
			.map(
				(field) =>
					` * @param {${this.getJsType(field.type)}} ${field.name}`
			)
			.join('\n');
		const jsDocReturn = ` * @return {${this.getJsType(this.outputFields[0]?.type || 'any')}}`;
		const inputReads = this.inputFields
			.map((field) => {
				if (field.type.endsWith('[]')) {
					return `const ${field.name} = input.shift().split(',').map(${this.getJsParseFunction(field.type)});`;
				} else {
					return `const ${field.name} = ${this.getJsParseFunction(field.type)}(input.shift());`;
				}
			})
			.join('\n');

		return `
  /**
  ${jsDocParams}
  ${jsDocReturn}
   */
  var ${this.functionName} = function(${inputs}) {
      // Write your code here
  };
  
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\\n');
  ${inputReads}
  const result = ${this.functionName}(${inputs});
  console.log(JSON.stringify(result));
      `;
	}

	generateJavaCode(): string {
		const inputs = this.inputFields
			.map((field) => `${this.getJavaType(field.type)} ${field.name}`)
			.join(', ');
		const inputReads = this.inputFields
			.map((field) => {
				if (field.type.endsWith('[]')) {
					const elementType = field.type.replace('[]', '');
					return `${field.type} ${field.name} = Arrays.stream(scanner.nextLine().split(",")).mapTo${elementType}(${this.getJavaParseFunction(elementType)}::valueOf).toArray();`;
				} else {
					return `${this.getJavaType(field.type)} ${field.name} = ${this.getJavaParseFunction(field.type)}(scanner.nextLine());`;
				}
			})
			.join('\n        ');
		const outputType = this.getJavaType(
			this.outputFields[0]?.type || 'void'
		);
		const functionCall = `${outputType} result = solution.${this.functionName}(${this.inputFields.map((field) => field.name).join(', ')});`;
		const outputWrite = this.getJavaOutputWrite(outputType);

		return `
  import java.util.*;
  import java.util.stream.*;
  
  class Solution {
      public ${outputType} ${this.functionName}(${inputs}) {
          // Write your code here
          ${outputType === 'void' ? '' : 'return null;'} // Replace with actual result
      }
  
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          ${inputReads}
          Solution solution = new Solution();
          ${functionCall}
          ${outputWrite}
          scanner.close();
      }
  }
      `;
	}

	private getJsType(type: string): string {
		if (type.endsWith('[]')) {
			return 'Array';
		}
		switch (type) {
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'string':
				return 'string';
			default:
				return 'any';
		}
	}

	private getJsParseFunction(type: string): string {
		if (type.endsWith('[]')) {
			const elementType = type.replace('[]', '');
			return this.getJsParseFunction(elementType);
		}
		switch (type) {
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				return 'Number';
			case 'boolean':
				return '(x) => x === "true"';
			default:
				return '(x) => x';
		}
	}

	private getJavaType(type: string): string {
		switch (type) {
			case 'int':
			case 'long':
			case 'float':
			case 'double':
			case 'boolean':
			case 'char':
				return type;
			case 'string':
				return 'String';
			default:
				return type;
		}
	}

	private getJavaParseFunction(type: string): string {
		switch (type) {
			case 'int':
			case 'Integer':
				return 'Integer';
			case 'long':
			case 'Long':
				return 'Long';
			case 'float':
			case 'Float':
				return 'Float';
			case 'double':
			case 'Double':
				return 'Double';
			case 'boolean':
			case 'Boolean':
				return 'Boolean';
			case 'char':
			case 'Character':
				return 'str -> str.charAt(0)';
			default:
				return '';
		}
	}

	private getJavaOutputWrite(outputType: string): string {
		if (outputType.endsWith('[]')) {
			return 'System.out.println(Arrays.toString(result));';
		} else {
			return 'System.out.println(result);';
		}
	}
}
