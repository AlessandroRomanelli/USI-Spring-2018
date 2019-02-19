package exercise3;

public class OutOfCoinsState implements State {
    private SlotMachine context;

    public OutOfCoinsState(SlotMachine context) {
        this.context = context;
    }

    @Override
    public void setup() {
        System.err.println("This machine is out of coins. Please call a casino host.");
    }

    @Override
    public void dropCoin(String reason) {
        System.err.println("Dropping the coin because: "+reason);
    }

    @Override
    public void insertCoin() {
        dropCoin("this machine does not have enough coins for rewarding. "
                + "Please call a casino host.");
    }

    @Override
    public void pushPlayButton() {
        System.err.println("You cannot play due to this machine is out of coins. "
                + "Please call a casino host.");
    }
}
