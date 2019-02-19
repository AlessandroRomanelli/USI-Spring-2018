import random

def random_grid(n,m,i):
    f = open("tests/random_grid_"+str(i)+".txt", 'w')
    f.write(str(n)+" "+str(m)+"\n")
    for _ in range(n):
        string = ""
        for _ in range(m):
            number = random.randint(0, 50)
            string += str(number)+" "
        string+="\n"
        f.write(string)
    f.close()

# n,m = [int(x) for x in input().split()]

for i in range(1000):
    random_grid(random.randint(1, 20),random.randint(1, 20),i)
