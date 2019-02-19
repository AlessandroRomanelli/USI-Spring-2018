##Computer Networking &mdash; Assignment 3

###by Alessandro Romanelli

### Goal
The goal of this exercise is to implement a distance vector routing protocol in order for each router of a network to have a forwarding table in order for a router to forward a message to its destination following the shortest possible path.

### Implementation

For this assignment I was told to use the **SimpleNet** Java Library which implements the behaviour of a simple Network. Thus, I expended this library with a new subclass of a **Router** called **DVRouter**, which has a distance vector to maintain and broadcast. I also expanded the library with a subclass of **RoutingMessage** named **DVRoutingMessage** which extends the parent class with an additional field for a distance vector.

### Protocol
1. Each router upon initialisation inserts an entry in its distance vector corresponding to the distance form itself, which is 0.0.
2. The distance vector is then broadcasted to all the adjacent routers.
3. Each router upon receiving a message from its neighbour, the distance vector of the neighbour contained within  the message should be taken and merged into the distance vector of the current router.
4. For each entry of the received vector, I'll update the field of my vector if the value I received summed with the distance to the neighbour is less than my previously known vector.
5. The router will broadcast the updated vector to all its neighbours.
6. Repetition of the process from Step 3 until the distance vectors of all routers finally converges to the shortest paths.


### Attachments
```
.
├── DVRouter.java				// Java class file
├── MyRoutingMessage.java		// Java class file
├── doc							// Folder containing the documentation
│   └── index.html				// Index HTML file of the documentation
└── readme.md					// This file

```

### Instructions
To compile the code: `javac -classpath ./simplenet.jar:. DVRouter.java`

To run the code: `java -classpath ./simplenet.jar:. simplenet.Network DVRouter test1`

From the root of the folder

### Collaboration
I included one of the test files I used in collaboration with **Cristian Buratti** when testing my implementation to check for same results.

#Merry Christmas!