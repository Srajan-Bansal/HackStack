
  import java.util.*;
  
  class Main {
      public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		String str = scanner.nextLine();
		Main m = new Main(); 
		Solution solution = m.new Solution();
		int result = solution.countVowels(str);
		System.out.println(result);
		scanner.close();
      }

	  ##USER_CODE_HERE##
  }
      