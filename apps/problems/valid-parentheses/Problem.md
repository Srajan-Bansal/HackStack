# Valid Parentheses

## Problem Statement

Write a function `isValid` to determine if a given string containing only parentheses is valid.

## Definition

A string is considered valid if:
- Every opening bracket has a corresponding closing bracket.
- Brackets are closed in the correct order.

The allowed brackets are:  
- `()`  
- `{}`  
- `[]`  

## Examples

### Example 1:

**Input:** `"()"`  
**Output:** `true`

### Example 2:

**Input:** `"()[]{}"`  
**Output:** `true`

### Example 3:

**Input:** `"(]"`  
**Output:** `false`

### Example 4:

**Input:** `"{[()]}"`  
**Output:** `true`

### Example 5:

**Input:** `"{[(])}"`  
**Output:** `false`

## Constraints

- The input string contains only the characters `()[]{}`.
- The string length is between `1` and `10^4`.
