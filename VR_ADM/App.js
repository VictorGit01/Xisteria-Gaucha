import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { StatusBar } from 'react-native'
import { createAppContainer } from 'react-navigation'
import Store from './src/Store'
import firebase from './firebase'
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage'
import uuid from 'uuid/v4'
import { fcmService } from './src/services/FCMService'
import { localNotificationService } from './src/services/LocalNotificationService'
import { getUniqueId, getDeviceId } from 'react-native-device-info'

// Components:
import Loader from './src/components/Loader'

// Navigators:
import MainStackNavigator from './src/navigators/MainStackNavigator'

// Contexts:
import NotifDeliveryContext from './src/contexts/NotifDeliveryContext'
import NotifPlaceContext from './src/contexts/NotifPlaceContext'
import NotifCanceledContext from './src/contexts/NotifCanceledContext'
import MenuListContext from './src/contexts/MenuListContext'
import DataDetailsContext from './src/contexts/DataDetailsContext'
import ListAddOnsContext from './src/contexts/ListAddOnsContext'
import LoaderContext from './src/contexts/LoaderContext'
import CallUserContext from './src/contexts/CallUserContext'

const AppContainer = createAppContainer(MainStackNavigator)

export default () => {
    const [ listNotif, setListNotif ] = useState(0)
    const [ menuList, setMenuList ] = useState([])
    const [ dataDetails, setDataDetails ] = useState({
        // id: uuid(),
        publish: true,
        name: '',
        price: '',
        description: '',
        image: null,
        // days: [
        //     {id: 0, name: 'Domingo', active: true},
        //     {id: 1, name: 'Segunda', active: true},
        //     {id: 2, name: 'Terça', active: true},
        //     {id: 3, name: 'Quarta', active: true},
        //     {id: 4, name: 'Quinta', active: true},
        //     {id: 5, name: 'Sexta', active: true},
        //     {id: 6, name: 'Sábado', active: true},
        // ]
        days: [
            'Domingo',
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sábado',
        ]
    })
    const [ notifClients, setNotifClients ] = useState({
        clients: 0,
        data: []
    })
    const [ notifDelivery, setNotifDelivery ] = useState({
        delivery: 0,
        data: []
    })
    const [ notifPlace, setNotifPlace ] = useState({
        place: 0,
        data: []
    })
    const [ notifCanceled, setNotifCanceled ] = useState({
        canceled: 0,
        data: []
    })
    const [ listAddOns, setListAddOns ] = useState(null)
    const [ loaderVisible, setLoaderVisible ] = useState(false)
    const [ callUser, setCallUser ] = useState(false)


    const requests = firebase.database().ref('requests')
    const canceled = firebase.database().ref('canceled')

    useEffect(() => {
        // Pedindo permissão de notificação
        const requestNotifPermission = async () => {
            const authStatus = await messaging().requestPermission();
            console.log('Permissão', authStatus);
        }

        requestNotifPermission();

        // Recebendo notificação foreground (app aberto)
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('Recebido no FOREGROUND', remoteMessage);
        });

        return unsubscribe;
    })

    useEffect(() => {
        // checkPermission()
        // Token: dbRiIYTySCCHFXqmA4S8zr:APA91bGv6JdcGcuZmMVdo2kUW3b3O_STIO4oryieq4u93ZmaP3Vyz9W359S7eYDM8_f4TgbLqiGItVRNOPDE3a6UxMD3CSbcwciIoDqGrKTyTal0FyjD366x8Fdtza1bM6YCyC2wayVm
        // getRequests()

        AsyncStorage.getItem('deviceId')
            .then(id => {
                if (!id) {
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
            console.log('[App] onRegister: ', token)
            saveToken(token)
        }

        function saveToken(token) {
            AsyncStorage.getItem('notifToken')
                .then(t => {
                    // if (!t) {
                        AsyncStorage.setItem('notifToken', token)
                    // }
                })
        }

        function onNotification(notify) {
            console.log('[App] onRegister: ', notify)
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
            console.log('[App] onOpenNotification: ', notify)
            // alert('Open Notification: ' + notify.body)
            // alert('Open Notification: ' + notify.obj)
        }

        return () => {
            console.log('[App] unRegister')
            fcmService.unRegister()
            localNotificationService.unregister()
        }
    }, [])

    function checkPermission() {
        messaging().hasPermission()
            .then(enabled => {

                if (enabled) {
                    getToken();
                } else {
                    requestPermission();
                }

            })
    }

    function requestPermission() {
        try {
            messaging().requestPermission()
                .then(() => {
                    getToken()
                })
        } catch(error) {
            console.log(error)
        }
    }

    function getToken()  {

        AsyncStorage.getItem('notifToken')
            .then(t => {
                if (!t) {
                    messaging().getToken()
                        .then(token => {
                            AsyncStorage.setItem('notifToken', token)

                            console.log('Primeira Opção, Token:')
                            console.log(token)
                        })
                } else {
                    console.log('Segunda Opção, Token:')
                    console.log(t)
                }
            })

    }



















    const currentCity = firebase.auth().currentUser
    // const requests = firebase.database().ref('requests')

    

    useEffect(() => {
        console.log('------------------CITY MUDOU DE ESTADO------------------')
        console.log(listNotif)
    }, [])

    function getRequests() {
        if (currentCity) {
            let cityId = currentCity.uid

            return new Promise((resolve, reject) => {
                requests.child(cityId).on('value', snapshot => {
                    if (snapshot) {
                        snapshot.forEach(childItem => {
                            let propertyValues = Object.values(childItem.val())
                            setListNotif(childItem.val().count)
                            resolve(propertyValues)
                        })
                    } else {
                        resolve(null)
                    }
                })
            })
        }
    }

    function getCanceled() {
        if (currentCity) {
            let cityId = currentCity.uid

            return new Promise((resolve, reject) => {
                canceled.child(cityId).on('value', snapshot => {
                    if (snapshot) {
                        snapshot.forEach(childItem => {
                            let propertyValues = Object.values(childItem.val())
                            resolve(propertyValues)
                        })
                    } else {
                        resolve(null)
                    }
                })
            })
        }
    }

    // Notifications Delivery:

    














    

    const onBack = () => {
        if (loaderVisible) {
            return true
        }
        return false
    }

    return (
        <Provider store={Store} >
            <StatusBar barStyle='light-content' backgroundColor='#077a15' />
            <LoaderContext.Provider value={[ loaderVisible, setLoaderVisible ]} >
                <NotifDeliveryContext.Provider value={[ notifDelivery, setNotifDelivery ]} >
                    <NotifPlaceContext.Provider value={[ notifPlace, setNotifPlace ]} >
                        <NotifCanceledContext.Provider value={[ notifCanceled, setNotifCanceled ]} >
                            <MenuListContext.Provider value={[menuList, setMenuList]} >
                                <DataDetailsContext.Provider value={[ dataDetails, setDataDetails ]} >
                                    <ListAddOnsContext.Provider value={[ listAddOns, setListAddOns ]} >
                                        <CallUserContext.Provider value={[ callUser, setCallUser ]} >
                                            <AppContainer/>
                                        </CallUserContext.Provider>
                                    </ListAddOnsContext.Provider>
                                </DataDetailsContext.Provider>
                            </MenuListContext.Provider>
                        </NotifCanceledContext.Provider>
                    </NotifPlaceContext.Provider>
                </NotifDeliveryContext.Provider>
                {loaderVisible ? <Loader onBack={onBack} /> : null}
            </LoaderContext.Provider>
        </Provider>
    )
}