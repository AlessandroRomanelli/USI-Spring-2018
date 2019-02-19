def msort(array):
    if len(array) <= 1:
        return array
    half = len(array)//2
    left = msort(array[:half])
    right = msort(array[half:])
    return merge(left, right)

def merge(lharray, rharray):
    merged = []
    while len(lharray) != 0:
        if (len(rharray) != 0):
            if (lharray[0] > rharray[0]):
                merged.append(rharray.pop(0))
            else:
                merged.append(lharray.pop(0))
        else:
            merged = merged + lharray
            break
    return merged + rharray

print(msort([9,8,7,6,5,4,3,2,1]))
