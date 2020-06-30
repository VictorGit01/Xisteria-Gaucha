import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack'

// Screens:
import Login from '../screens/Login'
import RegisterCity from '../screens/RegisterCity'
import Menu from '../screens/Menu'
// import InsertItems from '../screens/InsertItems'
import InsItemsTab from './InsertItemsTabNavigator'

// Navigators:
import HomeTab from './HomeTab'
import HomeDrawer from './HomeDrawer'

// Screens:
import CreateOpenHours from '../screens/CreateOpenHours'

const MainStackNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    RegisterCity: {
        screen: RegisterCity
    },
    CreateOpenHours: {
        screen: CreateOpenHours
    },
    HomeDrawer: {
        screen: HomeDrawer
    },
    // HomeTab: {
    //     screen: HomeTab,
    //     navigationOptions: {
    //         // headerLeft: () => null
    //     }
    // },
    
    // InsertItems: {
    //     screen: InsertItems
    // }
    
}, {
    initialRouteName: 'Login',
    // headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        // Alinhar título do cabeçalho:
        // headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#077a15',
            elevation: 1
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
})

export default MainStackNavigator