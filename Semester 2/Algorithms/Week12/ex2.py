import queue

class Cell:
    def __init__(self, color, isExit=False, isStart=False):
        self.x = 0
        self.y = 0
        self.isExit = isExit
        self.isStart = isStart
        self.distance = float("Inf")
        self.color = color

    def __str__(self):
        s = ""
        if self.isExit:
            s = ", Exit"
        if self.isStart:
            s = ", Start"
        return "(Cell: "+self.color+s+" at "+str(self.x)+","+str(self.y)+")"

    def __repr__(self):
        return str(self)

class Grid:
    def __init__(self, n, m):
        self.matrix = []
        self.x = m
        self.y = n
        self.start = None

    def addRow(self, n, row):
        self.matrix.append(row)

    def BFS(self, start):
        q = queue.Queue()
        start.distance = 0
        q.put(start)
        while not q.empty():
            cell = q.get()
            adjacents = []
            if cell.x-1 >= 0:
                adjacents.append(self.matrix[cell.y][cell.x-1])
            if cell.x+1 < self.x:
                adjacents.append(self.matrix[cell.y][cell.x+1])
            if cell.y+1 < self.y:
                adjacents.append(self.matrix[cell.y+1][cell.x])
            if cell.y-1 >= 0:
                adjacents.append(self.matrix[cell.y-1][cell.x])
            for adj in adjacents:
                if adj.color == 'white':
                    adj.color = 'gray'
                    adj.distance = cell.distance + 1
                    if adj.isExit:
                        print(adj.distance)
                        return
                    q.put(adj)
            cell.color = 'black'
        print('no')



n,m = [int(x) for x in input().split()]
g = Grid(n,m)
for i in range(n):
    string = str.lower(input())
    row = []
    for j in range(m):
        if string[j] == "o":
            cell = Cell('white')
        elif string[j] == "x":
            cell = Cell('black')
        elif string[j] == "s":
            cell = Cell('gray', False, True)
            g.start = cell
        else:
            cell = Cell('white', True, False)
        cell.y = i
        cell.x = j
        row.append(cell)
    g.addRow(i, row)

g.BFS(g.start)
