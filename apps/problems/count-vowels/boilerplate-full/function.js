
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const str = (x) => x(input.shift());
  const result = countVowels(str);
  console.log(JSON.stringify(result));
      