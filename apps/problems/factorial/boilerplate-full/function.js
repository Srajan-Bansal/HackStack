
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const n = Number(input.shift());
  const result = factorial(n);
  console.log(JSON.stringify(result));
      