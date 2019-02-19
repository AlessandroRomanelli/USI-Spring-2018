import random

def gen_random_A(length, majNum):
    a = []
    for j in range(0, length):
        a.append(random.randint(0, majNum))
    return a

def partition_even_odd(a):
    i = 0
    j = len(a)-1
    while i <= j:
        if a[i] % 2 == 1 and a[j] % 2 == 0:
            a[j], a[i] = a[i], a[j]
            i += 1
            j -= 1
        while a[i] % 2 == 0 and a[j] % 2 == 0:
            i += 1
            if i >= j:
                return
        while a[i] % 2 == 1 and a[j] % 2 == 1:
            j -= 1
            if i >= j:
                return
        while a[i] % 2 == 0 and a[j] % 2 == 1:
            i += 1
            j -= 1
            if i >= j:
                return
    return



if __name__ == '__main__':
    A = gen_random_A(int(10e5), int(10e9))
    partition_even_odd(A)
