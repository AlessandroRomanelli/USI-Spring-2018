import math
import random
import sys

def fn(n):
    counterY = 0
    counterN = 0
    for i in range(1000000):
        number = random.randint(1, n)
        if str(number)[0] in ['1','2','3']:
            counterY += 1
        else:
            counterN += 1
    # print("Yes: "+str(counterY)+", No: "+str(counterN)+", Y/N: "+str(math.ceil(counterY/(counterY+counterN)*100))+"%")
    return str(n)+":,"+str(counterY)+","+str(counterN)+"\n"
    # return str(math.ceil(counterY/(counterY+counterN)*10000)/10000)+","


def __main__():
    f = open("results2.csv", 'w')
    output = "{"
    for i in range (1, 1000):
        string = fn(i)
        output+= string
    output+= "}"
    f.write(output)

__main__()
