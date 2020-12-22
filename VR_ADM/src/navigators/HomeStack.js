import { createStackNavigator } from 'react-navigation-stack';
import { normalize } from '../functions';

// Navigators:
import HomeTab from './HomeTab';

// Screens:
import InfoDelivery from '../screens/InfoDelivery';
import InfoPlace from '../screens/InfoPlace';
import InfoCanceled from '../screens/InfoCanceled';

import CustomScreenDrawer from '../components/CustomScreenDrawer'

const HomeStack = createStackNavigator({
    HomeTab: {
        screen: HomeTab
    },
    InfoDelivery: {
        screen: InfoDelivery
    },
    InfoPlace: {
        screen: InfoPlace
    },
    InfoCanceled: {
        screen: InfoCanceled
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#077a15',
            height: normalize(56.5),
            elevation: 0,
        },
        headerTitleStyle: {
            fontSize: normalize(20),
            fontWeight: 'bold',
            // width: '100%',
            // textAlign: 'center'
            // flex: 1,
            // height: '100%',
            // backgroundColor: 'tomato',
        },
        headerTintColor: '#fff',
        headerLeftContainerStyle: {
            // backgroundColor: 'tomato',
            // marginRight: 10
            // flex: 1
        },
        headerTitleContainerStyle: {
            // backgroundColor: 'tomato',
            
            // alignItems: 'flex-start'
            // flex: 1,
            // width: '100%'
        },
        headerTitleAlign: 'center',
    }
})

export default HomeStack;