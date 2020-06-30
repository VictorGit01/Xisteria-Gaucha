import React from 'react'
import { ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import styled from 'styled-components/native'

// Screens:
import Foods from '../screens/Foods'
import Drinks from '../screens/Drinks'

// Components:
import CustomTabBar from '../components/HomeTab/CustomTabBar'

const AppTab = createMaterialTopTabNavigator({
    Foods: {
        screen: Foods
    },
    Drinks: {
        screen: Drinks
    }
}, {
    initialRouteName: 'Foods',
    swipeEnabled: false,
    lazy: true,
    tabBarPosition: 'top',
    tabBarOptions: {
        tabStyle: {
            //backgroundColor: '#077a15'
        },
        style: {
            backgroundColor: '#077a15'
        },
        upperCaseLabel: false,
        labelStyle: {
            fontSize: 16
        },
        indicatorStyle: {
            backgroundColor: '#fe9601'
        },
        //activeTintColor: '#fe9601',
        //inactiveTintColor: '#fff',
        activeBackgroundColor: '#000',
        inactiveBackgroundColor: '#fff',
    },
    tabBarComponent: (props) => (
        <CustomTabBar
            {...props}
            items={[
                {text: 'Hambúrgueres', route: 'Foods', activeFoods: '#fe9601'},
                {text: 'Bebidas', route: 'Drinks', activeDrinks: '#077a15'}
            ]}
        />
    ),
    defaultNavigationOptions: {
        
    },
})

AppTab.navigationOptions = (props) => {
    let nav = props.navigation.navigate

    const ButtonIcon = styled.TouchableOpacity`
        height: 100%
        justify-content: center;
        align-items: center;
    `

    const Icon = styled.Image`
        height: ${props=>props.size ? props.size : 21}px;
        width: ${props=>props.size ? props.size : 21}px;
        margin-horizontal: 20px;
    `

    return {
        headerTitle: 'Xisteria Gaúcha',
        headerLeft: () => (
            <ButtonIcon onPress={() => nav('History')} >
                <Icon source={require('../assets/icons/history_64px.png')} />
            </ButtonIcon>
        ),
        headerRight: () => (
            <ButtonIcon onPress={() => {
                nav('Request')
                /*
                if (props.list_request.length <= 0) {
                    alert('Vazio!')
                } else {
                    nav('Request')
                }
                */
                /*
                props.list_request.length <= 0 ?
                ToastAndroid.showWithGravityAndOffset(
                    'Adicione produtos ao seu pedido!',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    180
                ) :
                nav('Request')
                */
                //console(props.list_request)
            }} >
                <Icon
                    source={require('../assets/icons/clipboard-white_64px.png')}
                    size={23}
                />
            </ButtonIcon>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        list_request: state.requestReducer.list_request
   }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppTab)