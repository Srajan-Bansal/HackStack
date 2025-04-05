
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const s1 = (x) => x(input.shift());
const s2 = (x) => x(input.shift());
  const result = isAnagram(s1, s2);
  console.log(JSON.stringify(result));
      