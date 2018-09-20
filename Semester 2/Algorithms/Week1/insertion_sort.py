import random
import sys

n = int(sys.argv[1])

def gen_random_A(length, majNum):
    Array = []
    for j in range(0, length):
        Array.append(random.randint(0, majNum))
    return Array

def insertion_sort(Array):
    for j in range(1, len(Array)):
        key = Array[j]
        i = j - 1
        while i >= 0 and Array[i] >= key:
            Array[i+1] = Array[i]
            i = i-1
        Array[i+1] = key
    return Array

print(insertion_sort(gen_random_A(n, n)))
