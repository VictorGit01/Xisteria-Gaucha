import React from 'react'
import styled from 'styled-components/native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { RectButton } from 'react-native-gesture-handler'
import { normalize } from '../functions'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Components:
import TabBarLabel from '../components/TabBarLabel'

// Screens:
import Delivery from '../screens/Delivery'
import Place from '../screens/Place'
import Canceled from '../screens/Canceled'

const HomeTab = createMaterialTopTabNavigator({
    Delivery: {
        screen: Delivery,
        navigationOptions: (props) => {
            return {
                tabBarLabel: ({focused}) => (
                    <TabBarLabel focused={focused} route='Delivery' badge={0} />
                )
            }
        }
    },
    Place: {
        screen: Place,
        navigationOptions: (props) => {
            return {
                tabBarLabel: ({focused}) => (
                    <TabBarLabel focused={focused} route='Place' badge={0} />
                )
            }
        }
    },
    Canceled: {
        screen: Canceled,
        navigationOptions: (props) => {
            return {
                tabBarLabel: ({focused}) => (
                    <TabBarLabel focused={focused} route='Canceled' badge={0} />
                )
            }
        }
    }
}, {
    swipeEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: '#077a15',
            height: normalize(58.5),
            justifyContent: 'center',
            // alignItems: 'center',
        },
        indicatorStyle: {
            backgroundColor: '#fff'
        },
        upperCaseLabel: false,
        labelStyle: {
            fontSize: 16
            // fontSize: normalize(72)
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
        headerTitle: 'Gestor de pedidos',
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         {/* <FontIcon name='bars' size={20} color='#fff' /> */}
        //         {/* <Icon name='menu' size={25} color='#fff' /> */}
        //         <Icon name='menu' size={normalize(25)} color='#fff' />
        //     </ButtonIcon>
        // ),
        headerLeft: () => (
            <RectButton
                onPress={() => navigation.openDrawer()}
                style={{ 
                    // width: '20%',
                    padding: normalize(8), 
                    marginHorizontal: normalize(10), 
                    borderRadius: normalize(50),
                }}
                hitSlop={{ right: 30, left: 30 }}
            >
                <Icon name='menu' size={normalize(25)} color='#fff' />
            </RectButton>
        ),

        headerTitleContainerStyle: {
            // backgroundColor: 'tomato',
            width: '63%',
            position: 'relative',
            justifyContent: 'center',
            // alignItems: 'center',
        },

        // headerRight: () => (
        //     <ButtonIcon
        //         onPress={() => {}}
        //         activeOpacity={.7}
        //     >
        //         <FontIcon name='toggle-off' size={23} color='red' />
        //     </ButtonIcon>
        // )
    }
}

export default HomeTab;