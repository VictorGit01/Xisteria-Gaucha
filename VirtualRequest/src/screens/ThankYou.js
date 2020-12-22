import React, { useEffect, useState, useContext } from 'react';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { normalize } from '../functions'
import styled from 'styled-components/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// Components:
// import HandlerBack from '../components/HandlerBack';

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding-horizontal: ${normalize(10)}px;
`;

const Title = styled.Text`
    font-size: ${normalize(30)}px;
    color: #077a15;
    margin-bottom: ${normalize(20)}px;
`;

const SubTitle = styled.Text`
    font-size: ${normalize(18)}px;
    text-align: center;
    line-height: ${normalize(30)}px;
`;

const ButtonArea = styled.View`
    width: 100%;
    padding-horizontal: ${normalize(10)}px;
    margin-top: ${normalize(40)}px;
`;

const ButtonChoose = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-top: ${normalize(40)}px;
`;

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    color: #fff;
`;

const Screen = ({ navigation }) => {
    const [ statusBarTheme, setStatusBarTheme ] = useState({
        barStyle: 'dark-content',
        background: '#fff'
    })

    const popToTop = navigation.popToTop
    const nav = navigation.navigate

    // useEffect(() => {
    //     console.log(`Valor de toHome ${toHome}`)
    // }, [toHome])

    // const onBack = () => {
    //     if (toHome) {
    //         alert('Tá funcionando!')

    //         return true;
    //     };

    //     return false;
    // }

    function onBack() {
        return true
    }

    useEffect(() => {
        changeNavigationBarColor('#ffffff')
    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [])

    // useEffect(() => {
    //     setToHome(true)
    // }, [])

    function navToHome() {
        changeTheme()
        // popToTop()
        navigation.dispatch(StackActions.reset({
            index: 0,
            // key: 'HomeStack',
            actions: [
                NavigationActions.navigate({routeName: 'Home'})
            ]
        }))
        changeNavigationBarColor('#077a15')
    }

    async function navToHistory() {
        // popToTop()
        // nav('History')
        await navigation.dispatch(StackActions.reset({
            index: 0,
            // key: 'HomeStack',
            actions: [
                NavigationActions.navigate({
                    // routeName: 'History', 
                    routeName: 'Home', 
                    // params: { fromThankYou: true }
                })
            ]
        }))
        
        nav('History')
        changeTheme()
        changeNavigationBarColor('#077a15')
    }

    function changeTheme() {
        let newStatusBarTheme = {
            barStyle: 'light-content',
            background: '#077a15'
        }

        setStatusBarTheme(newStatusBarTheme)
    }
    
    return (
        <Page>
            {/* <HandlerBack onBack={onBack} > */}
                <StatusBar barStyle={statusBarTheme.barStyle} backgroundColor={statusBarTheme.background} />
                <Title>Obrigado!</Title>
                <SubTitle>
                    Agradecemos pela preferência.{'\n'}
                    Seu pedido será analisado em instantes!
                </SubTitle>
                <ButtonArea>
                    <ButtonChoose 
                        // onPress={() => setToHome(false)} 
                        onPress={navToHistory} 
                        style={{
                            marginBottom: normalize(10)
                        }}
                        underlayColor='#e5921a'
                    >
                        <ButtonText>Ver meu pedido</ButtonText>
                    </ButtonChoose>

                    <ButtonChoose 
                        onPress={navToHome} 
                        style={{
                            marginTop: normalize(10)
                        }}
                        underlayColor='#e5921a'
                    >
                        <ButtonText>Voltar para Home</ButtonText>
                    </ButtonChoose>

                    {/* <ButtonChoose 
                        onPress={changeTheme} 
                        style={{
                            marginTop: 10
                        }}
                        underlayColor='#e5921a'
                    >
                        <ButtonText>Mudar o tema</ButtonText>
                    </ButtonChoose> */}
                </ButtonArea>
            {/* </HandlerBack> */}
        </Page>
    );
}

Screen.navigationOptions = () => {
    return {
        headerShown: false,
    }
}

export default Screen;