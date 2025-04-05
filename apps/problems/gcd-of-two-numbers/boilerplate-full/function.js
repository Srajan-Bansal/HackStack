
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const a = Number(input.shift());
const b = Number(input.shift());
  const result = gcd(a, b);
  console.log(JSON.stringify(result));
      