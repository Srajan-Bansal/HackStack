# Rules for Creating Structure.md

1. Start with the problem name in quotes:
   Problem Name: "Your Problem Name"

2. Specify the function name:
   Function Name: yourFunctionName

3. Define the input structure:
   Input Structure:
   Input Field: type name

4. Define the output structure:
   Output Structure:
   Output Field: type result

5. Supported types for Java:

    - Primitive types: int, long, float, double, boolean, char
    - Wrapper classes: Integer, Long, Float, Double, Boolean, Character
    - String
    - Arrays: int[], long[], etc.
    - Lists: List<Integer>, List<String>, etc.

6. Supported types for JavaScript:

    - number (for int, long, float, double)
    - boolean
    - string
    - arrays (for both arrays and lists)

7. For multi-dimensional arrays or nested lists, use:

    - Java: int[][], List<List<Integer>>, etc.
    - JavaScript: number[][], etc.

8. Each input field should be on a separate line.

9. The output field should typically match the return type of the function.

10. For void functions, use 'void' as the output type.

Example Structure.md files:

Example 1: Max Element
Problem Name: "Max Element"
Function Name: maxElement
Input Structure:
Input Field: int size
Input Field: List<Integer> arr
Output Structure:
Output Field: int result

Example 2: Two Sum
Problem Name: "Two Sum"
Function Name: twoSum
Input Structure:
Input Field: int[] nums
Input Field: int target
Output Structure:
Output Field: int[] result

Example 3: Valid Sudoku
Problem Name: "Valid Sudoku"
Function Name: isValidSudoku
Input Structure:
Input Field: char[][] board
Output Structure:
Output Field: boolean result
