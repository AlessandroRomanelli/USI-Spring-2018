package exercise1;

import java.util.Calendar; import java.util.Date;
public class Test {
    public static void main (String[] args) {
        IObserver user1 = new ObserverUser("User1", false);
        IObserver user2 = new ObserverUser("User2", false);
        IObserver user3 = new ObserverUser("User3", true);
        WeatherNotificationSystem notifier = new WeatherNotificationSystem();
        notifier.registerObserver(user1);
        notifier.registerObserver(user2);
        notifier.registerObserver(user3);
        // For simplicity, a sample date is used for all the alerts.
        Calendar cal = Calendar.getInstance();
        cal.set(2018, Calendar.OCTOBER, 1, 12, 00, 00);
        Date sampleDate = cal.getTime();
        Alert thunderstorm = new Alert(Alert.Type.THUNDERSTORM, sampleDate, "Incoming thunderstorm.");
        notifier.notifyObservers(thunderstorm);
        notifier.removeObserver(user2);
        Alert tornado = new Alert(Alert.Type.TORNADO, sampleDate, "Tornado alert for tomorrow.");
        notifier.notifyObservers(tornado);
        notifier.removeObserver(user3);
        Alert hurricane = new Alert(Alert.Type.HURRICANE, sampleDate, "WARNING: imminent hurricane!");
        notifier.notifyObservers(hurricane);
    }
}
