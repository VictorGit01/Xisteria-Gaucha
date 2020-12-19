import React, { useEffect, useState, useRef } from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { StatusBar, AppState } from 'react-native'
import { createAppContainer, NavigationEvents } from 'react-navigation'
import { Provider } from 'react-redux'
import { store, persistor } from './src/Store'
import MainStackNavigator from './src/navigators/MainStackNavigator'
import Notification from './src/services/Notification'
import firebase from './firebase'
// import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage'
// import { notifications } from 'react-native-firebase-push-notifications'
import { fcmService } from './src/services/FCMService'
import { localNotificationService } from './src/services/LocalNotificationService'
import uuid from 'uuid/v4'
import { getUniqueId, getDeviceId } from 'react-native-device-info';

// Contexts:
import ActiveContext from './src/contexts/ActiveContext'
import ToTopContext from './src/contexts/ToTopContext'
import ItemsOrderContext from './src/contexts/ItemsOrderContext'
import LoaderContext from './src/contexts/LoaderContext'
import NotifRequestsContext from './src/contexts/NotifRequestsContext'
import CallHistoryContext from './src/contexts/CallHistoryContext'
import OnScreenContext from './src/contexts/OnScreenContext'
import StatusBarContext from './src/contexts/StatusBarContext'

import NavigationService from './helpers/NavigationService'

// Components:
import Loader from './src/components/Loader'

const AppContainer = createAppContainer(MainStackNavigator)

// const prevGetStateForActionHomeStack = RootStack.router.getStateForAction;
// RootStack.router.getStateForAction = (action, state) => {
//     if (state && action.type === 'ReplaceCurrentScreen') {
//         const routes = state.routes.slice(0, state.routes.length - 1);
//         routes.push(action);
//             return {
//                 ...state,
//                 routes,
//                 index: routes.length - 1,
//             };
//     }
// return prevGetStateForActionHomeStack(action, state);
// };

// // call this function whenever you want to replace a screen
// this.replaceScreen('routename')
// replaceScreen = (route) => {
//     // const { locations, position } = this.props.navigation.state.params;
//     this.props.navigation.dispatch({
//     type: 'ReplaceCurrentScreen',
//     key: route,
//     routeName: route,
//     // params: { locations, position },
//     });
// };

