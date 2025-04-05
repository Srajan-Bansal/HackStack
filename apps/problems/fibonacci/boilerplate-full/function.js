
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const n = Number(input.shift());
  const result = fibonacci(n);
  console.log(JSON.stringify(result));
      