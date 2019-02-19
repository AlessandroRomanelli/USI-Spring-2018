package exercise3;

public class Test {

    public static void main (String[] args) {

        // numLoadedCoins < NUM_COINS_TO_REWARD
        SlotMachine machine = new SlotMachine(1);
        System.out.println("\nA\n");

        // numLoadedCoins >= NUM_COINS_TO_REWARD
        machine = new SlotMachine(SlotMachine.NUM_COINS_TO_REWARD);
        System.out.println("\nB\n");


        // Machine in idle state, thus no coin has been inserted.
        machine.pushPlayButton();
        System.out.println("\nC\n");

        // A coin is successfully inserted
        machine.insertCoin();
        System.out.println("\nD\n");


        // There is already a coin inserted
        machine.insertCoin();
        System.out.println("\nE\n");


		/* The user plays. If the users wins, the machine enter the out-of-coins state.
		 Otherwise, it enters the idle state. */
        machine.pushPlayButton();
        System.out.println("\nF\n");


		/* If the machine is in the idle state, the user can play.
		Otherwise, the machine drops the coin because it is in the out-of-coins state. */
        machine.insertCoin();
        System.out.println("\nG\n");
    }
}