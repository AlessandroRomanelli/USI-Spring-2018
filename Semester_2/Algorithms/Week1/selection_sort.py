import random
import sys

n = int(sys.argv[1])

def gen_random_A(length, majNum):
    Array = []
    for j in range(0, length):
        Array.append(random.randint(0, majNum))
    return Array

def selection_sort(Array):
    """Return the ordered array using the selection sort algorithm

    >>> selection_sort([9,8,7,6,5,4,3,2,1,0])
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    >>> selection_sort([0,0,2,2,1])
    [0, 0, 1, 2, 2]
    >>> selection_sort([])
    []
    >>> selection_sort([0])
    [0]
    >>> selection_sort([1,1,1,1,1])
    [1, 1, 1, 1, 1]
    """
    for j in range(0, len(Array)):
        index = j
        for i in range(j, len(Array)):
            if Array[i] < Array[index]:
                index = i
        Array[index], Array[j] = Array[j], Array[index]
    return Array

if __name__ == '__main__':
    import doctest
    doctest.testmod()
    print(selection_sort(gen_random_A(n, n)))
