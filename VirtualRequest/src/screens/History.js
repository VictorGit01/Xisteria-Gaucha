import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { FlatList, BackHandler, View, StatusBar, Animated, StyleSheet, Dimensions } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import { normalize, getHistory } from '../functions'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../firebase'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from '@react-native-community/netinfo'

// Contexts:
import ToTopContext from '../contexts/ToTopContext'
import CallHistoryContext from '../contexts/CallHistoryContext'
import OnScreenContext from '../contexts/OnScreenContext'
import LoaderContext from '../contexts/LoaderContext'

// Components:
import ListItem from '../components/History/ListItem'
import LoadingPage from '../components/LoadingPage'
import ModalItemQues from '../components/History/ModalItemQues'
import ModalCancel from '../components/History/ModalCancel'
import ModalDelete from '../components/History/ModalDelete'
import NoConnection from '../components/NoConnection'

const { height, width } = Dimensions.get('window')

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
`

const Header = styled.View`
    width: 100%;
    height: ${normalize(56.5)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #077a15;   
`
// padding-horizontal: ${normalize(15)}px;
// height: 8%;

const Title = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: 700;
    color: #fff;
`

const ButtonNoNet = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    padding-horizontal: ${normalize(20)}px;
`
// height: ${normalize(24)}px;

const TextButton = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: bold;
    color: #fff;
`

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const Screen = (props) => {
    const [ list, setList ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ snapList, setSnapList ] = useState(null)
    const [ itemQuesVisible, setItemQuesVisible ] = useState(false)
    const [ cancelVisible, setCancelVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ itemHistory, setItemHistory ] = useState({})
    const [ indexHistory, setIndexHistory ] = useState(0)
    const [ parentViewX, setParentViewX ] = useState(new Animated.Value(width))

    const [ top, setTop ] = useContext(ToTopContext)
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)
    const [ onScreen, setOnScreen ] = useContext(OnScreenContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const { 
        navigation, 
        cityId, 
        order_history, 
        setOrderHistory,
    } = props
    const nav = navigation.navigate
    const goBack = navigation.goBack
    const params = navigation.state.params
    const requests = firebase.database().ref('requests')
    const canceled = firebase.database().ref('canceled')

    function getRequests(deviceId) {
    //     // setOrderHistory([])
    //     console.log('---------------HISTORY---------------')
    //     requests.child(cityId).child(deviceId).on('value', snapshot => {
    //         let newList = []
    //         let orderHistoryCopy = []

    //         snapshot.forEach(childItem => {
    //             // order_history.map(item => )
    //             let childItemCopy = JSON.parse(JSON.stringify(childItem.val()))
    //             childItemCopy.pushId = childItem.key
    //             childItemCopy.deviceId = deviceId
    //             newList.push(childItemCopy)
    //             // console.log(childItemCopy)
    //         })

    //         setSnapList(newList)
    //         // console.log('-----------ORDER_HISTORY BEFORE-----------')
    //         // console.log(orderHistoryCopy)
    //         if (order_history && order_history !== undefined) {
    //             function findId(id) {
    //                 return newList.findIndex(item => item.id == id)
    //             }
    
    //             // console.log('Ele é:')
    //             // console.log(order_history)
    //             order_history.filter((item, index) => {
    //                 console.log(`Item número: ${index}`)
    //                 let posId = findId(item.id)
                    
    //                 if (posId >= 0) {
    //                     orderHistoryCopy[index] = newList[posId]
    //                 } else {
    //                     orderHistoryCopy[index] = item
    //                 }
    //             })
    //         }

    //         console.log('-----------ORDER_HISTORY AFTER-----------')
    //         console.log(orderHistoryCopy)

    //         // setList(newList)
    //         setList(orderHistoryCopy)
    //     })
    }

    // useEffect(() => {
    //     setTop(true)

    //     AsyncStorage.getItem('deviceId')
    //         .then(id => {
    //             if (id) {
    //                 getRequests(id)
    //             }
    //         })
    // }, [order_history, cityId])

    useEffect(() => {
        if (params && params.fromThankYou) {
            slideInParentView()
        }

        console.log('-----------PARAMETROS DE THANK YOU-----------')
        console.log(params)
        if (params && params.fromThankYou) {
            console.log('-----------FROM THANK YOU É VERDADEIRO-----------')
        }
    }, [])

    function slideInParentView() {
        // Animated.spring(state.parentViewX, { toValue: 0 }).start()
        Animated.spring(parentViewX, { toValue: 0, overshootClamping: true }).start()
    }

    useEffect(() => {
        console.log('-----------LIST ORDER HISTORY VALUE-----------')
        console.log(order_history)
        console.log('-----------LIST LOCAL VALUE-----------')
        console.log(list)
    }, [order_history])

    useEffect(() => {
        // setTop(true)

        // AsyncStorage.getItem('deviceId')
        //     .then(deviceId => {
        //         if (deviceId) {
        //             console.log('---------------HISTORY---------------')
        //             requests.child(cityId).child(deviceId).on('value', snapshot => {
        //                 let newList = []
        //                 let orderHistoryCopy = []
        //                 let pushId = ''
        //                 // setOrderHistory([])
            
        //                 snapshot.forEach(childItem => {
        //                     // order_history.map(item => )
        //                     let childItemCopy = JSON.parse(JSON.stringify(childItem.val()))
        //                     childItemCopy.pushId = childItem.key
        //                     childItemCopy.deviceId = deviceId
        //                     newList.push(childItemCopy)
        //                     // console.log(childItemCopy)
        //                     pushId = childItem.key
        //                 })
            
        //                 setSnapList(newList)

        //                 // console.log('-----------COND_HISTORY-----------')
        //                 // console.log(order_history)
        //                 // order_history.map(item => {
        //                 //     console.log(item.data)
        //                 // })
        //                 // console.log('-----------NEW_LIST-----------')
        //                 // console.log(newList)

        //                 // condHist
        //                 // console.log('-----------ORDER_HISTORY BEFORE-----------')
        //                 // console.log(orderHistoryCopy)
        //                 if (order_history && order_history !== undefined) {
        //                     orderHistoryCopy = JSON.parse(JSON.stringify(order_history))

        //                     function findId(id) {
        //                         return newList.findIndex(item => item.id == id)
        //                     }

        //                     // console.log('-----------ORDER_HISTORY_COPY-----------')
        //                     // if (orderHistoryCopy.length) {

        //                     // }
        //                     orderHistoryCopy.map((item, index) => {
        //                         if (item.id == cityId) {
        //                             // console.log('-----------DENTRO DE ITEM-----------')
        //                             item.data.map((childItem, childIndex) => {
        //                                 let posId = findId(childItem.id)
        //                                 if (posId >= 0 ) {
        //                                     // console.log(`PosId número: ${posId}`)
        //                                     orderHistoryCopy[index].data[childIndex] = newList[posId]
        //                                     // console.log(orderHistoryCopy[index].data[childIndex])
        //                                     // console.log(newList[posId])
        //                                 } 
        //                                 // else {
        //                                 //     // console.log('-----------CHILDITEM_ANTES-----------')
        //                                 //     // console.log(childItem)
        //                                 //     childItem.deviceId = deviceId
        //                                 //     childItem.pushId = pushId
        //                                 //     // console.log('-----------CHILDITEM_DEPOIS-----------')
        //                                 //     // console.log(childItem)
        //                                 //     orderHistoryCopy[index].data[childIndex] = childItem
        //                                 // }
        //                                 childItem.deviceId = deviceId
        //                                 childItem.pushId = pushId
        //                                 // else {
        //                                 //     console.log('-----------SEGUNDA_OPÇÃO-----------')
        //                                 //     orderHistoryCopy[index].data[childIndex] = newList[posId]
        //                                 // }
        //                                 //  else {
        //                                 //     // orderHistoryCopy[index] = item
        //                                 //     let itemCopy = item.data.map(item => { 
        //                                 //         item.pushId = pushId
        //                                 //         item.deviceId = deviceId
        //                                 //         return item
        //                                 //     })
        //                                 //     // orderHistoryCopy[index].data
        //                                 //     // childItem.pushId = pushId
        //                                 //     // childItem.deviceId = deviceId
        //                                 //     // console.log(orderHistoryCopy[index])
        //                                 // }

        //                                 // console.log(orderHistoryCopy[index])
        //                             })

        //                             // setOrderHistory(orderHistoryCopy)
        //                             setList(orderHistoryCopy[index].data)
        //                         }
        //                     })
        //                     // order_history.filter((item, index) => {
        //                     //     if (item.id == cityId) {
        //                     //         // let posId = findId(item.id)
        //                     //         item.data.map((childItem, childIndex) => {
        //                     //             let posId = findId(childItem.id)
        //                     //             console.log(`PosId número: ${posId}`)
        //                     //             if (posId >= 0 ) {
        //                     //                 // orderHistoryCopy[index].data[childIndex] = newList[posId]
        //                     //                 orderHistoryCopy[index].data[childIndex] = newList[posId]
        //                     //             } else {
        //                     //                 // orderHistoryCopy[index] = item
        //                     //                 orderHistoryCopy[index] = item.data
        //                     //             }
        //                     //         })

        //                     //         setList(orderHistoryCopy[index].data)
        //                     //         // setList(orderHistoryCopy)
        //                     //         console.log('-----------ORDER_HISTORY AFTER-----------')
        //                     //         console.log(orderHistoryCopy[index].data)
        //                     //     }
        //                     // })
        //                 }
            
        //                 // orderHistoryCopy.map(item => {
        //                 //     console.log(item.data)
        //                 // })
            
        //                 // setList(newList)
                        
        //             })
        //         }
        //     })
    }, [order_history, cityId])
    // }, [cityId])

    useEffect(() => {
        setLoading(true);
        // setLoaderVisible(false)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                endOfLoading();
            } else {
                // setTop(true)

                callGetHistory(order_history)

                // getHistory(cityId, order_history, setOrderHistory).then(async resp => {
                //     // setList(resp)
                //     console.log('-----------GET_HISTORY-----------')
                //     console.log(resp)

                //     setList(await resp)

                //     endOfLoading()
                // })
                
                // console.log(getHistory(cityId, order_history, setOrderHistory))

            }
        })
        // getHistory();
    }, [cityId, callHistory])

    function callGetHistory(otherOrderHistory) {
        setTop(true)

        getHistory(cityId, otherOrderHistory, setOrderHistory).then(async resp => {
            // setList(resp)
            // console.log('-----------GET_HISTORY-----------')
            // console.log(resp)
            // resp.map(item => {
            //     if (item.cancellationDate == "2020-11-18T16:02:56.149Z") {
            //         console.log('------------É ESTA DATA AQUI------------')
            //         console.log(item.cancellationDate)
            //     }
            // })

            setList(await resp)

            endOfLoading()
        })
    }

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         console.log('-----------UNSUBSCRIBE FOCADO-----------')
    //     })

    //     return unsubscribe
    // }, [navigation])

    function onBack() {
        if (itemQuesVisible || cancelVisible || deleteVisible) {
            setItemQuesVisible(false)
            setCancelVisible(false)
            setDeleteVisible(false)
            return true
        }

        return false
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [itemQuesVisible, cancelVisible, deleteVisible])

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function getCanceled() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('deviceId')
                .then(deviceId => {
                    canceled.child(cityId).child(deviceId).on('value', snapshot => {
                        let newList = []
                        snapshot.forEach(childItem => {
                            if (!childItem.val().removed_from_history) {
                                let newChildItem = JSON.parse(JSON.stringify(childItem.val()))
                                newChildItem.response = 5
                                newList = [ ...newList, newChildItem ]
                            }
                        })
                        resolve(newList)
                    })
                })
        })
    }

    // function getHistory() {
    //     setTop(true)

    //     AsyncStorage.getItem('deviceId')
    //         .then(deviceId => {
    //             if (deviceId) {
                    
    //                 requests.child(cityId).child(deviceId).on('value', snapshot => {
    //                     let newList = []
    //                     // let orderHistoryCopy = []
    //                     let condOrderHistory = (order_history && order_history.length) ? order_history : []
    //                     let orderHistoryCopy = JSON.parse(JSON.stringify(condOrderHistory))
    //                     let pushId = ''
    //                     // setOrderHistory([])
            
    //                     snapshot.forEach(childItem => {
    //                         let childItemCopy = JSON.parse(JSON.stringify(childItem.val()))
    //                         childItemCopy.pushId = childItem.key
    //                         childItemCopy.deviceId = deviceId
    //                         newList.push(childItemCopy)
    //                         pushId = childItem.key
    //                     })
            
    //                     // setSnapList(newList)

    //                     // if (order_history && order_history !== undefined) {
    //                     // console.log('---------DENTRO DE ORDER HISTORY TEMOS:---------')
    //                     // console.log(order_history)

    //                     // order_history.map(item => {
    //                     //     if (item.id === cityId) {
    //                     //         orderHistData = item.data
    //                     //     }
    //                     // })

    //                     // const checkOrderHistData = order_history.some(item => {
    //                     //     return (item.id === cityId && item.data && item.data.length)
    //                     // })
    //                     const checkOrderHistData = order_history.some(item => item.id === cityId && item.data && item.data.length)

    //                     console.log(checkOrderHistData)

    //                     // if (orderHistData && orderHistData.length) {
    //                     if (checkOrderHistData) {
    //                         console.log('---------IRÁ APARECER AQUI SE NÃO ESTIVER VAZIO:---------')
    //                     }

    //                     // if (order_history && order_history.length) {
    //                     // if (orderHistData && orderHistData.length) {
    //                     if (checkOrderHistData) {
    //                         // if (newOrderHistory) {
    //                         //     orderHistoryCopy = JSON.parse(JSON.stringify(newOrderHistory))
    //                         // } else {
    //                         //     orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
    //                         // }


                            
    //                         // orderHistoryCopy = JSON.parse(JSON.stringify(order_history))

    //                         function findId(id) {
    //                             return newList.findIndex(item => item.id == id)
    //                         }

    //                         orderHistoryCopy.map((item, index) => {
    //                             if (item.id == cityId) {
    //                                 // console.log('-----------DENTRO DE ITEM-----------')
    //                                 item.data.map((childItem, childIndex) => {
    //                                     let posId = findId(childItem.id)
    //                                     if (posId >= 0 ) {
    //                                         orderHistoryCopy[index].data[childIndex] = newList[posId]
    //                                     } 
    //                                     // childItem.deviceId = deviceId
    //                                     // childItem.pushId = pushId

    //                                 })

    //                                 console.log('----------Date----------')
    //                                 let newData = item.data.map(itemMap => {
    //                                     let dateList = itemMap.date.split('/')

    //                                     let newDateList = dateList.map(childItem => {
    //                                         return Number(childItem)
    //                                     })
    //                                     // console.log(new Date(item.date))
    //                                     let newDate = newDateList.join('/');
    //                                     let pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    //                                     // let arrayDate = newDate.match(pattern);
    //                                     let arrayDate = itemMap.date.match(pattern);
    //                                     let dt = new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1]);
    //                                     // console.log(typeof dt.toString())

    //                                     // itemMap.unformattedDate = dt.toISOString()
    //                                     // itemMap.unformattedDate = itemMap.time
    //                                     itemMap.unformattedDate = new Date(itemMap.unformattedDate)

    //                                     // console.log(new Date(itemMap.unformattedDate))

    //                                     return itemMap
    //                                 })
    //                                 // console.log(newData)
    //                                 const sortedData = newData.slice().sort((a, b) => {
    //                                     return b.unformattedDate - a.unformattedDate
    //                                 })
    //                                 console.log(sortedData)

    //                                 let seen = {}
    //                                 let sortedDataNotDup = sortedData.filter(function(entry) {
    //                                     let previous;
    //                                     if (seen.hasOwnProperty(entry.id)) {

    //                                         previous = seen[entry.id]
                                            
    //                                         return false
    //                                     }

    //                                     seen[entry.id] = entry

    //                                     return true
    //                                 })

    //                                 orderHistoryCopy[index].data = sortedDataNotDup

    //                                 setList(sortedDataNotDup)
    //                                 setOrderHistory(orderHistoryCopy)
    //                                 // let orderedList = orderHistoryCopy[index].data
    //                                 // setList(orderedList)

    //                                 // console.log('---------SORTED DATA---------')
    //                                 // console.log(sortedData)

    //                                 // console.log('---------ORDER_HISTORY_COPY---------')
    //                                 // console.log(item.data)
    //                             }

                                
    //                         })
    //                     } else {
    //                         console.log('---------------NEW LIST BEFORE---------------')
    //                         console.log(newList)
    //                         getCanceled().then(resp => {
    //                             // orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
    //                             console.log('---------------HISTORY_NEW_ORDER_HISTORY---------------')
    //                             console.log(resp)

    //                             newList = [ ...newList, ...resp ]

    //                             console.log('---------------NEW LIST DESORDENADA---------------')
    //                             console.log(newList)

    //                             const sortedData = newList.slice().sort((a, b) => {
    //                                 return new Date(b.unformattedDate) - new Date(a.unformattedDate)
    //                             })

    //                             let seen = {}
    //                             let sortedDataNotDup = sortedData.filter(function(entry) {
    //                                 let previous;
    //                                 if (seen.hasOwnProperty(entry.id)) {

    //                                     previous = seen[entry.id]
                                        
    //                                     return false
    //                                 }

    //                                 seen[entry.id] = entry

    //                                 return true
    //                             })

    //                             setList(sortedDataNotDup)
    //                             console.log('---------NEW LIST ORDENADA---------')
    //                             // console.log(snapshot.val())
    //                             console.log(sortedDataNotDup)
    //                             console.log('---------ORDER_HISTORY_COPY BEFORE---------')
    //                             console.log(orderHistoryCopy)
    //                             if (!orderHistoryCopy.some(item => item.id == cityId)) {
    //                                 orderHistoryCopy.push({
    //                                     id: cityId,
    //                                     // data: newList,
    //                                     data: sortedDataNotDup,
    //                                 })
    //                             }
    //                             console.log('---------ORDER_HISTORY_COPY AFTER---------')
    //                             console.log(orderHistoryCopy)
    //                             setOrderHistory(orderHistoryCopy)
    //                         })
    //                     }

    //                     // setList(newList)
    //                     console.log('---------FIM DA LISTA---------')
    //                     console.log(newList)
                        
                        
                        

    //                     endOfLoading()
    //                 })
    //             }
    //         })
    // }

    // function inScreen() {
        
    // }

    useEffect(() => {
        console.log('-------------VALUE CALL_HISTORY-------------')
        console.log(callHistory)
    }, [callHistory])

    function toggleRemoveEnabled() {
    //     AsyncStorage.getItem('deviceId')
    //         .then(deviceId => {
    //             if (deviceId) {
    //                 requests.child(cityId).child(deviceId).once('value').then(snapshot => {
    //                     snapshot.forEach(childItem => {
    //                         if (childItem.val().response >= 3 && !childItem.val().remove_enabled) {
    //                             setCallHistory(!callHistory)
    //                             requests.child(cityId).child(deviceId).child(childItem.key).child('remove_enabled').set(true)
    //                         }
    //                     })
    //                 })
    //             }
    //         })
    }


    useEffect(() => {
    //     let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
    //     console.log('----------LIST_HISTORY_COPY----------')
        
    //     orderHistoryCopy.map(item => {
    //         if (item.id == cityId) {
    //             item.data = list
    //             console.log(item.data)
    //             return item
    //         }
    //     })

    //     setOrderHistory(orderHistoryCopy)
    //     console.log('----------LIST_NORMAL----------')
    //     console.log(list)
    // }, [list])
    }, [])

    useEffect(() => {
        // let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
        // console.log('----------ORDER_HISTORY_LIST----------')
        // // console.log(list)
        // if (order_history && list) {
        //     let dataOrderHistory = []
        //     order_history.map(item => {
        //         if (item.id == cityId) {
        //             dataOrderHistory = item.data
        //         }
        //     })

        //     list.map((item, index) => {
        //         dataOrderHistory[index] = item
        //     })

        //     order_history.map((item, index) => {
        //         if (item.id == cityId) {
        //             orderHistoryCopy[index].data = dataOrderHistory
        //         }
        //     })
            
        //     setOrderHistory(orderHistoryCopy)
        //     console.log(orderHistoryCopy)
        // }
    }, [])

    function conditionStyleAnimated() {
        if (params && params.fromThankYou) {
            return styles.container, { transform: [{ translateX: parentViewX }] }
        } else {
            return styles.container
        }
    }

    function header() {
        return (
            <Header>
                <NavigationEvents onWillFocus={() => setLoaderVisible(false)} />
                <BorderlessButton 
                    onPress={goBack}
                    // style={{ marginHorizontal: 12, padding: 8 }} 
                    style={{ marginHorizontal: 14, padding: 3 }} 
                    rippleColor='rgba(0, 0, 0, .4)' 
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {/* <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} /> */}
                    <Icon name='arrow-back' size={24.5} color='#fff' />
                </BorderlessButton>

                    <Title>Histórico de pedidos</Title>

                <BorderlessButton
                    // onPress={() => nav('Resume')}
                    // style={{ marginHorizontal: 12, padding: 8 }} 
                    style={{ marginHorizontal: 14, padding: 3 }} 
                    // rippleColor='rgba(0, 0, 0, .4)' 
                    rippleColor='transparent' 
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    {/* <HeaderIcon source={require('../assets/icons/done_64px.png')} /> */}
                    <Icon name='done' size={24.5} color='transparent' />
                </BorderlessButton>
            </Header>
        )
    }


    if (!loading && list) {
        return (
            <Page>
                {/* <NavigationEvents
                    onWillFocus={inScreen}
                /> */}
                <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                {header()}
                {list.length
                    ? <FlatList
                        style={{ width: '100%', flex: 1 }}
                        data={list}
                        renderItem={({ item, index }) => <ListItem
                            item={item}
                            setItemHistory={setItemHistory}
                            index={index}
                            setIndexHistory={setIndexHistory}
                            cityId={cityId}
                            order_history={order_history}
                            setOrderHistory={setOrderHistory}
                            snapList={snapList}
                            setItemQuesVisible={setItemQuesVisible}
                            nav={nav}
                            getHistory={getHistory}
                            setLoading={setLoading}
                            keyExtractor={(item) => item.id}
                            callGetHistory={callGetHistory}
                        />}
                    />
                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <FontIcon name='clipboard-list' size={80} color='#999' style={{ bottom: 20 }} />
                        <TextInfo
                            size={normalize(18)}
                            weight='bold'
                        // >Não existem pedidos feitos.</TextInfo>
                        >Você não fez nenhum pedido ainda.</TextInfo>
                    </View>
                }

                <ModalItemQues
                    modalVisible={itemQuesVisible}
                    setModalVisible={setItemQuesVisible}
                    setCancelVisible={setCancelVisible}
                    setDeleteVisible={setDeleteVisible}
                    cityId={cityId}
                    nav={nav}
                    data={itemHistory}
                    dataIdx={indexHistory}
                    order_history={order_history}
                    setOrderHistory={setOrderHistory}
                    callGetHistory={callGetHistory}
                    setLoading={setLoading}
                />
                <ModalCancel
                    modalVisible={cancelVisible}
                    setModalVisible={setCancelVisible}
                    loaderVisible={loaderVisible}
                    setLoaderVisible={setLoaderVisible}
                    order_history={order_history}
                    setOrderHistory={setOrderHistory}
                    // snapList={snapList}
                    cityId={cityId}
                    data={itemHistory}
                    dataIdx={indexHistory}
                    getHistory={getHistory}
                    callGetHistory={callGetHistory}
                    setLoading={setLoading}
                />
                <ModalDelete
                    modalVisible={deleteVisible}
                    setModalVisible={setDeleteVisible}
                    loaderVisible={loaderVisible}
                    setLoaderVisible={setLoaderVisible}
                    order_history={order_history}
                    setOrderHistory={setOrderHistory}
                    cityId={cityId}
                    data={itemHistory}
                    dataIdx={indexHistory}
                    // getHistory={getHistory}
                />
            </Page>
        )
    } else if (!list && !loading) {
        return (
            <Page>
            {/* <Animated.View style={styles.container, { transform: [{ translateX: parentViewX }] }} > */}
                {header()}
                <NoConnection onPress={() => setCallHistory(!callHistory)} />
                {/* <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoNet
                    onPress={() => setCallHistory(!callHistory)}
                >
                    <TextButton>Tentar Novamente</TextButton>
                </ButtonNoNet> */}
            {/* </Animated.View> */}
            </Page>
        )
    } else {
        return (
            <Animated.View style={() => conditionStyleAnimated()} >
                {header()}
                <LoadingPage />
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b9f7bf',
    }
})

Screen.navigationOptions = () => {
    return {
        headerShown: false,
        headerTitle: 'Histórico de pedidos'
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        order_history: state.requestReducer.order_history,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setOrderHistory: (order_history) => dispatch({type: 'SET_ORDER_HISTORY', payload: { order_history }}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)