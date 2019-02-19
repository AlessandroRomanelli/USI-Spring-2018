package exercise2;

import java.util.Date;

public class AdPublisher {

    private void issueAd(Strategy strategy, Advertisement ad) {
        strategy.issue(ad);
    }

    public static void main(String[] args) {

        AdPublisher publisher = new AdPublisher();

        Advertisement summerSale = new Advertisement("Summer sales starts today",
                "http://abc.com", new Date());
        publisher.issueAd(new FacebookStrategy(), summerSale);

        Advertisement phoneRelease = new Advertisement("xPhone is finally released!",
                "http://xyz.com", new Date());

        publisher.issueAd(new FacebookStrategy(), phoneRelease);
        publisher.issueAd(new TwitterStrategy(), phoneRelease);
        publisher.issueAd((new InstagramStrategy()), phoneRelease);
    }
}
