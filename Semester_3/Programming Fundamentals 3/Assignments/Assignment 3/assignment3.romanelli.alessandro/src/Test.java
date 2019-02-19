import java.util.Arrays;
import java.util.Random;
import java.util.function.Consumer;
import java.util.concurrent.atomic.AtomicInteger;

public class Test {

  private static final Random random = new Random();
  private static final int SIZE = 10000000;
  private static final int RUNS = 3;
  /* Set to true to inspect the number of threads spawned
   during MergeSort.parallelMergeSort() */
  private static final boolean DEBUG = true;

  /* Returns true if sortedArray is a sorted version of array */
  private static <T extends Comparable <? super T>>
  boolean isSorted(T[] array, T[] sortedArray) {

    T[] toSort = array.clone();
    Arrays.parallelSort(toSort);
    return Arrays.equals(toSort, sortedArray);
  }

  private static void testSortingAlgorithm(Consumer < Integer[] > algorithm,
    Integer[] array, String name) {

      Integer[] referenceUnsorted = array.clone();
      Integer[] toSort = array.clone();
      //Getting a time-stamp when the sorting starts
      long startTime = System.currentTimeMillis();
      //Executing the sorting algorithm
      algorithm.accept(toSort);
      //Getting a time-stamp when the sorting finishes
      long endTime = System.currentTimeMillis();
      if (!isSorted(referenceUnsorted, toSort)) {
        //Informing if the algorithm failed to sort the array
        System.err.println("ERROR: " + name + " failed.");
      } else {
        //Showing the time taken by the implementation
        System.out.printf("- " + name + " time: %d ms \n", 
          (endTime - startTime));
      }
  }

  private static void parallelSortHelper(Integer[] array) {

    if(DEBUG) {
      AtomicInteger nThreads = new AtomicInteger(1);
      MergeSort.parallelMergeSort(array, nThreads);
      System.err.println("N. threads spawned by "
        + "Parallel Merge Sort:" + nThreads.get());
    } else {
      MergeSort.parallelMergeSort(array);
    }
  }

  public static void main(String[] args) {

    Integer[] unsorted = new Integer[SIZE];

    System.out.println("Sorting " + SIZE + " elements in total:\n");

    //Executing several runs
    for(int i = 0; i < RUNS; i++) {

      System.out.println("Run " + (i + 1) + "/" + RUNS + ":");

      //Filling the array with random numbers
      for(int k = 0; k < SIZE; k++) {
        unsorted[k] = random.nextInt();
      }

      //Testing different sorting algorithms

      testSortingAlgorithm(MergeSort::sequentialSort,
        unsorted, "Sequential Merge Sort");

      testSortingAlgorithm(Test::parallelSortHelper,
        unsorted, "Parallel Merge Sort");

      testSortingAlgorithm(Arrays::sort,
        unsorted, "Method Arrays.sort()");

      testSortingAlgorithm(Arrays::parallelSort,
        unsorted, "Method Arrays.parallelSort()");
    }
  }
}