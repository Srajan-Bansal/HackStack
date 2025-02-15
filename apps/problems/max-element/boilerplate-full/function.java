
  import java.util.*;
  
  class Main {
      public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		int size = scanner.nextInt();
scanner.nextLine(); // consume newline
        int[] arr = Arrays.stream(scanner.nextLine().trim().split("\\s+"))
                    .mapToInt(Integer::parseInt)
                    .toArray();
		Main m = new Main(); 
		Solution solution = m.new Solution();
		int result = solution.maxElement(size, arr);
		System.out.println(result);
		scanner.close();
      }

	  ##USER_CODE_HERE##
  }
      