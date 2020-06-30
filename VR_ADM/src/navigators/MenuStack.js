import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';

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
            backgroundColor: '#077a15'
        },
        headerTitleStyle: {
            fontWeight: 'bold'
        },
        headerTintColor: '#fff'
    }
});

export default MenuStack;