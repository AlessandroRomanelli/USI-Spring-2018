package exercise2;

import java.util.Date;

public class InstagramStrategy implements Strategy {
    private void connect() {
        System.out.println("Connecting to Instagram...");
    }

    private void verify(String url) {
        System.out.println("Verifing the following URL: "+url);
    }

    private void formatPost(String post) {
        System.out.println("Formatting the post for Instagram: " + post);
    }

    private void schedulePublication(Date date) {
        System.out.println("Scheduling Instagram publication on: " + date);
    }

    private void assignBots() {
        System.out.println("Assigning bots to massively like the advertisement");
    }




    @Override
    public void issue(Advertisement adv) {
        connect();
        verify(adv.getUrl());
        formatPost(adv.toString());
        schedulePublication(adv.getReleaseDate());
        assignBots();
    }
}
