export class ProblemDefinationParser {
	problemName: string = '';
	functionName: string = '';
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

	generateJavaCode(): string {
		const inputs = this.inputFields
			.map((field) => `${this.getJavaType(field.type)} ${field.name}`)
			.join(', ');
		const outputType = this.getJavaType(
			this.outputFields[0]?.type || 'void'
		);

		return `
  class Solution {
      public ${outputType} ${this.functionName}(${inputs}) {
          // Write your code here
          ${outputType === 'void' ? '' : 'return null;'} // Replace with actual result
      }
  }
      `;
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

		return `
  /**
  ${jsDocParams}
  ${jsDocReturn}
   */
  function ${this.functionName}(${inputs}) {
      // Write your code here
      return null; // Replace with actual result
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
}
