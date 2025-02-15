
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const size = Number(input.shift());
const arr = input.shift().split(' ').map(Number);
  const result = maxElement(size, arr);
  console.log(JSON.stringify(result));
      