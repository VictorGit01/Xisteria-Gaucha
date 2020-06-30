import { createStackNavigator } from 'react-navigation-stack';

// Navigators:
import HomeTab from './HomeTab';

const HomeStack = createStackNavigator({
    HomeTab: {
        screen: HomeTab
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#077a15',
            elevation: 0
        },
        headerTitleStyle: {
            fontWeight: 'bold'
        },
        headerTintColor: '#fff'
    }
})

export default HomeStack;