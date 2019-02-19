package exercise2;

import java.util.Date;

public class TwitterStrategy implements Strategy {
    private void connect() {
        System.out.println("Connecting to Twitter...");
    }

    private void formatPost(String post) {
        System.out.println("Formatting the post for Twitter: " + post);
    }

    private void schedulePublication(Date date) {
        System.out.println("Scheduling Twitter publication on: " + date);
    }

    private void verifyCharacterLimitTwitter() {
        System.out.println("Verifying the character limit for Twitter.");
    }

    private void activateRetweets() {
        System.out.println("Activating auto-retweeting for massive advertisement.");
    }


    @Override
    public void issue(Advertisement adv) {
        connect();
        verifyCharacterLimitTwitter();
        formatPost(adv.toString());
        schedulePublication(adv.getReleaseDate());
        activateRetweets();
    }
}
