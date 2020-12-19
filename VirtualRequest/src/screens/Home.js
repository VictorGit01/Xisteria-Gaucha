import React, { useEffect, useState, useContext, useRef } from 'react';
import { connect } from 'react-redux';
import { AppState, Dimensions, StatusBar, StyleSheet, Animated } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { getHistory, normalize } from '../functions';
// import { getHistory } from '../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../firebase';
// import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

// Components:
import LoadingPage from '../components/LoadingPage'
import FooterArea from '../components/Home/FooterArea'
import ListItem from '../components/Home/ListItem'

// Contexts:
import NotifRequestsContext from '../contexts/NotifRequestsContext'
import CallHistoryContext from '../contexts/CallHistoryContext'
import OnScreenContext from '../contexts/OnScreenContext';
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window');

// function normalize(size) {
//     return (width + height) / size;
// }

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    align-items: center;
    background-color: #b9f7bf;
`;

const Scroll = styled.ScrollView`
    width: 100%;
    background-color: #b9f7bf;
`;

const Top = styled.View`
    height: 36.5%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgb(245, 240, 230);
`;
// height: 40%;

const PostImage = styled.Image`
    height: 100%;
    width: 100%;
    resize-mode: stretch;
`;

const Center = styled.View`
    height: 2%;
    width: 100%;
    background-color: #077a15;
`;

const Bottom = styled.View`
    height: 53.5%;
`;
// height: 58%;

// const BottomItem = styled.View`
//     height: ${height / 4.5}px;
//     width: ${width / 2}px;
//     padding: ${normalize(100)}px ${normalize(60)}px;
// `;
// padding: ${normalize(21.24)}px ${normalize(35.4)}px;

const ButtonItem = styled.TouchableOpacity`
    
`

// const BottomItemInner = styled.ImageBackground`
//     height: 100%;
//     width: 100%;
//     justify-content: center;
//     align-items: center;
//     background-color: #ddd;
//     resize-mode: cover;
//     border-radius: 5px;
// `;

// const Overlay = styled.View`
//     flex: 1;
//     width: 100%;
//     justify-content: center;
//     align-items: center;
//     background-color: rgba(7, 122, 21, .2);
//     border-radius: 5px;
// `

// const BottomItemCover = styled.View`
//     height: 100%;
//     width: 100%;
//     background-color: rgba(0, 0, 0, .5);
// `

// const TextTitle = styled.Text`
//     font-size: 18px;
//     font-style: italic;
//     letter-spacing: 1.5px;
//     color: #fff;
// `

const BackBadge = styled.View`
    height: ${normalize(20)}px;
    width: ${normalize(20)}px;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    border-radius: ${normalize(15)}px
    position: absolute;
    right: ${normalize(-5)}px;
    top: ${normalize(-4)}px;
`
// right: 5px;
// top: 6px;
// right: ${normalize(-10)}px;
// top: ${normalize(-10)}px;

const TabBarBadge = styled.View`
    width: ${normalize(16)}px;
    height: ${normalize(16)}px;
    border-radius: ${normalize(10)}px;
    background-color: #f00;
    justify-content: center;
    align-items: center;
`

const TabBarCount = styled.Text`
    font-size: ${normalize(10)}px;
    font-weight: bold;
    color: #fff;
`

const Header = styled.View`
    width: 100%;
    height: 8%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #077a15;
    padding-horizontal: ${normalize(15)}px;
`
// padding-horizontal: ${normalize(75.35)}px;
// border-bottom-width: 1px;
// border-color: #daa520;
// elevation: 1
// margin-bottom: 10px;
// height: ${normalize(20.1948)}px;
// padding-horizontal: ${normalize(75)}px;

const ButtonIcon = styled.TouchableOpacity`
    
    justify-content: center;
    align-items: center;
`
// width: 55px;

const Title = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: 700;
    color: #fff;
