import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StatusBar } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import styled from 'styled-components/native'
import firebase from '../../firebase'
// import changeNavigationBarColor from 'react-native-navigation-bar-color'

const { height, width } = Dimensions.get('window')

function normalize(size) {
    return (width + height) / size
}

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
`

const LogoImage = styled.Image`
    height: ${normalize(6)}px;
    width: ${normalize(6)}px;
`

const Screen = (props) => {
    let { navigation, cityId, setCityId, setListRequest, setCurrentRequests } = props
    // setCityId(undefined)
    // setListRequest([])
    // setCurrentRequests([])
    // async function changeColor() {
    //     try {
    //         await changeNavigationBarColor('black')
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

    async function navigateTo() {
        // firebase.auth().onAuthStateChanged((user) => {
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
                }, 2000)
            } else {
                setTimeout(() => {
                    // changeNavigationBarColor('#222222')
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'HomeStack',
                        actions: [
                            NavigationActions.navigate({routeName: 'Home'})
                        ]
                    }))
                }, 2000)
            }
        // })
    }

    useEffect(() => {
        // changeColor()
        navigateTo()
        
    }, [])

    useEffect(() => {
        console.log(cityId)
    }, [cityId])

    return (
        <Page>
            <StatusBar barStyle='light-content' backgroundColor='#077a15' />
            {/* <LogoImage source={require('../assets/images/logo.png')} /> */}
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
        cityId: state.userReducer.cityId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCityId: (cityId) => dispatch({type: 'SET_CITY_ID', payload: {cityId}}),
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}}),
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)