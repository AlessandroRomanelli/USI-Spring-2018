package exercise3;

import java.util.Random;

public class PlayingState implements State {
    private SlotMachine context;

    // Top range for random integer values assignable to symbols.
    private static final int NUM_SYMBOL_VALUES = 3;

    private final Random random = new Random();
    // For simplicity, the symbols to display are modeled as integers.
    private int symbol1 = 1;
    private int symbol2 = 2;
    private int symbol3 = 3;


    public PlayingState(SlotMachine context) {
        this.context = context;
    }

    @Override
    public void setup() {
        context.setNumLoadedCoins(context.getNumLoadedCoins() + 1);
        System.out.println("Push the play button. Good luck!!!");
    }

    @Override
    public void dropCoin(String reason) {
        System.err.println("Dropping the coin because: "+reason);
    }

    @Override
    public void insertCoin() {
        dropCoin("a coin is already inserted.");
    }

    @Override
    public void pushPlayButton() {
        System.out.println("Playing...");
        symbol1 = random.nextInt(NUM_SYMBOL_VALUES);
        symbol2 = random.nextInt(NUM_SYMBOL_VALUES);
        symbol3 = random.nextInt(NUM_SYMBOL_VALUES);
        System.out.println("Symbol #1:" + symbol1 +
                "\nSymbol #2:" + symbol2 +
                "\nSymbol #3:" + symbol3);
        if((symbol1 == symbol2 && symbol2 == symbol3)) {
            context.setNumLoadedCoins(context.getNumLoadedCoins()-SlotMachine.NUM_COINS_TO_REWARD);;
            System.out.println("Congratulations!!! YOU WON!!!");
        }
        context.transition(new IdleState(context));
    }
}
