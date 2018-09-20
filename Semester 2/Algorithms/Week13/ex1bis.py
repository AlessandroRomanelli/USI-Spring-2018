def longestIrregEx(A):
    if len(A) < 2:
        return len(A)

    if A[0] > A[1]:
        print("1+",end="")
        return 1 + longestIrregExRecur(A[1:], 1)
    else:
        return longestIrregEx(A[1:])

def longestIrregExRecur(A, flag):
    print(A)
    if len(A) < 2:
        print("1")
        return 1
    else:
        if flag == 1:
            if A[0] < A[1]:
                print("1+",end="")
                return 1 + longestIrregExRecur(A[1:], -1)
            elif A[0] == A[1]:
                return longestIrregExRecur(A[1:], 0)
            else:
                return longestIrregExRecur(A[1:], 1)
        elif flag == 0:
            if A[0] > A[1]:
                return longestIrregExRecur(A[1:], 1)
            elif A[0] == A[1]:
                return longestIrregExRecur(A[1:], 0)
            else:
                return longestIrregExRecur(A[1:], -1)
        elif flag == -1:
            if A[0] > A[1]:
                print("1+",end="")
                return 1 + longestIrregExRecur(A[1:], 1)
            elif A[0] == A[1]:
                return longestIrregExRecur(A[1:], 0)
            else:
                return longestIrregExRecur(A[1:], -1)

A = []
for n in input().split():
    A.append(int(n))

print(longestIrregEx(A))