`

const Screen = (props) => {
    const appState = useRef(AppState.currentState)
    const [ appStateVisible, setAppStateVisible ] = useState(appState.current)

    const [ list, setList ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ load, setLoad ] = useState(true)
    const [ parentViewX, setParentViewX ] = useState(new Animated.Value(width))

    const [ notifRequests, setNotifRequests ] = useContext(NotifRequestsContext)
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)
    // const [ onScreen, setOnScreen ] = useContext(OnScreenContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const cities = firebase.database().ref('cities')
    const posts = firebase.database().ref('posts')
    const requests = firebase.database().ref('requests')
    const canceled = firebase.database().ref('canceled')
    const posts_img = firebase.storage().ref().child('posts')

    const { 
        navigation, 
        cityId, 
        list_request, 
        current_requests, 
        setCurrentRequests, 
        order_history, 
        setOrderHistory,
        setDlvFee
    } = props
    const nav = navigation.navigate
    // const cityId = 'i9VVHCzKCAPoKFp6uIaOwKxkjIt1'

    // const isFocused = useIsFocused()

    // const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    // function testPush() {
    //     PushNotification.localNotification({
    //         title: 'My Notification Title',
    //         message: 'My Notification Message'
    //     })
    // }

    // useEffect(() => {
    //     PushNotification.configure({
    //         onRegister: function(token) {
    //             console.log('TOKEN: ', token)
    //         },
    //         onNotification: function(notification) {
    //             console.log('NOTIFICATION: ', notification)
    //         },
    //         permissions: {
    //             alert: true,
    //             badge: true,
    //             sound: true,
    //         },
    //         popInitialNotification: true,
    //         requestPermissions: true,
    //     })

    //     testPush()
    // }, [])

    // useEffect(() => {
    //     console.log('------------NA HOME ENTROU------------')
    //     setCallHistory(!callHistory)
    // }, [])

    // const state = { parentViewX: new Animated.Value(width) }

    useEffect(() => {
        slideInParentView()
    }, [])

    function slideInParentView() {
        // Animated.spring(state.parentViewX, { toValue: 0 }).start()
        Animated.spring(parentViewX, { toValue: 0, overshootClamping: true }).start()
    }

    useEffect(() => {
        setLoaderVisible(false)
    }, [])

    useEffect(() => {
        // alert(`NORMALIZE 75: ${normalize(75)}`)
        AppState.addEventListener('change', _handleAppStateChange)

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange)
        }
    }, [])

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) && 
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!')
            // toggleRemoveEnabled()
            // setOnScreen(true)
        }
        //  else if (
        //     appState.current.match(/active/) && 
        //     nextAppState === 'background'
        // ) {
        //     // console.log('---------------NEXT_APP_STATE---------------')
        //     console.log('FORA DA TELA')
        //     // setOnScreen(false)
        // }
        // if (
        //     appState.current.match(/active/) && 
        //     nextAppState === 'background'
        // ) {
        //     console.log('App has come to the background!')
        // } else {
        //     console.log('App has come to the foreground!')
        //     // toggleRemoveEnabled()
        // }




        
        // if (
        //     appState.current.match(/inactive|background/) && 
        //     nextAppState === 'active'
        // ) {
        //     console.log('App has come to the foreground!')
            
        // }
        // if (
        //     !(appState.current.match(/active/)) && 
        //     !(nextAppState === 'background')
        // ) {
        //     console.log('App has come to the foreground!')
        //     // toggleRemoveEnabled()
            
        // }

        // console.log(nextAppState)

        appState.current = nextAppState
        setAppStateVisible(appState.current)
        // console.log('-----------VALOR DE APPSTATE DENTRO DA FUNÇÃO-----------')
        // console.log('AppState', appState.current)
    }

    // useEffect(() => {
    //     console.log('-----------VALOR DE APPSTATEVISIBLE-----------')
    //     console.log(appStateVisible)

    //     // if (appStateVisible === 'active') {
    //     //     // console.log('ESTÁ VISÍVEL')
    //     //     // toggleRemoveEnabled()
    //     // }
    // }, [appStateVisible])

    useEffect(() => {
        if (appStateVisible === 'active') {
            toggleRemoveEnabled()
            // setCallHistory(!callHistory)
            console.log('-------------DEVICE ID HOME-------------')
            console.log(DeviceInfo.getDeviceId())
            // DeviceInfo.getAndroidId().then(resp => {
            //     console.log(resp)
            // })

            console.log('-------------UNIQUE ID HOME-------------')
            console.log(DeviceInfo.getUniqueId())

            // console.log(DeviceInfo.getAndroidIdSync())

            // AsyncStorage.getItem('deviceId')
            // .then(id => {
            //     if (id) {
            //         callNotifReq(id)
            //     }
            // })
        }
    }, [appStateVisible])

    // useEffect(() => {
    //     console.log('-------------VALUE CALL_HISTORY NA HOME-------------')
    //     console.log(callHistory)
    // }, [callHistory])

    function toggleRemoveEnabled() {
        AsyncStorage.getItem('deviceId')
            .then(deviceId => {
                if (deviceId) {
                    console.log('-------------DEVICE ID DEFINED HOME-------------')
                    console.log(deviceId)
                    requests.child(cityId).child(deviceId).once('value').then(snapshot => {
                        // let response;
                        // let remove_enabled;
                        // let key;
                        
                        snapshot.forEach(childItem => {
                            // let response = childItem.val().response;
                            // let remove_enabled = childItem.val().remove_enabled;
                            // let key = childItem.key;
                            
                            if (childItem.val().response >= 3 && !childItem.val().remove_enabled && order_history && order_history.length) {
                                // const remove = true
    
                                requests.child(cityId).child(deviceId).child(childItem.key).child('remove_enabled').set(true)
                                // getHistory(cityId, order_history, setOrderHistory, remove)
                                getHistory(cityId, order_history, setOrderHistory)
                            }
                        })

                    })

                    canceled.child(cityId).child(deviceId).once('value').then(snapshot => {
                        snapshot.forEach(childItem => {
                            if (!childItem.val().remove_enabled) {
                                canceled
                                .child(cityId)
                                .child(deviceId)
                                .child(childItem.key)
                                .child('remove_enabled')
                                .set(true)
                            }
                        })
                    })
                }
            })
    }

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         console.log('-----------UNSUBSCRIBE FOCADO-----------')
    //     })

    //     return () => {
    //         unsubscribe
    //     }
    // }, [navigation])

    // useEffect(() => {
    //     console.log('-----------UNSUBSCRIBE FOCADO-----------')
    //     console.log(isFocused)
    // }, [isFocused])

    function getBannerId() {
        return new Promise((resolve, reject) => {
            cities.child(cityId).child('banner').once('value').then(snapshot => {
                // if (snapshot.val()) {
                    
                    const bannerId = snapshot.val().id
    
                    resolve(bannerId)
                // }})
            })
        })
    }

    useEffect(() => {
        // let bannerId;

        getBannerId().then(bannerId => {
            posts_img.child(cityId).child('banners').child(`${bannerId}.jpg`).getDownloadURL().then(url => {
                const source = { uri: url };
    
                setImage(source)
            })
        })
        

        // console.log('--------BANNER_ID--------')
        // console.log(bannerId)

        // if (bannerId) {
            
        // }
    }, [cityId])

    useEffect(() => {
        cities.child(cityId).on('value', snapshot => {
            if (snapshot.val()) {
                setDlvFee(snapshot.val().deliveryFee)
            }
            // AsyncStorage.getItem('deliveryFee')
            //     .then(dlvFee => {
            //         AsyncStorage.setItem('deliveryFee', snapshot.val().deliveryFee)
            //         // if (!dlvFee) {
            //         // }
            //     })
        })
    }, [cityId])
    
    useEffect(() => {
        let isCancelled = false
        setLoading(true)

        console.log('--------LIST REQUEST EM HOME--------')
        console.log(list_request)

        list_request.map(item => {
            if (item.id == cityId) {
                setCurrentRequests(item.data)
            }
        })

        // console.log(cityId)

        // console.log('------------------LIST_REQUEST------------------')
        // console.log(list_request)

        async function getPosts() {
            await posts.child(cityId).once('value').then(snapshot => {
                try {
                    if (!isCancelled) {
                        let newList = []
                        snapshot.forEach((childItem) => {
                            // console.log(childItem.val())
                            if (childItem.val().publish) {
                                newList.push(childItem.val())
                            }
                        })

                        let seen = {}
                        let newListNotDup = newList.filter(function(entry) {
                            let previous;
                            if (seen.hasOwnProperty(entry.id)) {

                                previous = seen[entry.id]
                                
                                return false
                            }

                            seen[entry.id] = entry

                            return true
                        })

                        setList(newListNotDup)

                        setTimeout(() => {
                            // setLoad(false)
                            setLoading(false)
                        }, 2000)
                    }
                } catch(e) {
                    if (!isCancelled) {
                        console.log(e)
                    }
                }
            })
        }

        getPosts()

        return () => {
            isCancelled = true
        }
    }, [cityId])

    useEffect(() => {
        AsyncStorage.getItem('deviceId')
            .then(id => {
                if (id) {
                    callNotifReq(id)
                }
            })
    }, [cityId, order_history])

    async function callNotifReq(deviceId) {
        const requests = await firebase.database().ref('requests')
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        
        // requests.child(cityId).child(deviceId).on('value', snapshot => {
        //     let listCount = []
        //     let notifRequestsCopy = JSON.parse(JSON.stringify(notifRequests))
        //     let conv_num = num => isNaN(num) ? 0 : Number(num)

        //     snapshot.forEach(childItem => {
        //         let count_user = Number(childItem.val().count_user)
        //         let count_admin = Number(childItem.val().count_admin)
        //         let result = conv_num(count_user) + conv_num(count_admin)

        //         listCount.push(result)
        //     })

        //     let result_count = listCount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

        //     notifRequestsCopy.requests = result_count

        //     setNotifRequests(notifRequestsCopy)
        // })

        // console.log('-----------ORDER_HISTORY_HOME-----------')
        // let listCount = []
        // let notifRequestsCopy = JSON.parse(JSON.stringify(notifRequests))
        // let conv_num = num => isNaN(num) ? 0 : Number(num)

        // order_history.map(item => {
        //     if (item.id == cityId) {
        //         item.data.map(childItem => {
        //             let count_user = Number(childItem.count_user)
        //             let count_admin = Number(childItem.count_admin)
        //             let result = conv_num(count_user) + conv_num(count_admin)

        //             listCount.push(result)
        //         })

        //     }
        // })

        function getCanceled() {
            return new Promise((resolve, reject) => {
                canceled.child(cityId).child(deviceId).once('value').then(snapshot => {
                    let newList = []
                    let result = 0;
                    
                    snapshot.forEach(childItem => {
                        // newList = [ ...newList, childItem.val() ]
                        if (!childItem.val().removed_from_history) {
                            let count_user = Number(childItem.val().count_user)
                            let count_admin = Number(childItem.val().count_admin)
                            result = conv_num(count_user) + conv_num(count_admin)
                        }
        
                        // listCount.push(result)
                    })

                    resolve(result)
                })
            })
        }

        // getCanceled().then(resp => {
        //     resp.map(item => {
        //         console.log('-----------RESP DE GET_CANCELED-----------')
        //         console.log(item.count_admin)
        //     })
        // })


        requests.child(cityId).child(deviceId).once('value').then(snapshot => {
            let listCount = []
            let snapList = []
            let notifRequestsCopy = JSON.parse(JSON.stringify(notifRequests))
            let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
            

            snapshot.forEach(childItem => {
                // let count_user = Number(childItem.val().count_user)
                // let count_admin = Number(childItem.val().count_admin)
                // let result = conv_num(count_user) + conv_num(count_admin)

                // listCount.push(result)


                // if (childItem.val().response >= 3 && !childItem.val().remove_enabled) {
                // if (childItem.val().response >= 3 && !childItem.val().remove_enabled && onScreen) {
                //     setCallHistory(!callHistory)
                //     requests.child(cityId).child(deviceId).child(childItem.key).child('remove_enabled').set(true)
                // }


                // console.log('--------CHILD_ITEM REMOVE--------')
                // console.log(childItem.key)

                snapList.push(childItem.val())
            })

            console.log('-----------SNAPLIST NA HOME-----------')

            const checkOrderHistData = order_history.some(item => item.id === cityId && item.data && item.data.length)

            // if (order_history && order_history.length) {
            if (checkOrderHistData) {
                function findId(id) {
                    return snapList.findIndex(item => item.id == id)
                }
    
                order_history.map((item, index) => {
                    if (item.id == cityId) {
                        item.data.map((childItem, childIndex) => {
                            let posId = findId(childItem.id)
                            
                            if (posId >= 0) {
                                orderHistoryCopy[index].data[childIndex] = snapList[posId]
                            }
                        })
                    }
                })
    
                orderHistoryCopy.map(item => {
                    if (item.id == cityId) {
                        item.data.map(childItem => {
                            let count_user = Number(childItem.count_user)
                            let count_admin = Number(childItem.count_admin)
                            let result = conv_num(count_user) + conv_num(count_admin)
    
                            listCount.push(result)
                        })
                        
                        calculateNotif()
                    }
                })
            } else {
                

                console.log('---------LIST_COUNT ANTES---------')
                console.log(listCount)
                
                getCanceled().then(resp => {
                    listCount.push(resp)

                    snapList.map(item => {
                        let count_user = Number(item.count_user)
                        let count_admin = Number(item.count_admin)
                        let result = conv_num(count_user) + conv_num(count_admin)
        
                        listCount.push(result)
                        // calculateNotif(listCount)
                        
                        console.log('---------LIST_COUNT DEPOIS---------')
                        console.log(resp)

                        // let result_count = listCount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                        // notifRequestsCopy.requests = result_count

                        // setNotifRequests(notifRequestsCopy)
                    })

                    calculateNotif()
                })

            }

            function calculateNotif() {
                let result_count = listCount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)
    
                notifRequestsCopy.requests = result_count
    
                setNotifRequests(notifRequestsCopy)
            }
        })

        // let result_count = listCount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

        // notifRequestsCopy.requests = result_count

        // setNotifRequests(notifRequestsCopy)
    }

    // useEffect(() => {
    //     if (onScreen) {
    //         // AsyncStorage.getItem('deviceId')
    //             // .then(deviceId => {
    //             //     if (deviceId) {
    //             //         requests.child(cityId).child(deviceId).on('value', snapshot => {
    //             //             snapshot.forEach(childItem => {
    //             //                 if (childItem.val().response >= 3 && !childItem.val().remove_enabled && onScreen == true) {
    //             //                     setCallHistory(!callHistory)
    //             //                     requests.child(cityId).child(deviceId).child(childItem.key).child('remove_enabled').set(true)
    //             //                 }
    //             //             })
    //             //         })
    //             //     }
    //             // })
    //     }
    // }, [onScreen])

    

    return (
        <Animated.View style={styles.container, { transform: [{ translateX: parentViewX }] }}>
            <NavigationEvents
                // onWillFocus={() => console.log('------------ON_SCREEN APP------------')}
                // onWillBlur={() => console.log('------------OUT_SCREEN APP------------')}
                // onWillFocus={toggleRemoveEnabled}
            />
            <StatusBar barStyle='light-content' backgroundColor='#077a15' />
            <Header>
                {/* <ButtonIcon
                    onPress={() => nav('Information')}
                    activeOpacity={.7}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <FontIcon name='info-circle' size={normalize(18)} color='#fff' />
                </ButtonIcon> */}
                <BorderlessButton
                    style={{ padding: 7 }}
                    rippleColor='rgba(0, 0, 0, .4)'
                    onPress={() => nav('Information')}
                    activeOpacity={.7}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <FontIcon name='info-circle' size={normalize(18)} color='#fff' />
                </BorderlessButton>
                <ButtonIcon style={{ width: normalize(18) }} />

                <Title style={{ marginHorizontal: normalize(32) }} >Xisteria Gaúcha</Title>
                {/* <Title style={{ marginHorizontal: 32 }} >Current state is: {appStateVisible}</Title> */}
                {/* <ButtonIcon style={{ width: 18 }} /> */}
                
                {/* <ButtonIcon
                    onPress={() => nav('ChooseAddress', { resume: false })}
                    // onPress={() => getHistory(cityId, order_history, setOrderHistory)}
                    ativeOpacity={.7}
                    // style={{ marginRight: -2.5 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <FontIcon name='map-marker-alt' size={normalize(18)} color='#fff' />
                </ButtonIcon> */}
                <BorderlessButton
                    onPress={() => nav('ChooseAddress', { resume: false })}
                    style={{ padding: 7 }}
                    rippleColor='rgba(0, 0, 0, .4)'
                    // activeOpacity={.7}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <FontIcon name='map-marker-alt' size={normalize(18)} color='#fff' />
                </BorderlessButton>
                <BorderlessButton
                    onPress={() => nav('History')}
                    style={{ padding: 7 }}
                    rippleColor='rgba(0, 0, 0, .4)'
                    hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
                >
                    <FontIcon name='history' size={normalize(18)} color='#fff' />
                    {notifRequests.requests > 0 &&
                    <BackBadge>
                        <TabBarBadge>
                            {/* <TabBarCount>{notifRequests.requests}</TabBarCount> */}
                            <TabBarCount>{notifRequests.requests}</TabBarCount>
                        </TabBarBadge>
                    </BackBadge>}
                </BorderlessButton>
            </Header>
            <Top>
                {/* <PostImage source={{ uri: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg' }} /> */}
                {!loading && <PostImage source={image} />}
            </Top>
            <Center></Center>
            <Bottom>
                {!loading ?
                <>
                <Scroll
                    // contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingVertical: normalize(230) }}
                    // contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingVertical: normalize(4.91) }}
                    contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingVertical: normalize(5) }}
                >
                    {/* {list.map((item, index) => (
                        <BottomItem key={index} >
                            
                            <ButtonItem
                                onPress={() => nav('InfoCategory', { title: item.title, id: item.id, index: index })}
                                activeOpacity={.9}
                            >
                                <BottomItemInner borderRadius={5} source={{ uri: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg' }} >
                                <Overlay>
                                    <TextTitle>{item.title}</TextTitle>
                                </Overlay>
                                </BottomItemInner>
                            </ButtonItem>
                            
                        </BottomItem>
                    ))} */}

                    {list.map((item, index) => <ListItem key={index} cityId={cityId} item={item} index={index} nav={nav} />)}
                </Scroll>
                <FooterArea nav={nav} />
                </> : <LoadingPage height='100%' />}
            </Bottom>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: height,
        alignItems: 'center',
        backgroundColor: '#b9f7bf',
        // transform: [{ translateX: state.parentViewX }]
    },
})


// const useNavOptions

Screen.navigationOptions = () => {
    // const nav = navigation.navigate;

    // const ButtonIcon = styled.TouchableOpacity`
    //     height: 100%;
        
    //     justify-content: center;
    //     align-items: center;
    //     padding-horizontal: 15px;
    // `;
    // width: 60px;

    return {
        headerShown: false,
        // headerTitle: 'Xisteria Gaúcha',
        // headerLeft: () => {
        //     return (
        //         <ButtonIcon
        //             // onPress={() => nav('Information')}
        //             onPress={() => {
        //                 console.log('--------------------VALOR DE LOAD--------------------')
        //                 console.log(par)
        //             }}
        //         >
        //             <FontIcon name='info-circle' size={18} color='#fff' />
        //             {/* <TextTitle></TextTitle> */}
        //         </ButtonIcon>
        // )},
        
        // headerRight: () => {
        //     return (
        //         <>
        //             <ButtonIcon
        //                 onPress={() => nav('ChooseAddress', { resume: false })}
        //                 ativeOpacity={.7}
        //                 style={{ right: -2.5 }}
        //             >
        //                 <FontIcon name='map-marker-alt' size={18} color='#fff' />
        //             </ButtonIcon>
        //             <ButtonIcon
        //                 // onPress={() => nav('History')}
        //                 onPress={() => {
        //                     console.log('----------------NOTIFICAÇÃO----------------')
        //                     console.log(notifReq)
        //                 }}
        //                 activeOpacity={.7}
        //                 style={{ left: -2.5 }}
        //             >
        //                 <FontIcon name='history' size={18} color='#fff' />
        //                 <BackBadge>
        //                     <TabBarBadge>
        //                         {/* <TabBarCount>{notifRequests.requests}</TabBarCount> */}
        //                         <TabBarCount>{notifReq}</TabBarCount>
        //                     </TabBarBadge>
        //                 </BackBadge>
        //             </ButtonIcon>
        //         </>
        //     )
        // },
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests,
        order_history: state.requestReducer.order_history,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}}),
        setDlvFee: (dlvFee) => dispatch({type: 'SET_DLVFEE', payload: {dlvFee}}),
        setOrderHistory: (order_history) => dispatch({type: 'SET_ORDER_HISTORY', payload: { order_history }}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);