import simplenet.RoutingMessage;

import java.util.Map;

class MyRoutingMessage extends RoutingMessage {
    private int address;
    private Map<Integer,Double> vector;

    public MyRoutingMessage(int address, Map<Integer, Double> vector) {
        this.address = address;
        this.vector = vector;
    }

    public Map<Integer, Double> getVector() {
        return vector;
    }

    public int getAddress() {
        return address;
    }
}