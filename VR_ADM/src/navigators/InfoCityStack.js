import { createStackNavigator } from 'react-navigation-stack';

// Screens:
import InfoCity from '../screens/InfoCity';
import ChangePass from '../screens/ChangePass';

const InfoCityStack = createStackNavigator({
    InfoCity: {
        screen: InfoCity
    },
    ChangePass: {
        screen: ChangePass
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