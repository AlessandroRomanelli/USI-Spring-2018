# Alessandro Romanelli
___
## Protocol Description
1. Server boots up, creates a ServerSocket and listens for connection on the port provided in the command line. Initially, only four threads sleep, waiting for a connection.
2. Client boots up and attempts to establish a TCP connection at the address and port provided in the command line. Once the socket is opened, two Threads are created, one to handle the input and one to handle the output.
3. Server accepts the incoming connection and provides a dedicated Thread. Each Thread is connected to a Socket and handles the input of its specific connection, but can broadcast its output to multiple Sockets.
4. Client sends a command to the Server through its output channel using the format:
`VERB ARGUMENTS`
5. Server receives a message from a Client and behaves according to three different verbs:
* `TWEET` -- Outputs the message that comes after the **verb** to all the Sockets that are conntected and subscribed to any hashtag contained in the message.
* `SUBSCRIBE` -- Inserts the connection that sent the message to the subscriptions of the provided hashtag.
* `UNSUBSCRIBE` -- Removes the connection that sent the message from the subscriptions of the provided hashtag.
6. Client receives a tweet from the Server which contains a hashtag it was subscribed to.
7. When the Client disconnects, the ServerThread gracefully closes the connections and unsubscribes the old client from its records. The Thread then resumes listening for a new connection.
8. When the Server shuts down, all the currently connected clients get disconnected.

## Limitations
My solutions used to have two major limitations:

1. The number of Threads would not scale and was hard-coded to 4 active Threads at all times.
2. The console, used by both input and output for the Client application is shared, which means that incoming messages might interfere with a command that is being written.

Limitation **1.** was overcome thanks to the introduction of the `DynamicThreadPool` class, which handles all the Threads of the Server Application. Initially the server begins with only 1 thread listening for a connection, as soon as a connection is established, the thread become 2, and this pool of Threads keeps doubling up in size depending on the active connections. When there are more threads than necessary, the pool also shrinks down, killing threads when they are not active nor required.

Limitation **2.** I found being an implicit limitation of the terminal and after some research I found out that it cannot be overcome with a Java implementation alone.

## Documentation
The code contains plenty of comments as well as JavaDoc, which was used to generate all the requested documentation and that can be found hosted online [HERE](http://atelier.inf.usi.ch/~romanea/cn1/).
