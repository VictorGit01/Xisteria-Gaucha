import { createStackNavigator } from 'react-navigation-stack';

import DeliveryArea from '../screens/DeliveryArea';

const DeliveryAreaStack = createStackNavigator({
    DeliveryArea: {
        screen: DeliveryArea
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#077a15'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
})

export default DeliveryAreaStack;