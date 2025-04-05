# Two Sum

## Problem Statement

Write a function `twoSum` to find two numbers in an array that add up to a given target.

## Definition

Given an array of integers and a target sum, find two distinct indices such that the numbers at those indices add up to the target.

## Examples

### Example 1:

**Input:** `nums = [2, 7, 11, 15], target = 9`  
**Output:** `[0, 1]`  
**Explanation:** `nums[0] + nums[1] = 2 + 7 = 9`

### Example 2:

**Input:** `nums = [3, 2, 4], target = 6`  
**Output:** `[1, 2]`  
**Explanation:** `nums[1] + nums[2] = 2 + 4 = 6`

### Example 3:

**Input:** `nums = [3, 3], target = 6`  
**Output:** `[0, 1]`  
**Explanation:** `nums[0] + nums[1] = 3 + 3 = 6`

## Constraints

- Each input has exactly one solution.
- The same element cannot be used twice.
- The array length is between `2` and `10^5`.
- The elements of the array are integers between `-10^9` and `10^9`.
