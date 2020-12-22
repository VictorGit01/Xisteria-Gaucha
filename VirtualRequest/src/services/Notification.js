import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native'

export default {
    configure() {
        PushNotification.configure({
            onNotification(notification) {
                console.log('Notificação recebida', notification);
            },
            requestPermissions: Platform.OS === 'ios',
            // senderID: ''
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
        });

        return PushNotification;
    }
};