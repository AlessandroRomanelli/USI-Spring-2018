package exercise2;

import java.util.Date;

public class FacebookStrategy implements Strategy {
    private void connect() {
        System.out.println("Connecting to Facebook...");
    }

    private void formatPost(String post) {
        System.out.println("Formatting the post for Facebook: " + post);
    }

    private void schedulePublication(Date date) {
        System.out.println("Scheduling Facebook publication on: " + date);
    }

    private void payAds() {
        System.out.println("Paying Facebook Ads for massive advertisement.");
    }

    @Override
    public void issue(Advertisement adv) {
        connect();
        formatPost(adv.toString());
        schedulePublication(adv.getReleaseDate());
        payAds();
    }
}
