def find_max_distance(A):
    maximum = minimum = A[0]
    for n in A:
        if n > maximum:
            maximum = n
        elif n < minimum:
            minimum = n
    return maximum - minimum
