package exercise1;

import java.util.Date;

public class Alert {
    public enum Type{THUNDERSTORM, TORNADO, HURRICANE};
    private final Type type;
    private final Date date;
    private final String description;

    public Alert(Type type, Date date, String description) {
        this.type = type;
        this.date = date;
        this.description = description;
    }

    public Type getType() {
        return type;
    }

    public Date getDate() {
        return date;
    }
    public String getDescription() {
        return description;
    }
}