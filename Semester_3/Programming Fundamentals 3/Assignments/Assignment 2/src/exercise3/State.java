package exercise3;

public interface State {
    void setup();
    void dropCoin(String reason);
    void insertCoin();
    void pushPlayButton();
}
