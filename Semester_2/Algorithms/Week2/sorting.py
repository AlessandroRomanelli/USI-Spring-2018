def read_array():
    A = []
    try:
        while True:
            for n in input().split():
                A.append(int(n))
    except EOFError:
        pass
    return A
print(read_array())
