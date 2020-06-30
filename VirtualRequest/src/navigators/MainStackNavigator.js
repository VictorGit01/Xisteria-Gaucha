import { createStackNavigator } from 'react-navigation-stack'
import { fromBottom, fromRight } from 'react-navigation-transitions'

// Screens:
import Preload from '../screens/Preload'
import SelectCity from '../screens/SelectCity'
import Home from '../screens/Home'
import InfoCategory from '../screens/InfoCategory'
import InfoSnack from '../screens/InfoSnack'
import Request from '../screens/Request'
import Resume from '../screens/Resume'
import ChooseAddress from '../screens/ChooseAddress'
import AddAddress from '../screens/AddAddress'
import ConfirmRequest from '../screens/ConfirmRequest'
import InfoDelivery from '../screens/InfoDelivery'
import Information from '../screens/Information'
import History from '../screens/History'

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
    Request: {
        screen: Request
    },
    Resume: {
        screen: Resume
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
    }
}, {
    initialRouteName: 'Preload',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        // Ocultar header:
        //headerShown: false
        headerStyle: {
            backgroundColor: '#077a15',
            elevation: 0,
            // height: 80,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlignVertical: 'bottom'
        }
    },
    transitionConfig: (nav) => handleCustomTransitions(nav)
})

export default AppStack