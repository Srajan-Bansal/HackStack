
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const s = (x) => x(input.shift());
  const result = isValid(s);
  console.log(JSON.stringify(result));
      