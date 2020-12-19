import React, { useEffect, useState, useContext } from 'react'
import { /*Modal,*/ Dimensions, Platform, ToastAndroid } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components/native'
import firebase from '../../../firebase'
import axios from 'axios'
import { normalize, getHistory } from '../../functions'
import { NOTIF_TOKEN } from '@env'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

// Contexts:
import CallHistoryContext from '../../contexts/CallHistoryContext'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    width: 75%;
    justify-content: space-between
    background-color: #fff;
    border-radius: 2px;
    padding: 20px 20px 10px 20px;
    elevation: 15;
`
// height: 155px;

const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: 40px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
    
`
// width: 110px;

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : 16}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'};
    color: ${props => props.color ? props.color : '#000'};
    margin-vertical: 20px;
`

const ModalButton = styled.TouchableHighlight`
    height: 35px;
    justify-content: center;
    align-items: center;
    padding-horizontal: 10px;
`
// width: 50px;

export default (props) => {
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)
    const [ citiesTokenList, setCitiesTokenList ] = useState([])
    // let { modalVisible, setModalVisible, handleDelete, idxChos } = props
    const {
        modalVisible, setModalVisible,
        loaderVisible, setLoaderVisible,
        order_history, setOrderHistory,
        // snapList, 
        cityId, data, dataIdx,
        // getHistory, 
        navigation, callGetHistory,
        setLoading
    } = props
    const { deviceId, pushId } = data

    const requests = firebase.database().ref('requests')
    const canceled = firebase.database().ref('canceled')
    const cities = firebase.database().ref('cities')

    // useEffect(() => {
    //     let dataCopy = JSON.parse(JSON.stringify(data))
    //     let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
    //     console.log('-----------MODAL CANCEL-----------')
    //     dataCopy.count = 1;
    //     dataCopy.response = 5;
    //     dataCopy.cancellationDate = new Date().toISOString();
    //     // console.log(dataCopy)
    //     // console.log(dataIdx)

    //     orderHistoryCopy.map((item, index) => {
    //         if (item.id == cityId) {
    //             // console.log(item.data)
    //             item.data[dataIdx] = dataCopy
    //         }
    //         // return item
    //         console.log(item)
    //     });

    //     // console.log(o)
    // }, [])

    useEffect(() => {
        console.log('-----------MODAL CANCEL DATA-----------')
        console.log(data)

        cities.child(cityId).child('devices').on('value', snapshot => {
            let newcitiesTokenList = []

            snapshot.forEach(childItem => {
                // console.log(childItem.val())
                if (childItem.val().logged) {
                    newcitiesTokenList.push(childItem.val().token)
                }
            })
            setCitiesTokenList(newcitiesTokenList)
        })
    }, [])

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180),
        )
    }

    // function handleCancel() {
    //     console.log('------------HANDLE_CANCEL------------')
    //     console.log(data)
    // }

    function handleCancel() {
        // let snapListCopy = JSON.parse(JSON.stringify(snapList))
        let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
        let dataCopy = JSON.parse(JSON.stringify(data))
        let dataCancelCopy = JSON.parse(JSON.stringify(data))

        setLoading(true)
        setModalVisible(false)
        navigation && setLoaderVisible(true)

        dataCopy.count = 1;
        dataCancelCopy.count = 1;

        // dataCopy.response = 5;
        dataCopy.cancellationDate = new Date().toISOString();
        dataCancelCopy.cancellationDate = new Date().toISOString();

        delete dataCancelCopy.pushId
        delete dataCancelCopy.deviceId


        function handleLoadPg() {
            setLoaderVisible(false)
        }

        function remove() {
            requests.child(cityId).child(deviceId).child(pushId).remove()
            .then(resp => {
                setTimeout(() => {
                    // handleLoadPg()
                    // toastMsg('Pedido cancelado.')
                    endCancellation()
                    sendNotification()
                }, 2000)
            })
            .catch(error => {
                setTimeout(() => {
                    // handleLoadPg()
                    toastMsg(`${error.code} - ${error.message}`)
                    console.log(error)
                }, 500)
            })
        }

        console.log('-----------ANTES DE SETAR O ORDER_HISTORY_COPY-----------')
        console.log(orderHistoryCopy)

        canceled.child(cityId).child(deviceId).push(dataCancelCopy)
        .then(resp => {
            
            dataCopy.response = 5;
            
            orderHistoryCopy.map((item, index) => {
                if (item.id == cityId) {
                    // ÚLTIMO DO ÚLTIMO USADO:
                    item.data[dataIdx] = dataCopy
                    // orderHistoryCopy[index].data[dataIdx] = dataCopy;
                    // ÚLTIMO USADO:
                    // orderHistoryCopy[index].data[dataIdx].response = 5;
                    // orderHistoryCopy[index].data[dataIdx].cancellationDate = new Date().toISOString();
                    // orderHistoryCopy[index].data[dataIdx].deviceId = deviceId;
                    // orderHistoryCopy[index].data[dataIdx].pushId = pushId;
                    // 

                    // item.response = 5;
                    // item.cancellationDate = new Date().toISOString();
                    // console.log('------------ORDER_HISTORY_COPY------------')
                    // console.log(orderHistoryCopy[index])
                }

                return item;
            });
            // orderHistoryCopy[index].response = 4
            
            
            // getHistory(orderHistoryCopy)
            setTimeout(() => {
                remove()
            }, 1000)
        })
        .catch(error => {
            setTimeout(() => {
                // handleLoadPg()
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
            }, 500)
        })
        
        console.log('-----------DEPOIS DE SETAR O ORDER_HISTORY_COPY-----------')
        console.log(orderHistoryCopy)

        // setOrderHistory(orderHistoryCopy)
        // setCallHistory(!callHistory)
        
        function endCancellation() {
            callGetHistory(orderHistoryCopy)
            
            if (navigation) {
                setTimeout(async () => { 
                    await navigation.goBack() 
                    
                    setLoaderVisible(false)
                    toastMsg('Pedido cancelado.')
                }, 2000)
            } else {
                toastMsg('Pedido cancelado.')
            }
        }
    }

    function sendNotification() {
        axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': NOTIF_TOKEN
            },
            data: {
                // 'to': `${token2}`,
                'registration_ids': citiesTokenList,
                'notification': {
                    'title': `Pedido #${data.request_number} cancelado.`,
                    'body': `O cliente ${data.full_name} cancelou um pedido.`,
                    'vibrate': 1,
                    'priority': 'high',
                    'content_available': true,
                    'color': '#fe9601',
                },
            }
        }).catch(error => {
            console.log('Error: ', error)
            // alert('Error: ', error.toString())
        })
    }

    return (
        <Modal
            // visible={modalVisible}
            // animationType='fade'
            // transparent={true}
            // onRequestClose={() => setModalVisible(false)}

            isVisible={modalVisible}
            backdropOpacity={0.9}
            // backdropColor='rgba(0, 0, 0, .5)'
            backdropColor='transparent'
            animationIn='fadeIn'
            animationOut='fadeOut'
            coverScreen={false}
            // deviceHeight={Dimensions.get('screen').height}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
            hideModalContentWhileAnimating={true}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Cancelar pedido</ModalTitle>
                    <ModalText>Deseja cancelar este pedido?</ModalText>
                    <ButtonArea>
                        <ModalButton
                            onPress={() => setModalVisible(false)}
                            underlayColor='#eee'
                            hitSlop={{ left: 25 }}
                        >
                            <ModalText size={14} color='#009a67' weight='bold' >CANCELAR</ModalText>
                        </ModalButton>
                        <ModalButton 
                            onPress={handleCancel} 
                            underlayColor='#eee' 
                            hitSlop={{  right: 25 }} 
                        >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}

