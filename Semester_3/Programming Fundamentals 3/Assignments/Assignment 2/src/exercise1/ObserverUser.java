package exercise1;

public class ObserverUser extends User implements IObserver {

    public ObserverUser(String name, boolean phoneCallAllowed) {
        super(name, phoneCallAllowed);
    }

    public void notify(Alert a) {
        System.out.println("EMAIL: "+getName()+", "+a.getType()+", "+a.getDate()+", "+a.getDescription());
        if (a.getType() != Alert.Type.THUNDERSTORM) {
            System.out.println("SMS: "+getName()+", "+a.getType()+", "+a.getDate()+", "+a.getDescription());
            if (isPhoneCallAllowed()) {
                System.out.println("PHONE_CALL: "+getName()+", "+a.getType()+", "+a.getDate()+", "+a.getDescription());
            }
        }
    }
}
