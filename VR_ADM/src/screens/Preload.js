import React, { useEffect, useState } from 'react'
import { Dimensions, StatusBar } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import styled from 'styled-components/native'
import firebase from '../../firebase'
// import changeNavigationBarColor from 'react-native-navigation-bar-color'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color'

const { height, width } = Dimensions.get('window')
const statusBarHeight = ExtraDimensions.getStatusBarHeight()
const softMenuBarHeight = ExtraDimensions.getSoftMenuBarHeight()

function normalize(size) {
    return (width + height) / size
}

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    padding-top: ${statusBarHeight}px;
    padding-bottom: ${softMenuBarHeight}px;
`

const LogoImage = styled.Image`
    height: ${normalize(6)}px;
    width: ${normalize(6)}px;
`

const Screen = (props) => {
    let { navigation } = props

    // async function changeColor() {
    //     try {
    //         await changeNavigationBarColor('black')
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

    function navigateTo() {
        hideNavigationBar()
        StatusBar.setHidden(true)

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setTimeout(async () => {
                    // changeNavigationBarColor('#222222')
                    await navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'HomeDrawer',
                        actions: [
                            NavigationActions.navigate({routeName: 'HomeDrawer'})
                        ],
                    }))

                    StatusBar.setHidden(false)
                    showNavigationBar()
                }, 4000)
            } else {
                setTimeout(async () => {
                    // changeNavigationBarColor('#222222')
                    await navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'Login',
                        actions: [
                            NavigationActions.navigate({routeName: 'Login'})
                        ]
                    }))

                    StatusBar.setHidden(false)
                    showNavigationBar()
                }, 4000)
            }
        })
    }

    useEffect(() => {
        // changeColor()
        console.log('ALTURA REAL DA STATUS BAR')
        console.log(statusBarHeight)
        console.log('ALTURA REAL DA BARRA DE NAVEGAÇÃO')
        console.log(softMenuBarHeight)
        navigateTo()
    }, [])

    return (
        <Page>
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

export default Screen