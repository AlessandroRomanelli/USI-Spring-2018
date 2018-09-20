# A = []
# for n in input().split():
#     A.append(int(n))

A = []
with open('sequence.txt') as f:
    data = f.read()
    for n in data.split():
        A.append(int(n))
        
def lenOfIrregEx(A):
    if len(A) < 2:
        return len(A)
    signs = []
    for i in range(1,len(A)):
        if A[i-1] > A[i]:
            if len(signs) == 0 or signs[-1] != ">":
                signs.append(">")
        elif A[i-1] < A[i]:
            if len(signs) != 0 and signs[-1] != "<":
                signs.append("<")
    return len(signs) + 1
print(lenOfIrregEx(A))
