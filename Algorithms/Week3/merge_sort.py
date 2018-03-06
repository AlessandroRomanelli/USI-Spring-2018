def merge_sorted(A, B):
    i = j = 0
    X = []
    while i < len(A) and j < len(B):
        if (i < len(A) and (j < len(B) or A[i] < B[j])):
            X.append(A[i])
            i += 1
        else:
            X.append(B[j])
            j +=1
    return X

def merge_sort(A):
    if len(A) == 1:
        return A
    m = len(A)//2
    left = merge_sort(A[:m])
    right = merge_sort(A[m:])
    return merge_sorted(left, right)

A = [8,5,3,1,8,0,4,3,2,8,5,1]

print(merge_sort(A))
