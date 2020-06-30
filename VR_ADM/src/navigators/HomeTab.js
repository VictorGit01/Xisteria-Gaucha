import React from 'react'
import styled from 'styled-components/native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Screens:
import Delivery from '../screens/Delivery'
import Place from '../screens/Place'

const HomeTab = createMaterialTopTabNavigator({
    Delivery: {
        screen: Delivery
    },
    Place: {
        screen: Place
    }
}, {
    swipeEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: '#077a15',
        },
        indicatorStyle: {
            backgroundColor: '#fff'
        },
        upperCaseLabel: false,
        labelStyle: {
            fontSize: 16
        }
    },
    defaultNavigationOptions: {
        
    }
})

HomeTab.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate

    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    const Text = styled.Text`
        font-size: 25px;
        color: #fff;
    `

    return {
        headerTitle: 'Pedidos',
        headerLeft: () => (
            <ButtonIcon
                onPress={() => navigation.openDrawer()}
                activeOpacity={.7}
                hitSlop={{ right: 30 }}
            >
                {/* <FontIcon name='bars' size={20} color='#fff' /> */}
                <Icon name='menu' size={25} color='#fff' />
            </ButtonIcon>
        ),
    }
}

export default HomeTab;