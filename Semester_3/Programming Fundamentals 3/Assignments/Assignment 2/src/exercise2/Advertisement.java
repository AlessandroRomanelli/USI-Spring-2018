package exercise2;

import java.util.Date;

public class Advertisement {
    private final String message;
    private final String url;
    private final Date releaseDate;

    public Advertisement(String message, String url, Date releaseDate) {
        this.message = message;
        this.url = url;
        this.releaseDate = releaseDate;
    }

    public String getMessage() {
        return message;
    }

    public String getUrl() {
        return url;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    @Override
    public String toString() {
        return "[" + message + ". For more information visit: " + url + "]";
    }
}