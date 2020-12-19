import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StatusBar } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { normalize } from '../functions';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #077a15; 
`
// background-color: #077a15;
// background-color: #ff3333;

const LogoImage = styled.Image`
    height: ${normalize(190)}px;
    width: ${normalize(190)}px;
`

const Screen = (props) => {
    let { 
        navigation, 
        cityId, 
        list_request, 
        current_requests, 
        setCityId, 
        setListRequest, 
        setCurrentRequests, 
        setListAddress,
        setAddress,
        setSelected,

        setOrderHistory,
        setTotal,
        setDlvFee,
    } = props
    
    // async function changeColor() {
    //     try {
    //         await changeNavigationBarColor('black')
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

    async function changeColor() {
        try {
            // await changeNavigationBarColor('#ff3333')
            // hideNavigationBar()
            // changeNavigationBarColor('#ff3333', true, true)
            changeNavigationBarColor('#077a15', false)
        } catch(e) {
            console.log(e)
        }
    }

    async function navigateTo() {
        // setCityId('')
        // setListAddress([])
        // setAddress({})
        // setSelected('')

        // setListRequest([])
        // setCurrentRequests([])
        // setOrderHistory([])
        // setTotal(0)
        // setDlvFee('')
        firebase.auth().onAuthStateChanged((user) => {
            // setTimeout(() => {
            //     // changeNavigationBarColor('#222222')
                
            //     navigation.dispatch(StackActions.reset({
            //         index: 0,
            //         // key: 'HomeStack',
            //         actions: [
            //             NavigationActions.navigate({routeName: 'SelectCity'})
            //         ]
            //     }))
            //     changeNavigationBarColor('#b9f7bf', true)
                
            // }, 4000)
            if (!cityId) {
                setTimeout(() => {
                    // changeNavigationBarColor('#222222')
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'HomeStack',
                        actions: [
                            NavigationActions.navigate({routeName: 'SelectCity'})
                        ]
                    }))

                    changeNavigationBarColor('#b9f7bf', true)
                }, 4000)
            } else {
                setTimeout(() => {
                    let color = 'rgba(7, 122, 21)'
                    // changeNavigationBarColor('#CC077a15', false)
                    // changeNavigationBarColor('#027510', false)
                    
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'HomeStack',
                        actions: [
                            NavigationActions.navigate({routeName: 'Home'})
                        ]
                    }))

                    changeNavigationBarColor('#077a15', false)
                }, 4000)
            }
        })
    }

    useEffect(() => {
        changeColor()
        // alert(`NORMALIZE 6: ${normalize(6)}`)
        navigateTo()
        
    }, [])

    useEffect(() => {
        console.log(cityId)
    }, [cityId])

    return (
        <Page>
            {/* <StatusBar barStyle='light-content' backgroundColor='#ff3333' /> */}
            <StatusBar barStyle='light-content' backgroundColor='#077a15' />
            <LogoImage source={require('../assets/images/logo.png')} />
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerShown: false
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCityId: (cityId) => dispatch({type: 'SET_CITY_ID', payload: {cityId}}),
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}}),
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}}),
        setListAddress: (list_address) => dispatch({type: 'SET_LIST_ADDRESS', payload: {list_address}}),
        setAddress: (address) => dispatch({type: 'SET_ADDRESS', payload: {address}}),
        setSelected: (selected) => dispatch({type: 'SET_SELECTED', payload: {selected}}),

        setOrderHistory: (order_history) => dispatch({type: 'SET_ORDER_HISTORY', payload: {order_history}}),
        setTotal: (total) => dispatch({type: 'SET_TOTAL', payload: {total}}),
        setDlvFee: (dlvFee) => dispatch({type: 'SET_DLVFEE', payload: {dlvFee}}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)