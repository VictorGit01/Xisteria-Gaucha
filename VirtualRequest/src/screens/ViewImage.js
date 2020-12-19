import React, { useEffect, useState, useRef, useContext } from 'react';
import { StatusBar, Animated, StyleSheet, Image, View, Dimensions, BackHandler } from 'react-native';
import { PinchGestureHandler, PanGestureHandler, State, BorderlessButton } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { normalize, changeTheme } from '../functions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fi from 'react-native-vector-icons/Feather';
import firebase from '../../firebase';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// Contexts:
import StatusBarContext from '../contexts/StatusBarContext';

const { height, width } = Dimensions.get('window');

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    justify-content: center;
    align-items: center;
    background-color: #555;
`

const Header = styled.View`
    width: 100%;
    height: ${normalize(56.5)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    padding-horizontal: ${normalize(12)}px;
    zIndex: 5;
`
// height: 8%;

// const Image = styled.Image`
//     width: 100%;
// `

const Screen = ({ navigation }) => {
    // const [ image, setImage ] = useState(null);
    // const [ opacityImg, setOpacityImg ] = useState(new Animated.Value(0));
    // const [ statusBarTheme, setStatusBarTheme ] = useState({
    //     barStyle: 'light-content',
    //     background: '#555',
    // })
    const [ statusBarTheme, setStatusBarTheme ] = useContext(StatusBarContext);

    // scale = new Animated.Value(1)
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;

    const goBack = navigation.goBack

    // onZoomEventFunction = Animated.event(
    //     [{
    //         nativeEvent: { scale: this.scale }
    //     }],
    //     {
    //         useNativeDriver: true // very imp
    //     }
    // )

    // onZoomStateChangeFunction = (event) => {
    //     if (event.nativeEvent.oldState == State.ACTIVE) {
    //         Animated.spring(this.scale, {
    //             toValue: 1,
    //             useNativeDriver: true // imp line
    //         }).start()
    //     }
    // }

    const handlePinch = Animated.event(
        [{
            nativeEvent: { scale }
        }]
    )

    const handlePan = Animated.event(
        [
            {
                nativeEvent: {
                    translationX: translateX,
                }
            }
        ],
        {
            listener: e => console.log(e.nativeEvent),
            useNativeDriver: true,
        }
    )

    const params = navigation.state.params;
    const { cityId, data, image } = params;
    const posts_img = firebase.storage().ref().child('posts');

    useEffect(() => {
        // let dataId = data.id
        // console.log('------------IMAGE TOP_AREA------------')
        // console.log(img)

        // posts_img.child(cityId).child('items').child(`${dataId}.jpg`).getDownloadURL().then(url => {
        //     const source = { uri: url };

            // setImage(source);

            // Animated.timing(
            //     opacityImg,
            //     {
            //         toValue: 1,
            //         duration: 500
            //     }
            // ).start();
        // })
    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [])

    
    function onScreen() {
        changeTheme('light-content', '#555', setStatusBarTheme)
        changeNavigationBarColor('#555555', false)
    }
    

    function onBack() {
        changeTheme( 'light-content', '#077a15', setStatusBarTheme)
        changeNavigationBarColor('#077a15', false)

        return false
    }

    function onBackHeader() {
        goBack()

        changeTheme( 'light-content', '#077a15', setStatusBarTheme)
        changeNavigationBarColor('#077a15', false)
    }


    return (
        <Page>
            <NavigationEvents onWillFocus={onScreen} />
            {/* <StatusBar barStyle='light-content' backgroundColor='#555' /> */}
            <StatusBar barStyle={statusBarTheme.barStyle} backgroundColor={statusBarTheme.background} />
            {/* <PanGestureHandler onGestureEvent={handlePan} > */}
                <Header>
                    <BorderlessButton 
                        onPress={onBackHeader}
                        style={{ padding: 4 }} 
                        rippleColor='rgba(0, 0, 0, .4)' 
                    >
                        {/* <Fi name='arrow-left' size={23} color='#fff' /> */}
                        <Icon name='arrow-back' size={24} color='#fff' />
                    </BorderlessButton>
                </Header>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <ReactNativeZoomableView
                        maxZoom={1.5}
                        minZoom={1}
                        zoomStep={0.5}
                        initialZoom={1}
                        bindToBorders={true}
                        captureEvent={true}
                        // doubleTapDelay={300}
                    >
                    {/* <PinchGestureHandler
                        // onGestureEvent={this.onZoomEventFunction}
                        onGestureEvent={handlePinch}
                        // onHandlerStateChange={this.onZoomStateChangeFunction}
                    > */}
                        {/* <Animated.Image source={image} style={[ styles.foodImage, { transform: [{ scale: this.scale }] }]} /> */}
                        {/* <Animated.Image source={image} style={[ styles.foodImage, { transform: [{ scale }, { translateX }] }]} /> */}
                        <Image source={image} style={styles.foodImage} />
                    {/* </PinchGestureHandler> */}
                    </ReactNativeZoomableView>
                </View>
            {/* </PanGestureHandler> */}
        </Page>
    )
}

const styles = StyleSheet.create({
    foodImage: {
        width: width,
        height: normalize(300),
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
        // transform: [{ scale: this.scale }]
    }
})

Screen.navigationOptions = ({ navigation }) => {
    const goBack = navigation.goBack

    return {
        // headerTitle: 'Pizza de Calabresa',
        headerStyle: {
            // backgroundColor: '#555',
            // backgroundColor: 'transparent', // NÃO FUNCIONOU
            elevation: 0
        },
        headerTransparent: true,
        headerLeft: () => {
            const [ statusBarTheme, setStatusBarTheme ] = useContext(StatusBarContext);
            
            return <BorderlessButton 
                onPress={() => {
                    goBack()
                    changeTheme( 'light-content', '#077a15', setStatusBarTheme)
                }}
                style={{ marginLeft: normalize(12) }}
                rippleColor='#333' 
            >
                {/* <Icon name='keyboard-arrow-right' size={20} color='#fff' /> */}
                <Icon name='arrow-back' size={normalize(23)} color='#fff' style={{ padding: normalize(4)}} />
            </BorderlessButton>
        }
    }
}

export default Screen;