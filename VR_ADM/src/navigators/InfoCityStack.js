import { createStackNavigator } from 'react-navigation-stack';

// Screens:
import InfoCity from '../screens/InfoCity';

const InfoCityStack = createStackNavigator({
    InfoCity: {
        screen: InfoCity
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

export default InfoCityStack;