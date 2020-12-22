import { createStackNavigator } from 'react-navigation-stack'
import { fadeIn, fromBottom, fromRight } from 'react-navigation-transitions'
import { normalize } from '../functions'

// Screens:
import Preload from '../screens/Preload'
import SelectCity from '../screens/SelectCity'
import Home from '../screens/Home'
import InfoCategory from '../screens/InfoCategory'
import InfoSnack from '../screens/InfoSnack'
import ViewImage from '../screens/ViewImage'
import Request from '../screens/Request'
import Resume from '../screens/Resume'
import ThankYou from '../screens/ThankYou'
import ChooseAddress from '../screens/ChooseAddress'
import AddAddress from '../screens/AddAddress'
import ConfirmRequest from '../screens/ConfirmRequest'
import InfoDelivery from '../screens/InfoDelivery'
import Information from '../screens/Information'
import History from '../screens/History'
import OrderDetails from '../screens/OrderDetails'

const handleCustomTransitions = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2]
    const nextScene = scenes[scenes.length - 1]

    // Custom transitions go there
    if (prevScene
        && prevScene.route.routeName == 'Home'
        && nextScene.route.routeName == 'InfoSnack') {
            return fromBottom(250) // Tempo em milisegundos. Exemplo 500 = meio segundo.
        } else if (
            prevScene
            && prevScene.route.routeName == 'InfoCategory'
            && nextScene.route.routeName == 'InfoSnack') {
                return fromBottom(250)
            } else if (
                prevScene
                && prevScene.route.routeName == 'InfoSnack'
                && nextScene.route.routeName == 'ViewImage') {
                    return fadeIn(300)
                }
        return fromRight()
}

const AppStack = createStackNavigator({
    Preload: {
        screen: Preload
    },
    SelectCity: {
        screen: SelectCity
    },
    Home: {
        screen: Home
    },
    InfoCategory: {
        screen: InfoCategory
    },
    InfoSnack: {
        screen: InfoSnack,
        navigationOptions: {
            headerTitleContainerStyle: {
                width: '100%',
                justifyContent: 'flex-start'
            }
        }
    },
    ViewImage: {
        screen: ViewImage,
        navigationOptions: {
            headerShown: false,
        },
    },
    Request: {
        screen: Request
    },
    Resume: {
        screen: Resume
    },
    ThankYou: {
        screen: ThankYou
    },
    ChooseAddress: {
        screen: ChooseAddress
    },
    AddAddress: {
        screen: AddAddress
    },
    ConfirmRequest: {
        screen: ConfirmRequest
    },
    InfoDelivery: {
        screen: InfoDelivery
    },
    Information: {
        screen: Information
    },
    History: {
        screen: History
    },
    OrderDetails: {
        screen: OrderDetails
    }
}, {
    initialRouteName: 'Preload',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        // Ocultar header:
        //headerShown: false
        headerStyle: {
            height: normalize(56.5),
            backgroundColor: '#077a15',
            elevation: 0,
            // height: 80,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            // fontSize: 18,
            fontSize: normalize(20),
            fontWeight: 'bold',
            textAlignVertical: 'bottom'
        }



        // headerStyle: {
        //     backgroundColor: '#077a15',
        //     height: normalize(56.5),
        //     elevation: 0,
        // },
        // headerTintColor: '#fff',
        // headerTitleStyle: {
        //     fontSize: normalize(20),
        //     fontWeight: 'bold'
        // }
    },
    transitionConfig: (nav) => handleCustomTransitions(nav)
})

export default AppStack