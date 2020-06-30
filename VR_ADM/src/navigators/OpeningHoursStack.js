import { createStackNavigator } from 'react-navigation-stack';

// Screens:
import OpeningHours from '../screens/OpeningHours';

const OpeningHoursStack = createStackNavigator({
    OpeningHours: {
        screen: OpeningHours
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

export default OpeningHoursStack;