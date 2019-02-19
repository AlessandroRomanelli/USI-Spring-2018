def upper_bound2(A, x):
    ubs = None
    for a in A:
        if a >= x:
            ubs = a
            break
    return ubs

def upper_bound(A,x):
    ubs = None
    for a in A:
        if a >= x and (ubs == None or a < ubs):
            ubs = a
    return ubs

A = [7,20,1,3,4,3,31,50,9,11]
B = list(A)
B.sort()
print(upper_bound(A,15))
print(upper_bound2(B,15))
