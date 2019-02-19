def build_max_heap(A):
    A.heap_size = len(A)
    n = A//2
    for i in range(n, 1):
        max_heapify(A, i)

def heap_insert(H, key):

def heap_extract_max(H):

def max_heapify(A, i):
    l = left(i)
    r = right(i)
    if l <= A.heap_size and A[l] > A[i]:
        largest = l
    else:
        largest = i
    if r <= A.heapsize and A[r] > A[i]:
        largest = r
    if largest != i:
        A[i], A[largest] = A[largest], A[i]
        max_heapify(A, largest)

def heap_sort(A):
    build_max_heap(A)
    for i in range(len(A), 1):
        A[i], A[1] = A[1], A[i]
        A.heap_size -= 1
        max_heapify(A, 1)

A = [9,8,7,6,5,4,3,2,1]

print(heap_sort(A))
