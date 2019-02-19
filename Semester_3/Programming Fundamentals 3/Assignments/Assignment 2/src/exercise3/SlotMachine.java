package exercise3;

public class SlotMachine {

    // The number of coins given to the winning player.
    public static final int NUM_COINS_TO_REWARD = 5;

    private int numLoadedCoins;
    private State state;

    public SlotMachine(int initialNumCoins) {
        this.state = new IdleState(this);
        this.numLoadedCoins = initialNumCoins;
        this.state.setup();
    }

    private void dropCoin(String reason) {
        this.state.dropCoin(reason);
    }

    //This operation is triggered by the player.
    public void insertCoin() {
        this.state.insertCoin();
    }

    // This operation is triggered by the player.
    public void pushPlayButton() {
        this.state.pushPlayButton();
    }

    public void transition(State state) {
        this.state = state;
        this.state.setup();
    }

    public int getNumLoadedCoins() {
        return numLoadedCoins;
    }

    public void setNumLoadedCoins(int numLoadedCoins) {
        this.numLoadedCoins = numLoadedCoins;
    }
}
