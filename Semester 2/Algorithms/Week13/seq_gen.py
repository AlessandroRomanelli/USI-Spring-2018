import random

def random_seq(n, maximum):
    string = ""
    for i in range(n):
        string += " "+str(int(random.randint(0, maximum)))
    return string

n, maximum = [int(x) for x in input().split()]


f = open("sequence.txt", 'w')
string = random_seq(n, maximum)
f.write(string)
