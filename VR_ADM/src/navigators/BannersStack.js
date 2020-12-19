import { createStackNavigator } from 'react-navigation-stack';

// Screens:
import Banners from '../screens/Banners';

const BannersStack = createStackNavigator({
    Banners: {
        screen: Banners
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

export default BannersStack;