
  import java.util.*;
  
  class Main {
      public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();
		Main m = new Main(); 
		Solution solution = m.new Solution();
		boolean result = solution.isAnagram(s1, s2);
		System.out.println(result);
		scanner.close();
      }

	  ##USER_CODE_HERE##
  }
      