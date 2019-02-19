def BetterAlgo(A):
    maxIndex = findMaxIndex(A)
    i = maxIndex
    while i > 0 and A[i] > A[i-1]:
        i -= 1
    return A[maxIndex] - A[i]

def ImpossibleAlgo(A):
    x = i = 0
    j = 1
    while j < len(A):
        if A[j] > A[j-1]:
            if A[j] - A[i] > x:
                x = A[j] - A[i]
        else:
            i = j
        j += 1
    return x

def findMaxIndex(A):
    maxIndex = 0
    for i in range(len(A)):
        if A[i] > A[maxIndex]:
            maxIndex = i
    return maxIndex



def AlgoX(A):
    x = 0
    for i in range(1, len(A)-1):
        for j in range(i+1, len(A)):
            if AlgoY(A,i,j) and A[j] - A[i] > x:
                x = A[j] - A[i]
    return x

def AlgoY(A, i, j):
    for k in range(i, j-1):
        if A[k] > A[k+1]:
            return False
    return True

A = [9,8,7,6,5,4,3,2,1]
B = [0,80,1,5,6,90,2,4]

print(AlgoX(B))

print(BetterAlgo(B))

print(ImpossibleAlgo(B))
