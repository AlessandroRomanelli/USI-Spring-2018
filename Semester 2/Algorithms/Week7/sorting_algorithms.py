def generateRandomArray(n):
    import random
    A = []
    for i in range(n):
        A.append(random.randint(0, n))
    return A

A = generateRandomArray(20)
print('Original array:      ',A)

def selection_sort(A):
    B = list(A)
    for i in range(len(B)):
        minimum = i
        for j in range(i, len(B)):
            if B[j] < B[minimum]:
                minimum = j
        if minimum != i:
            B[i], B[minimum] = B[minimum], B[i]
    return B

print('Selection Sort:      ', selection_sort(A), ' O(n^2)')

def insertion_sort(A):
    B = list(A)
    for i in range(1, len(A)):
        j = i - 1
        while j >= 0:
            if B[j] > B[j+1]:
                B[j], B[j+1] = B[j+1], B[j]
            j -= 1
    return B

print('Insertion Sort:      ', insertion_sort(A), ' O(n^2)')

def merge(L,R):
    A = []
    i = 0
    j = 0
    while i < len(L) and j < len(R):
        if R[j] > L[i]:
            A.append(L[i])
            i += 1
        elif L[i] > R[j]:
            A.append(R[j])
            j += 1
        else:
            A.append(L[i])
            A.append(R[j])
            i += 1
            j += 1
    while i < len(L):
        A.append(L[i])
        i += 1

    while j < len(R):
        A.append(R[j])
        j += 1
    return A

def merge_sort(A):
    B = list(A)
    if len(A) < 2:
        return A
    mid = len(B)//2
    left = merge_sort(B[mid:])
    right = merge_sort(B[:mid])
    return merge(left, right)

print('Merge Sort:          ', merge_sort(A), ' O(n log n)')

def heapify(A, x, n):
    largest = x
    left = 2*x + 1
    right = 2*x + 2

    if left < n and A[x] < A[left]:
        largest = left

    if right < n and A[largest] < A[right]:
        largest = right

    if largest != x:
        A[x], A[largest] = A[largest], A[x]
        heapify(A, largest, n)

def build_max_heap(A):
    n = len(A)
    for i in range(n, -1, -1):
        heapify(A, i, n)

def heap_sort(A):
    B = list(A)
    n = len(B)
    build_max_heap(B)
    for i in range(n-1, 0, -1):
        B[i], B[0] = B[0], B[i]
        heapify(B, 0, i)
    return B

print('Heap Sort:           ', heap_sort(A), ' O(n log n)')
