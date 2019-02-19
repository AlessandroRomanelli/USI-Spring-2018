import java.io.*;
import java.net.Socket;
import java.util.Arrays;
import java.util.Scanner;


/**
 * A Class which implements the functionality for a Thread which reads the input of an active socket
 * @author Alessandro Romanelli
 * @version 1.0
 */
final class ClientInputThread implements Runnable {
    /**
     * Implementation of the Thread, which constantly reads the input coming from the Server.
     */
    public void run() {
        Socket socket = TwitterClient.socket;
        try {
            // Setup the input channel
            final InputStream input = socket.getInputStream();
            final BufferedReader reader = new BufferedReader(new InputStreamReader(input));
            String line;
            // Keep reading the input lines
            while((line = reader.readLine()) != null) {
                // Print the inbound message to the console
                print(line);
            }
            // Close the connection
            socket.close();
            // Goodbye message
//            print("Connection closed by the server");
        } catch (IOException ex) {
//            System.err.println("Exception: "+ex);
        }
    }

    /**
     * (Synchronised Method) A method which prints a message to the console.
     * @param line The message to be printed
     */
    private synchronized void print(final String line) {
        System.out.println(line);
    }
}

/**
 * A class which implements the functionality for a Thread which handles the output of the application
 * through the active socket
 * @author Alessandro Romanelli
 * @version 1.0
 */
final class ClientOutputThread implements Runnable {
    /**
     * Implementation of the Thread, which handles the user messages
     */
    public void run() {
        Socket socket = TwitterClient.socket;
        try {
            // Setup the (hardware) input channel
            final Scanner keyboard = new Scanner(System.in);
            final OutputStream output = socket.getOutputStream();
            // Until the connection with the server isn't closed
            while (!socket.isClosed()) {
                // Gets the next line and splits it between VERB and PAYLOAD
                final String[] line = keyboard.nextLine().split(" ", 2);
                // If there is only a VERB without payload
                if (line.length < 2) {
                    // If it's equal to exit, close the application
                    if (line[0].equals("EXIT")) {
                        socket.close();
                        System.exit(1);
                        break;
                    }
//                    System.err.println("Wrong message format, should be: <command> <data>");
                } else {
                    final String verb = line[0];
                    final String payload = line[1];
                    // If it is a valid command and valid tags (the verb being SUB or UNSUB)
                    if (validateCommand(verb) && validateTags(verb, payload)) {
                        // Send the validated command to the Server
                        output.write((verb+" "+payload+"\n").getBytes());;
                    }
                }
            }
        } catch (IOException ex) {
//            System.err.println("Exception: "+ex);
        }
    }

    /**
     * A method which takes a command and verifies if it's a valid one
     * @param command The command to verify
     * @return A boolean which signals whether the argument was a valid command
     */
    private boolean validateCommand(final String command) {
        final String[] commands = {"TWEET", "SUBSCRIBE", "UNSUBSCRIBE"};
        // If the array of commands contains the argument it's a valid one
        if (Arrays.asList(commands).contains(command)) {
            return true;
        } else {
//            System.err.println("Unrecognised command, valid commands:");
//            System.err.println("TWEET <message>\nSUBSCRIBE <hashtag>\nUNSUBSCRIBE <hashtag>");
            return false;
        }
    }

    /**
     * A method which takes a command and a tag, if the command is SUB or UNSUB
     * then validates if it contains a meaningful tag
     * @param command The verb of the line
     * @param tag The tag to be checked
     * @return A boolean which represents whether the line is valid
     */
    private boolean validateTags(final String command, final String tag) {
        final String[] commands = {"SUBSCRIBE", "UNSUBSCRIBE"};
        // If the verb is either SUB or UNSUB
        if (Arrays.asList(commands).contains(command)) {
            // If the tag begins with an '#' and is longer than just that char
            if (tag.charAt(0) == ('#') && tag.length() > 1) {
                return true;
            } else {
//                System.err.println("Must provide a valid <hashtag> (e.g.: #hashtag) after SUBSCRIBE | UNSUBSCRIBE command");
                return false;
            }
        }
        return true;
    }
}


/**
 *   Abstract class for a Client which instantiates two threads, one to handle the keyboard input and output towards a
 *   Server application and another one to constantly monitor the input from the Server
 *   @author Alessandro Romanelli
 *   @version 1.0
 */
abstract public class TwitterClient {
    static Socket socket;

    public static void main(final String[] args) throws Exception {
        if (args.length != 2) {
            System.err.println("Usage: ./client SERVER_HOST SERVER_PORT");
            System.exit(1);
        }

        // Hostname and port for the Server Application
        final String server_hostname = args[0];
        final int server_port = Integer.parseInt(args[1]);

        // Create the connection socket
        socket = new Socket(server_hostname, server_port);
        new Thread(new ClientOutputThread()).start();
        new Thread(new ClientInputThread()).start();

        // Keep the thread going until the connection is open but kill it afterwards
        while (!socket.isClosed()) { Thread.sleep(1000);}

        System.exit(1);
    }
}

