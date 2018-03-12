import random

def gen_random_A(length, majNum):
    Array = []
    for j in range(0, length):
        Array.append(random.randint(0, majNum))
    return Array

def partition_even_odd(Array):
    """
    >>> partition_even_odd([3,6,4,2,3])
    [6, 4, 2, 3, 3]
    >>> partition_even_odd([7, 3, 2, 10, 5, 3, 3, 5, 8])
    [2, 10, 8, 7, 3, 5, 3, 3, 5]
    >>> partition_even_odd([1, 2, 3, 4, 5, 6])
    [2, 4, 6, 1, 3, 5]
    >>> partition_even_odd([])
    []
    >>> partition_even_odd([3])
    [3]
    >>> partition_even_odd([2])
    [2]
    >>> partition_even_odd([2,3])
    [2, 3]
    >>> partition_even_odd([3,2])
    [2, 3]
    """
    i = 0
    while Array[i] % 2 == 0:
        i += 1
    j = i + 1
    while j < len(Array):
        if Array[j] % 2 == 0:
            Array[i], Array[j] = Array[j], Array[i]
            i += 1
        j += 1
    return Array



if __name__ == '__main__':
    import doctest
    doctest.testmod()
    partition_even_odd(gen_random_A(int(10e5), int(10e9)))
