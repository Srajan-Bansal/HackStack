
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const input = (x) => x(input.shift());
  const result = reverseString(input);
  console.log(JSON.stringify(result));
      