import random
import string

def random_string(maximum):
    temp = ""
    for _ in range(maximum):
        temp += random.choice(string.ascii_lowercase)
    return temp

maximum = int(input())


f = open("word.txt", 'w')
x = random_string(maximum)
f.write(x)
