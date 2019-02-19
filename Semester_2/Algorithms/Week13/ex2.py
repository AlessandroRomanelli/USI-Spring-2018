class Cell:
    def __init__(self, key):
        self.x = 0
        self.y = 0
        self.key = key
        self.longest = 0

    def __str__(self):
        return "Cell: "+str(self.key)+" at position ("+str(self.y)+","+str(self.x)+") at distance: "+str(self.longest)

    def __repr__(self):
        return str(self)

    def __lt__(self, other):
        if self.key == other.key:
            return self.y < other.y
        else:
            return self.key < other.key

class Grid:
    def __init__(self, n, m):
        self.matrix = []
        self.x = m
        self.y = n
        self.longest = 1

    def addRow(self, n, row):
        self.matrix.append(row)

def findLongestInterestingPath(Grid):
    if Grid.x < 1 and Grid.y < 1:
        return 0
    cells = []

    for i in range(Grid.y):
        for j in range(Grid.x):
            cells.append(Grid.matrix[i][j])

    cells.sort()

    cells[0].longest = 1

    for j in range(1, len(cells)):
        cell = cells[j]
        adjacents = []
        if cell.x - 1 >= 0:
            adjacents.append(Grid.matrix[cell.y][cell.x-1])
        if cell.x + 1 < Grid.x:
            adjacents.append(Grid.matrix[cell.y][cell.x+1])
        if cell.y -1 >= 0:
            adjacents.append(Grid.matrix[cell.y-1][cell.x])
        if cell.y +1 < Grid.y:
            adjacents.append(Grid.matrix[cell.y+1][cell.x])
        longest = 0
        for adj in adjacents:
            if adj.key < cell.key and adj.longest > longest:
                longest = adj.longest
        cell.longest = longest + 1
        if cell.longest > Grid.longest:
            Grid.longest = cell.longest

    for cell in cells:
        print(cell)
    return Grid.longest

# with open("result.txt", "w") as file:
#     for count in range(1000):
#         with open('tests/random_grid_'+str(count)+'.txt') as f:
#             data = f.readline()
#             n,m = [int(x) for x in data.split()]
#             g = Grid(n,m)
#             for i in range(n):
#                 line = f.readline().split()
#                 row = []
#                 for j in range(m):
#                     cell = Cell(int(line[j]))
#                     cell.x = j
#                     cell.y = i
#                     row.append(cell)
#                 g.addRow(i, row)
#         file.write(str(count)+": "+str(findLongestInterestingPath(g)))
#         file.write("\n")

with open("result.txt", "w") as file:
    count = 88
    with open('tests/random_grid_'+str(count)+'.txt') as f:
        data = f.readline()
        n,m = [int(x) for x in data.split()]
        g = Grid(n,m)
        for i in range(n):
            line = f.readline().split()
            row = []
            for j in range(m):
                cell = Cell(int(line[j]))
                cell.x = j
                cell.y = i
                row.append(cell)
            g.addRow(i, row)
    file.write(str(count)+": "+str(findLongestInterestingPath(g)))
    file.write("\n")

# n,m = [int(x) for x in input().split()]
# g = Grid(n,m)
# for i in range(n):
#     line = input().split()
#     row = []
#     for j in range(m):
#         cell = Cell(int(line[j]))
#         cell.x = j
#         cell.y = i
#         row.append(cell)
#     g.addRow(i, row)
