
  import java.util.*;
  
  class Main {
      public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		int a = scanner.nextInt();
scanner.nextLine(); // consume newline
        int b = scanner.nextInt();
scanner.nextLine(); // consume newline
		Main m = new Main(); 
		Solution solution = m.new Solution();
		int result = solution.gcd(a, b);
		System.out.println(result);
		scanner.close();
      }

	  ##USER_CODE_HERE##
  }
      