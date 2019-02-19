import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class MergeSort {

  private MergeSort() {
    //Cannot be instantiated
  }

  ///////////// Sequential ///////////////

  public static <T extends Comparable <? super T>>
  void sequentialSort(T[] array) {

    T[] helper = array.clone();
    mergeSort(array, helper, 0, array.length - 1);
  }

  private static <T extends Comparable <? super T>>
  void mergeSort(T[] global, T[] local, int fIndex, int lIndex) {

    if(fIndex < lIndex) {

      int mIndex = (fIndex + lIndex) >> 1;

      //Note that at each recursion level, global and local are swapped

      //When call returns, left sub-part of local is sorted
      mergeSort(local, global, fIndex, mIndex);
      //When call returns, right sub-part of local is sorted
      mergeSort(local, global, mIndex + 1, lIndex);
      //When call returns, global is sorted
      merge(local, global, fIndex, mIndex + 1, lIndex);
    }
  }

  private static <T extends Comparable <? super T>>
  void merge(T[] unsorted, T[] sorted, int startLeft,
    int startRight, int endRight) {

      int arrayIndex = startLeft;
      int lIndex = startLeft;
      int rIndex = startRight;

      while(lIndex < startRight && rIndex <= endRight) {
        sorted[arrayIndex++] =
          unsorted[lIndex].compareTo(unsorted[rIndex]) <= 0 ?
          unsorted[lIndex++] : unsorted[rIndex++];
      }

      if(lIndex == startRight) {
        while(rIndex <= endRight) {
          sorted[arrayIndex++] = unsorted[rIndex++];
        }
      } else {
        while(lIndex < startRight) {
          sorted[arrayIndex++] = unsorted[lIndex++];
        }
      }
  }

  ///////////// Parallel ///////////////

  private static final int SPAWN_THRESHOLD = 1 << 13; // 8192

  public static <T extends Comparable <? super T>>
  void parallelMergeSort(T[] array) {

    parallelMergeSort(array, null);
  }

  /* nThreads is used to count the number of threads spawned by the algorithm.
   * Call method above if inspecting this count is not needed.
   */
  public static <T extends Comparable <? super T>>
  void parallelMergeSort(T[] array, AtomicInteger nThreads) {

    T[] helper = array.clone();
    mergeSortInParallel(array, helper, 0, array.length - 1, nThreads);
  }

  private static <T extends Comparable <? super T>>
  void mergeSortInParallel(T[] global, T[] local, int fIndex,
    int lIndex, AtomicInteger nThreads) {

      if(fIndex < lIndex) {

        int mIndex = (fIndex + lIndex) >> 1;

        if(lIndex - fIndex + 1 < SPAWN_THRESHOLD) {
          mergeSort(global, local, fIndex, lIndex);
        } else {
          Thread thread = new Thread() {
            //TODO 1: Implement (override) the run method.
            //Hint: The left sub-part of local should be sorted.
            @Override
            public void run() {
              mergeSortInParallel(local, global, fIndex, mIndex, nThreads);
            }
          };

          //TODO 2: Start the thread for sorting a half.
          thread.start();

          if(nThreads != null) {
            nThreads.incrementAndGet();
          }

          mergeSortInParallel(local, global, mIndex + 1, lIndex, nThreads);

          try {
            //TODO 3: Use the join method to ensure that results
            //are ready before merging.
            thread.join();
          } catch(InterruptedException ie) {
            ie.printStackTrace();
          }

          merge(local, global, fIndex, mIndex + 1, lIndex);
        }
      }
  }
}