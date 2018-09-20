A = []
for n in input().split():
    A.append(int(n))

# A = []
# with open('sequence.txt') as f:
#     data = f.read()
#     for n in data.split():
#         A.append(int(n))

def lenOfIrregEx(A):
    if len(A) < 2:
        return len(A)

    signs = []
    for i in range(1,len(A)):
        if A[i-1] > A[i]:
            signs.append(">")
        elif A[i-1] < A[i]:
            signs.append("<")
        else:
            signs.append("=")

    best = 0
    if A[0] != A[1]:
        count = 2
    else:
        count = 1
    prev = signs[0]
    for i in range(1, len(signs)):
        if signs[i] == prev or signs[i] == "=":
            if count > best:
                best = count
            if A[i] != A[i+1]:
                count = 2
            else:
                count = 1
        elif signs[i] != prev:
            count += 1
        prev = signs[i]
    if count > best:
        best = count
    return best

print(lenOfIrregEx(A))
