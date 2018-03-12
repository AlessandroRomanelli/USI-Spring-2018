def read_array():
    A = []
    try:
        while True:
            for n in input().split():
                A.append(int(n))
    except EOFError:
        pass
    return A

def find_max(A):
    """Finds the maximum value within an array:
    >>> find_max([0, 1, 2, 3, 4])
    4
    >>> find_max([0])
    0
    """
    maximum = A[0]
    for i in A:
        if i > maximum:
            maximum = i
    return maximum

def ver_histogram(A):
    import math
    print()
    maximum = find_max(A)
    for j in range(0, maximum):
        for i in range(0, len(A)):
            if (maximum - A[i] > j):
                print(' ', end='')
            else:
                if (A[i] < math.floor(maximum*1/2)):
                    print('\033[0;32;40m┃', end='')
                if ((A[i] >= math.floor(maximum*1/2)) and (A[i] < math.floor(maximum*(1/2 + 1/4)))):
                    print('\033[0;33;40m┃', end='')
                if ((A[i] >= math.floor(maximum*(1/2 + 1/4))) and (A[i] < math.floor(maximum*(1/2 + 1/4 + 1/8)))):
                    print('\033[0;31;40m┃', end='')
                if ((A[i] >= math.floor(maximum*(1/2 + 1/4 + 1/8))) and (A[i] < math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16)))):
                    print('\033[0;35;40m┃', end='')
                if ((A[i] >= math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16))) and (A[i] < math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16 + 1/32)))):
                    print('\033[0;34;40m┃', end='')
                if ((A[i] >= math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16 + 1/32))) and (A[i] < math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16 + 1/32 + 1/64)))):
                    print('\033[0;36;40m┃', end='')
                if ((A[i] >= math.floor(maximum*(1/2 + 1/4 + 1/8 + 1/16 + 1/32 + 1/64))) and (A[i] < math.floor(maximum))):
                    print('\033[0;37;40m┃', end='')

        print()

def gen_random_A(length, majNum):
    Array = []
    for j in range(0, length):
        Array.append(random.randint(0, majNum))
    return Array

def selection_sort(Array):
    # """Return the ordered array using the selection sort algorithm
    #
    # >>> selection_sort([9,8,7,6,5,4,3,2,1,0])
    # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    # >>> selection_sort([0,0,2,2,1])
    # [0, 0, 1, 2, 2]
    # >>> selection_sort([])
    # []
    # >>> selection_sort([0])
    # [0]
    # >>> selection_sort([1,1,1,1,1])
    # [1, 1, 1, 1, 1]
    # """
    import time
    for j in range(0, len(Array)):
        index = j
        for i in range(j, len(Array)):
            if Array[i] < Array[index]:
                index = i
        ver_histogram(Array)
        time.sleep(0.2)
        Array[index], Array[j] = Array[j], Array[index]
    return Array

def insertion_sort(Array):
    import time
    for j in range(1, len(Array)):
        key = Array[j]
        i = j - 1
        while i >= 0 and Array[i] >= key:
            Array[i+1] = Array[i]
            i = i-1
        Array[i+1] = key
        ver_histogram(Array)
        time.sleep(0.2)
    return Array

if __name__ == '__main__':
    import doctest
    import random
    import time
    doctest.testmod()
    insertion_sort(gen_random_A(200,63))
    # time.sleep(1)
    # selection_sort(gen_random_A(203, 63))
