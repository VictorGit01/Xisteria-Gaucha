import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';
import { normalize } from '../functions'

// Navigators:
import InsItemsTab from './InsertItemsTabNavigator'

// Screens:
import Menu from '../screens/Menu';

const MenuStack = createStackNavigator({
    Menu: {
        screen: Menu
    },
    InsItemsTab: {
        screen: InsItemsTab
    }
}, {
    defaultNavigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
            height: normalize(56.5),
            backgroundColor: '#077a15',
        },
        headerTitleStyle: {
            fontSize: normalize(20),
            fontWeight: 'bold'
        },
        headerTintColor: '#fff',
        // headerTitleContainerStyle: {
        //     position: 'relative'
        // },
        headerTitleAlign: 'left'
    }
});

export default MenuStack;