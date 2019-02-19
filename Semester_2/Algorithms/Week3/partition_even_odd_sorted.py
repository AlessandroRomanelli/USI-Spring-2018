def gen_random_A(length, majNum):
    Array = []
    for j in range(0, length):
        Array.append(random.randint(0, majNum))
    return Array

def find_first_odd(A):
    for i in A:
        if i % 2 == 1:
            return i
    return 0

def partition_even_odd(A):
    """Return the ordered array with even numbers first
    >>> partition_even_odd([])
    []
    >>> partition_even_odd([0])
    [0]
    >>> partition_even_odd([0,0])
    [0, 0]
    >>> partition_even_odd([0,1])
    [0, 1]
    >>> partition_even_odd([1,0])
    [0, 1]
    >>> partition_even_odd([12,1])
    [12, 1]
    >>> partition_even_odd([1,3,9,4,6,1])
    [4, 6, 1, 1, 3, 9]
    >>> partition_even_odd([12,3,3,5,7,10])
    [10, 12, 3, 3, 5, 7]
    """
    if len(A) <= 1:
        return A
    s = find_first_odd(A)
    for i in range(1, len(A)):
        j = i - 1
        key = A[i]
        if A[i] % 2 == 0:
            while j >= s-1:
                A[j+1] = A[j]
                j -= 1
            while j >= 0 and j < s-1 and A[j] >= A[i]:
                A[j+1] = A[j]
                j -= 1
            A[j+1] = key
            s += 1
        else:
            if j < s:
                A[j+1] = A[j]
            while j >= s and A[j] >= A[i]:
                A[j+1] = A[j]
                j -= 1
            A[j+1] = key
    return A

# def insertion_sort(Array):
#     for j in range(1, len(Array)):
#         key = Array[j]
#         i = j - 1
#         while i >= 0 and Array[i] >= key:
#             Array[i+1] = Array[i]
#             i = i-1
#         Array[i+1] = key
#     return Array


if __name__ == '__main__':
    import doctest
    import random
    import sys
    n = int(sys.argv[1])
    doctest.testmod()
    print(partition_even_odd(gen_random_A(n, n)))
