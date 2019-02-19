class Object:
    def __init__(self, obj, p):
        self.object = obj
        self.priority = p

class Queue:
    def __init__(self):
        self.queue = []

    def printObjects(self):
        for obj in self.queue:
            print(obj.priority, end=' ')
        print()

def heapifyUp(A, i):
    target = i
    father = (i-1)//2

    if target != 0 and father >= 0 and A[father].priority < A[target].priority:
        A[father], A[target] = A[target], A[father]
        heapifyUp(A, father)

def heapifyDown(A, i):
    greatest = i
    left = 2*i + 1
    right = 2*i + 2

    if left < len(A) and A[left].priority > A[i].priority:
        greatest = left
    if right < len(A) and A[right].priority > A[greatest].priority:
        greatest = right
    if greatest != i:
        A[i], A[greatest] = A[greatest], A[i]
        heapifyDown(A, greatest)

def initialize():
    return Queue()



def enqueue(Q, obj, p):
    Q.queue.append(Object(obj, p))
    heapifyUp(Q.queue, len(Q.queue)-1)

def dequeue(Q):
    Q.queue[0], Q.queue[-1] = Q.queue[-1], Q.queue[0]
    maxValue = Q.queue.pop()
    heapifyDown(Q.queue, 0)
    return maxValue

myQueue = initialize()
enqueue(myQueue, None, 80)
enqueue(myQueue, None, 101)
enqueue(myQueue, None, 1)
enqueue(myQueue, None, 3)
enqueue(myQueue, None, 38)
enqueue(myQueue, None, 62)
enqueue(myQueue, None, 0)
enqueue(myQueue, None, 35)
enqueue(myQueue, None, 96)
myQueue.printObjects()
print('Dequeued element: ', dequeue(myQueue).priority)
myQueue.printObjects()
print('Dequeued element: ', dequeue(myQueue).priority)
myQueue.printObjects()
