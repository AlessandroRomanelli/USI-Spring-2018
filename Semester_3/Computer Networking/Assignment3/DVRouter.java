import simplenet.Router;
import simplenet.RoutingMessage;

import java.util.HashMap;
import java.util.Map;

public class DVRouter extends Router {
    private final Map<Integer, Double> distanceVector = new HashMap<>();

    /**
     * A method which takes an incoming message from one of the interfaces of a Router and handles it
     * @param m The message being received
     * @param ifx The interface from which the message came
     */
    public void process_routing_message(RoutingMessage m, int ifx) {
       final MyRoutingMessage msg = (MyRoutingMessage) m;
       final boolean changedVector = updateDistanceVector(msg, ifx);
       if (changedVector) {
           broadcastVector();
       }
    }

    /**
     * A method invoked whenever a new Router is created and connected to the network
     */
    public void initialize() {
        distanceVector.put(my_address(), 0.0);
        broadcastVector();
    }


    /**
     * A method to update the current distance vector with the received message
     * @param msg The message being received from the sender
     * @param ifx The interface from which the message came
     * @return A boolean to indicate whether the distance vector was modified
     */
    private boolean updateDistanceVector(MyRoutingMessage msg, int ifx) {
        // Identifier of sender
        final int origin = msg.getAddress();
        // Cost of the edge
        final double link_cost = link_cost(ifx);
        boolean changed = false;

        // Insert the adjacent into the distance vector
        if (distanceVector.containsKey(origin)) {
            // Only update it if it was better than the previously known shortest path
            if (link_cost < distanceVector.get(origin)) {
                set_forwarding_entry(origin, ifx);
                distanceVector.put(origin, link_cost);
                changed = true;
            }
        } else {
            set_forwarding_entry(origin, ifx);
            distanceVector.put(origin, link_cost);
            changed = true;
        }

        // Retrieve the received distance vector
        final Map<Integer,Double> receivedVector = msg.getVector();
        // Merge it into the current router
        for (Integer address: receivedVector.keySet()) {
            final double new_link_cost = link_cost + receivedVector.get(address);
            if (distanceVector.containsKey(address)) {
                if (new_link_cost < distanceVector.get(address)) {
                    set_forwarding_entry(address, ifx);
                    distanceVector.put(address, new_link_cost);
                    changed = true;
                }
            } else {
                distanceVector.put(address, new_link_cost);
                set_forwarding_entry(address, ifx);
                changed = true;
            }
        }
        return changed;
    }


    /**
     * A method that broadcasts the current distance vector to all the interfaces
     */
    private void broadcastVector() {
        // Broadcast current distance vector to all adjacents
        for (int i = 0; i < interfaces(); i++) {
            send_message(new MyRoutingMessage(my_address(), distanceVector), i);
        }
    }

}