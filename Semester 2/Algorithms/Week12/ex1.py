import sys

sys.setrecursionlimit(100000)

class Graph:
    def __init__(self, size):
        self.size = size
        self.globalTime = 0
        self.edges = []
        for i in range(size):
            self.edges.append([])
        self.visitTime = [float("Inf")] * size
        self.fastest = [float("Inf")] * size
        self.previous = [None] * size
        self.isAP = [False] * size
        self.color = ['white'] * size

    def insertEdge(self, u, v):
        self.edges[u].append(v)
        self.edges[v].append(u)

    def checkVertex(self, vertex):
        self.color[vertex] = 'gray'
        self.globalTime += 1
        self.visitTime[vertex] = self.globalTime
        self.fastest[vertex] = self.globalTime
        children = 0
        for adj in self.edges[vertex]:
            if self.color[adj] == 'white':
                children += 1
                self.previous[adj] = vertex
                self.checkVertex(adj)
                self.fastest[vertex] = min(self.fastest[vertex], self.fastest[adj])
                if self.previous[vertex] == None and children > 1:
                    self.isAP[vertex] = True
                if self.previous[vertex] != None and self.fastest[adj] >= self.visitTime[vertex]:
                    self.isAP[vertex] = True
            elif adj != self.previous[vertex]:
                self.fastest[vertex] = min(self.fastest[vertex], self.visitTime[adj])
            self.color[adj] = 'black'


    def findArticulationPoints(self):
        for i in range(self.size):
            if self.color[i] == 'white':
                self.checkVertex(i)

        counter = 0
        for i in range(self.size):
            if self.isAP[i] == True:
                counter+=1
        print(counter)

        for i in range(self.size):
            if self.isAP[i] == True:
                print(i)

def articulation_points(G):
    G.findArticulationPoints()

n,m = [int(x) for x in input().split()]

g = Graph(n)
for i in range(m):
    a,b = [int(x) for x in input().split()]
    g.insertEdge(a,b)

articulation_points(g)
