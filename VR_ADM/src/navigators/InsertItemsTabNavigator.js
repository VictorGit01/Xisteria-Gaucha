import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

// Screens:
import Details from '../screens/Details'
import AddOns from '../screens/AddOns'
import Availability from '../screens/Availability'

const InsertItemsTabNavigator = createMaterialTopTabNavigator({
    Details: {
        screen: Details,
    },
    AddOns: {
        screen: AddOns
    },
    Availability: {
        screen: Availability
    }
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    initialRouteName: 'Details',
    tabBarOptions: {
        style: {
            backgroundColor: '#077a15',
            height: 0,
        },
        labelStyle: {
            fontSize: 12
        },
        indicatorStyle: {
            height: 0
        }
    },
    defaultNavigationOptions: {
        
    }
})

InsertItemsTabNavigator.navigationOptions = ({ navigation }) => {
    let params = navigation.state.params
    let editEnabled = params.editEnabled

    return {
        headerTitle: editEnabled ? 'Editar item' : 'Criar item'
    }
}

export default InsertItemsTabNavigator