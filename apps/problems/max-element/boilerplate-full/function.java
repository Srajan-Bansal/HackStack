
  import java.util.*;
  import java.util.stream.*;
  
  class Solution {
      public int maxElement(int size, int[] arr) {
          // Write your code here
          return null; // Replace with actual result
      }
  
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          int size = Integer(scanner.nextLine());
        int[] arr = Arrays.stream(scanner.nextLine().split(",")).mapToint(Integer::valueOf).toArray();
          Solution solution = new Solution();
          int result = solution.maxElement(size, arr);
          System.out.println(result);
          scanner.close();
      }
  }
      