export default (props) => {
    const appState = useRef(AppState.currentState)
    const [ appStateVisible, setAppStateVisible ] = useState(appState.current)

    const [ statusBarTheme, setStatusBarTheme ] = useState({
        barStyle: 'light-content',
        background: '#077a15',
    })
    const [ activeScreen, setActiveScreen ] = useState('foods')
    const [ itemsOrder, setItemsOrder ] = useState(0)
    const [ top, setTop ] = useState(false)
    const [ callHistory, setCallHistory ] = useState(false)
    const [ loaderVisible, setLoaderVisible ] = useState(false)
    const [ tokenLocal, setTokenLocal ] = useState(null)
    const [ notifRequests, setNotifRequests ] = useState({
        requests: 0
    })
    const [ onScreen, setOnScreen ] = useState(false)

    const posts = firebase.database().ref('posts')

    // Notification
    // .configure()

    // useEffect(() => {
    //     const cityId = "1CNnz15smwfBWakyihib3obF4xt1"
    //     const id = "37d84e20-b1ac-4442-a276-9a04ee0426eb"

    //     Notification
    //     .configure()
    //     .localNotification({
    //         message: 'Se inscreva no canal'
    //     })
    //     // console.log('Posts')
    //     // posts.child(cityId).child(id).on('value', snapshot => {
    //     //     if (snapshot.val().publish) {
    //     //         Notification
    //     //         .configure()
    //     //         .localNotification({
    //     //             message: 'Se inscreva no canal'
    //     //         })
    //     //     }
    //     // })
    // }, [firebase])

    // useEffect(() => {
    //     // requestUserPermission();
    // }, [])

    // async function requestUserPermission() {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled =
    //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //     if (enabled) {
    //         console.log('Authorization status: ', authStatus);
    //     }
    // }

    useEffect(() => {
        // console.log('--------------ENTROU_NO_APLICATIVO--------------')
    }, [])

    useEffect(() => {
        // checkPermission()
        // createNotificationListener()

        AsyncStorage.getItem('deviceId')
            .then(id => {
                if (!id) {
                    // let newId = uuid()
                    // let { getUniqueId, getDeviceId } = DeviceInfo
                    let newId = getUniqueId() + getDeviceId()

                    AsyncStorage.setItem('deviceId', newId)
                }
            })
    }, [])

    useEffect(() => {
        fcmService.registerAppWithFCM()
        fcmService.register(onRegister, onNotification, onOpenNotification)
        localNotificationService.configure(onOpenNotification)

        function onRegister(token) {
            // console.log('[App] onRegister: ', token)
            saveToken(token)
        }

        function saveToken(token) {
            AsyncStorage.getItem('notifToken')
                .then(t => {
                    if (!t) {
                        AsyncStorage.setItem('notifToken', token)
                    }
                })
        }

        function onNotification(notify) {
            // console.log('[App] onRegister: ', notify)
            // const options = {
            //     soundName: 'default',
            //     playSound: true
            // }
            // localNotificationService.showNotification(
            //     0,
            //     notify.title,
            //     notify.body,
            //     notify,
            //     options,
            // )
        }

        function onOpenNotification(notify) {
            // console.log('[App] onOpenNotification: ', notify)
            // alert('Open Notification: ' + notify.body)
        }

        return () => {
            // console.log('[App] unRegister')
            fcmService.unRegister()
            localNotificationService.unregister()
        }
    })
    

    // useEffect(() => {
    //     AppState.addEventListener('change', _handleAppStateChange)

    //     return () => {
    //         AppState.removeEventListener('change', _handleAppStateChange)
    //     }
    // }, [])

    // const _handleAppStateChange = (nextAppState) => {
    //     if (
    //         appState.current.match(/inactive|background/) && 
    //         nextAppState === 'active'
    //     ) {
    //         console.log('App has come to the foreground!')
    //         setOnScreen(true)
    //     } else if (
    //         appState.current.match(/active/) && 
    //         nextAppState === 'background'
    //     ) {
    //         // console.log('---------------NEXT_APP_STATE---------------')
    //         // console.log('FORA DA TELA')
    //         setOnScreen(false)
    //     }


    //     appState.current = nextAppState
    //     setAppStateVisible(appState.current)
    //     console.log('AppState', appState.current)
    // }

    // async function createNotificationListener() {
    //     // const token = await notifications.getToken()
    //     // console.log(`Token do dispositivo: ${token}`)

    //     // const notification = await notifications.getInitialNotification()
    //     // console.log('getInitialNotification: ', notification)

    //     // notifications.onNotificationOpened(
    //     //     notification => {
    //     //         console.log('onNotificationOpened', notification)
    //     //     }
    //     // )

    //     // Qunado receber notif. com o app aberto.
    //     notifications.onNotification(notification => {
    //         let titulo = notification.title;
    //         let corpo = notification.body;

    //         alert('ABERTO:\nTITULO: ' + titulo + '\nCORPO: ' + corpo);
    //         console.log('onNotification:')
    //         console.log(notification.data)
    //     })

    //     // Quando o usuário clicar na notificação com o app FECHADO.
    //     notifications.getInitialNotification()
    //         .then(event => {
    //             if (event != null) {
    //                 let titulo = event.notification.data.title;
    //                 let corpo = event.notification.data.body;

    //                 alert('FECHADO:\nTITULO: ' + titulo + '\nCORPO: ' + corpo);
    //                 console.log('FECHADO: TITULO: ' + titulo + 'CORPO: ' + corpo)
    //                 console.log('GetInitialNotification: ')
    //                 console.log(event.notification)
    //             }
    //         })
    // }






    // function checkPermission() {
    //     messaging().hasPermission()
    //         .then((enabled) => {

    //             if (enabled) {
    //                 getToken();
    //             } else {
    //                 requestPermission();
    //             }
    //         })

    //     // if (tokenLocal) {
    //     //     getToken()
    //     // } else {
    //     //     requestPermission()
    //     // }
    // }

    // function requestPermission() {
    //     try {

    //         messaging().requestPermission()
    //             .then(() => {
    //                 getToken()
    //             })

    //     } catch(error) {
    //         alert('ERRO: ' + error.message)
    //         console.log(error)
    //     }
    // }

    // function getToken() {

    //     AsyncStorage.getItem('notifToken')
    //         .then((t) => {

    //             if (!t) {
    //                 messaging().getToken()
    //                     .then((token) => {
    //                         AsyncStorage.setItem('notifToken', token);

    //                         // console.log('Primeira Opção, Token:')
    //                         // console.log(token)
    //                     })
    //             } else {
    //                 // console.log('Segunda Opção, Token:')
    //                 // console.log(t)
    //             }

    //         })

    // }






    // function exibirNotificacao() {
    //     const notif = new notifications.Notification();
    //     notif.setNotificationId('123');
    //     notif.setTitle('Aviso Importante')
    //     notif.setBody('Notificação de teste legal')
    //     // notifications.on
    //     // notifications.android.createChannel
    //     messaging().send
    // }

    const onBack = () => {
        if (loaderVisible) {
            return true
        }
        return false
    }

    return (
        <Provider store={store} >
            {/* <NavigationEvents onWillBlur={() => setOnScreen(true)} /> */}
            <PersistGate loading={null} persistor={persistor} >
                <OnScreenContext.Provider value={[onScreen, setOnScreen]} >
                    <LoaderContext.Provider value={[loaderVisible, setLoaderVisible]} >
                        <NotifRequestsContext.Provider value={[notifRequests, setNotifRequests]} >
                            <ActiveContext.Provider value={[activeScreen, setActiveScreen]} >
                                <ToTopContext.Provider value={[top, setTop]} >
                                    <CallHistoryContext.Provider value={[callHistory, setCallHistory]} >
                                        <StatusBarContext.Provider value={[statusBarTheme, setStatusBarTheme]} >
                                        {/* <ItemsOrderContext value={[itemsOrder, setItemsOrder]} > */}
                                            {/* <StatusBar barStyle='light-content' backgroundColor='#077a15' /> */}
                                            {/* <StatusBar barStyle={statusBarTheme.barStyle} backgroundColor={statusBarTheme.background} /> */}
                                            {/* <NavigationEvents onWillFocus={() => setOnScreen(true)} /> */}
                                            <AppContainer />
                                        {/* </ItemsOrderContext> */}
                                        </StatusBarContext.Provider>
                                    </CallHistoryContext.Provider>
                                </ToTopContext.Provider>
                            </ActiveContext.Provider>
                        </NotifRequestsContext.Provider>
                        {loaderVisible ? <Loader onBack={onBack} /> : null}
                    </LoaderContext.Provider>
                </OnScreenContext.Provider>
            </PersistGate>
        </Provider>
    )
}

// backgroundColor='#075715'