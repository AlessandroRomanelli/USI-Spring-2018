import sys

line = input().split()

n = int(line[0])
m = int(line[1])


def burroDiceCup(n,m):
    if (n > m):
        n, m = m, n
    for x in range(n+1, m+2):
        print(x)

burroDiceCup(n,m)
