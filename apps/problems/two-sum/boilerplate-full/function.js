
	##USER_CODE_HERE##
		
  const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
  const nums = input.shift().split(' ').map(Number);
const target = Number(input.shift());
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
      