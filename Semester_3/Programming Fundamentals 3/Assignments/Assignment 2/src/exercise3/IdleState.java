package exercise3;

public class IdleState implements State {
    private SlotMachine context;

    public IdleState(SlotMachine context) {
        this.context = context;
    }

    @Override
    public void setup() {
        if((context.getNumLoadedCoins() < SlotMachine.NUM_COINS_TO_REWARD)) {
            context.transition(new OutOfCoinsState(context));
        }
        else {
            System.out.println("Insert a coin and start the fun!!!");
        }
    }

    @Override
    public void dropCoin(String reason) {
        System.err.println("Dropping the coin because: "+reason);
    }

    @Override
    public void insertCoin() {
        System.out.println("A coin has been successfully inserted.");
        context.transition(new PlayingState(context));
    }

    @Override
    public void pushPlayButton() {
        System.err.println("Please insert a coin to start playing.");

    }

}
