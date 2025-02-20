
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const str = (x) => x(input.shift());
  const result = reverseString(str);
  console.log(JSON.stringify(result));
      