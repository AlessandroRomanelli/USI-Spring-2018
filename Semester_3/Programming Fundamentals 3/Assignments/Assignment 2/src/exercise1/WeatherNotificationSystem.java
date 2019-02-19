package exercise1;

import java.util.ArrayList;
import java.util.List;

public class WeatherNotificationSystem implements ISubject {

    private List<IObserver> observers = new ArrayList<>();

    public void registerObserver(IObserver obs) {
        observers.add(obs);
    }

    public void removeObserver(IObserver obs) {
        observers.remove(obs);
    }

    public void notifyObservers(Alert alert) {
        for (IObserver obs: observers) {
            obs.notify(alert);
        }
    }
}
