
  import java.util.*;
  
  class Main {
      public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		int n = scanner.nextInt();
scanner.nextLine(); // consume newline
		Main m = new Main(); 
		Solution solution = m.new Solution();
		int result = solution.factorial(n);
		System.out.println(result);
		scanner.close();
      }

	  ##USER_CODE_HERE##
  }
      