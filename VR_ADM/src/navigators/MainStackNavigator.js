import React, { useEffect } from 'react'
import { Animated } from 'react-native'
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack'

// Screens:
import Preload from '../screens/Preload'
import Login from '../screens/Login'
import RegisterCity from '../screens/RegisterCity'
import Menu from '../screens/Menu'
// import InsertItems from '../screens/InsertItems'
import CreateBanners from '../screens/CreateBanners'
import CreateOpenHours from '../screens/CreateOpenHours'

// Navigators:
import HomeTab from './HomeTab'
import HomeDrawer from './HomeDrawer'
import InsItemsTab from './InsertItemsTabNavigator'

import { NavigationActions } from 'react-navigation'
import { View } from 'react-native'

const MainStackNavigator = createStackNavigator({
    Preload: {
        screen: Preload
    },
    Login: {
        screen: Login
    },
    RegisterCity: {
        screen: RegisterCity
    },
    CreateOpenHours: {
        screen: CreateOpenHours
    },
    CreateBanners: {
        screen: CreateBanners
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
    initialRouteName: 'Preload',
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
            fontWeight: 'bold',
            // backgroundColor: 'tomato',
        },
        
    }
})

// const defaultGetStateForAction = MainStackNavigator.router.getStateForAction;
// MainStackNavigator.router.getStateForAction = (action, state) => {
//     if (
//         state &&
//         action.type === NavigationActions.BACK &&
//         (
//             state.routes[state.index].routeName === 'Preload' ||
//             state.routes[state.index].routeName === 'HomeDrawer'
//         )
//     ) {
//         return null;
//     }
//     return defaultGetStateForAction(action, state);
// }

export default MainStackNavigator;