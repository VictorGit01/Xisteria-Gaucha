import React, { useEffect, useState, useContext } from 'react'
import { Dimensions, View, ToastAndroid, StatusBar} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import NetInfo from '@react-native-community/netinfo'
import firebase from '../../firebase'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

// Components:
import LoadingPage from '../components/LoadingPage'
import ListItem from '../components/Delivery/ListItem'
import ModalBox from '../components/ModalBox'
import ModalDelete from '../components/ModalDelete'
import ButtonNoConnection from '../components/ButtonNoConnection'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'
import NotifDeliveryContext from '../contexts/NotifDeliveryContext'
import CallUserContext from '../contexts/CallUserContext'
import { FlatList } from 'react-native-gesture-handler'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`

const Listing = styled.FlatList`
    width: 100%;
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
// font-size: ${normalize(72)}px;

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`
// font-size: ${props => props.size || normalize(72)}px;

const Screen = (props) => {
    const [ list, setList ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ boxVisible, setBoxVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ itemDelivery, setItemDelivery ] = useState({})
    const [ callUser, setCallUser ] = useContext(CallUserContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ notifDelivery, setNotifDelivery ] = useContext(NotifDeliveryContext)

    const { navigation } = props
    const nav = navigation.navigate

    const requests = firebase.database().ref('requests')
    const currentCity = firebase.auth().currentUser

    useEffect(() => {
        setLoaderVisible(false)
    }, [])

    useEffect(() => {
        // let userId = firebase.auth().currentUser.uid
        // console.log(`ID do Usuário: ${userId}`)
        // setTimeout(() => {
        //     console.log(firebase.auth().currentUser.getIdToken())
        // }, 3000)
        if (currentCity) {
            let cityId = currentCity.uid

            // getRequests()

            // AsyncStorage.setItem('cityId', '')
            //     .catch(error => {
            //         toastMsg(`${error.code} - ${error.message}`)
            //         console.log(error)
            //     })
        }
    }, [notifDelivery])

    useEffect(() => {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                endOfLoading()
            } else {
                getRequests()
            }
        })
    }, [notifDelivery, callUser])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function requestsFormatted() {
        if (currentCity) {
            let cityId = currentCity.uid

            return new Promise((resolve, reject) => {
                requests.child(cityId).once('value').then(snapshot => {
                    if (snapshot.val()) {
                        let newPropertyValues = []

                        snapshot.forEach(childItem => {
                            let propertyValues = Object.values(childItem.val())
                            let propertyKeys = Object.keys(childItem.val())

                            propertyValues.map((item, index) => {
                                item.userId = childItem.key
                                item.pushId = propertyKeys[index]
                                // newPropertyValues.push(item)
                                newPropertyValues = [ ...newPropertyValues, item ]
                                // return item
                            })

                            
                            
                            // resolve(newPropertyValues)
                        })
                        console.log('----------DELIVERY_PROPERTY_VALUES----------')
                        console.log(newPropertyValues)
                        resolve(newPropertyValues)
                    } else {
                        resolve(null)
                    }
                })
            })

        }
    }

    function getRequests() {

        requestsFormatted().then(resp => {
            if (resp) {
                let newList = []
                // let list_count = []
                
                // resp.map(item => {
                //     if (item.dlvTypePos == 1) {
                //         list_count.push(item.count)
                //     }
                // })

                // let conv_num = num => isNaN(num) ? 0 : Number(num)
                // let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                resp.map(item => {
                    if (item.dlvTypePos == 1) {

                        // newList.push({
                        //     id: item.id,
                        //     userId: item.userId,
                        //     full_name: item.full_name,
                        //     // total_count: result_count,
                        //     count: item.count,
                        //     date: item.date,
                        //     time: item.time,
                        // })
                        // console.log('----------DELIVERY_ITEM----------')
                        // console.log(item)

                        newList.push(item)
                    }
                })

                let seen = {}
                let newListNotDup = newList.filter(function(entry) {
                    let previous;

                    // if (seen.hasOwnProperty(entry.userId)) {
                    if (seen.hasOwnProperty(entry.id)) {
                        // previous = seen[entry.userId];
                        previous = seen[entry.id];

                        return false
                    }

                    // seen[entry.userId] = entry
                    seen[entry.id] = entry

                    return true
                })

                const sortedList = newListNotDup.slice().sort((a, b) => {
                    return new Date(b.unformattedDate) - new Date(a.unformattedDate)
                })

                // setList(newListNotDup)
                setList(sortedList)

                endOfLoading()
                // console.log(newList)
            } else {
                setList([])

                endOfLoading()
            }
        })
    }

    // function sendMessage() {
    //     let token1 = 'dGzvU4UHSbSiIr5wAHEbYA:APA91bEh9Kq0AQ8vJXMvWK6o3IGzz9WcFsWXbVhbXmlI4ASHLdKMDZtQ-DxpSSvoNZQQ5qVfKq4BUovCj6eEPuys0_tDPZTA4JqSawDg8wjzgmKyeUnzLi0FTrL1AR6fy5QHcNeboi1U'
    //     let token2 = 'dbRiIYTySCCHFXqmA4S8zr:APA91bGv6JdcGcuZmMVdo2kUW3b3O_STIO4oryieq4u93ZmaP3Vyz9W359S7eYDM8_f4TgbLqiGItVRNOPDE3a6UxMD3CSbcwciIoDqGrKTyTal0FyjD366x8Fdtza1bM6YCyC2wayVm'

    //     axios({
    //         method: 'POST',
    //         url: 'https://fcm.googleapis.com/fcm/send',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'key=AAAArasXsRE:APA91bHiUrfy0clOFw-Tn1w_PpPfavkweR81vuLxvy6qKgJvWrAQ9VJXFX2rJASelvxfCzRfOLVnQZBA1eQ1SUdj3VtaJN21LN-UFHNaCNdN3v4_RaBpvWCmJXa3dh1FIc6BTIb_cq9p'
    //         },
    //         data: {
    //             'to': `${token1}`,
    //             // 'registration_ids': [token1, token2],
    //             'notification': {
    //                 'title': 'test title',
    //                 'body': 'Menssagem teste',
    //                 'vibrate': 1,
    //                 'sound': 1,
    //                 'show_in_foreground': true,
    //                 'color': '#fe9601',
    //                 'icon': '@mipmap/ic_launcher',
    //                 'priority': 'high',
    //                 'bagde': '2'
    //             },
    //             'data': {
    //                 'custom_notification': {
    //                     'body': 'test body',
    //                     'title': 'test title',
    //                     'color': '#00ACD4',
    //                     'priority': 'high',
    //                     'sound': 'default',
    //                     'show_in_foreground': true,
    //                 }
    //             }
    //         }
    //     }).then(response => {
    //         // console.log('Menssagem enviada!', response)
    //     })
    //     .catch(error => {
    //         console.log('Error: ', error)
    //     })
    // }

    function navToInfoDelivery() {
        // nav('InfoDelivery', { data: item });
        nav('InfoDelivery', { data: itemDelivery });
    }

    function openSecondModal() {
        setBoxVisible(false);
        setDeleteVisible(true);
    }

    function handleDelete() {
        if (currentCity) {
            const cityId = currentCity.uid;
            const { userId, pushId } = itemDelivery

            // setLoaderVisible(true);
            setCallUser(!callUser)
            // setDeleteVisible(false);
            requests.child(cityId).child(userId).child(pushId).remove()
                .then(() => {
                    setTimeout(() => {
                        // setLoaderVisible(false);
                        toastMsg('Pedido excluído.');
                    }, 500)
                })
        }
    }

    function renderItem({ item, index }) {
        
    }

    if (!loading && list) {
        return (
            <Page>
                <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                <NavigationEvents
                    onWillFocus={() => setLoaderVisible(false)}
                />
                {list.length
                    ? <Listing
                        data={list}
                        renderItem={({ item }) => (
                            <ListItem 
                                item={item} 
                                nav={nav} 
                                setItemDelivery={setItemDelivery} 
                                setBoxVisible={setBoxVisible}
                                setDeleteVisible={setDeleteVisible}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    : <TextInfo 
                        // size={normalize(63)}
                        size={normalize(18)}
                        weight='bold'
                    >Não existem pedidos para entrega.</TextInfo>
                }
                <ModalBox
                    modalVisible={boxVisible}
                    setModalVisible={setBoxVisible}
                    handleNavigate={navToInfoDelivery}
                    remove_enabled={Object.keys(itemDelivery).length ? itemDelivery.remove_enabled : false}
                    openSecondModal={openSecondModal}
                />
                <ModalDelete
                    modalVisible={deleteVisible}
                    setModalVisible={setDeleteVisible}
                    handleDelete={handleDelete}
                />
            </Page>
        )
    } else if (!list && !loading) {
        return (
            <Page>
                <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                {/* <TextInfo mgBottom={20} >Sem conexão com a internet.</TextInfo> */}
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={() => setCallUser(!callUser)} />
            </Page>
        )
    } else {
        return (
            <>
                <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                <LoadingPage onWillFocus={() => setLoaderVisible(false)} />
            </>
        )
    }
    
}

Screen.navigationOptions = () => {
    return {
        title: 'Delivery'
    }
}

export default Screen