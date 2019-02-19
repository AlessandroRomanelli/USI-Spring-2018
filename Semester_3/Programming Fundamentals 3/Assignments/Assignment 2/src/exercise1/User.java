package exercise1;

public class User {
    private final String name;
    /* true if the user wants to be notified via a phone call given an alert of tornado or hurricane. */
    private final boolean phoneCallAllowed;

    public User(String name, boolean phoneCallAllowed) {
        this.name = name;
        this.phoneCallAllowed = phoneCallAllowed;
    }

    public String getName() {
        return name;
    }

    public boolean isPhoneCallAllowed() {
        return phoneCallAllowed;
    }
}