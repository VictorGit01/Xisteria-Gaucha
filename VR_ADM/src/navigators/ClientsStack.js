import { createStackNavigator } from 'react-navigation-stack';
import { normalize } from '../functions';

// Screens:
import Clients from '../screens/Clients';
import InfoClient from '../screens/InfoClient';

const ClientsStack = createStackNavigator({
    Clients: {
        screen: Clients
    },
    InfoClient: {
        screen: InfoClient
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#077a15',
            height: normalize(56.5),
            elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: normalize(20),
            fontWeight: 'bold',
        },
    }
})

export default ClientsStack;