import React, { useEffect, useContext, useState } from 'react'
import { /*Modal,*/ Dimensions, Platform, ToastAndroid } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components/native'
import { normalize, getHistory } from '../../functions'
import firebase from '../../../firebase'
import AsyncStorage from '@react-native-community/async-storage'

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
    font-weight: ${props => props.weight ? props.weight : 'normal'}
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
    const [ deviceId, setDeviceId ] = useState('')
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)
    // let { modalVisible, setModalVisible, handleDelete, idxChos } = props
    const {
        modalVisible, setModalVisible,
        loaderVisible, setLoaderVisible,
        order_history, setOrderHistory,
        cityId, data, dataIdx, /*getHistory*/
        navigation,
    } = props

    const canceled = firebase.database().ref('canceled')

    useEffect(() => {
        AsyncStorage.getItem('deviceId').then(id => {
            setDeviceId(id)
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

    // function handleDelete() {
    //     console.log('-------------REMOÇÃO_DO_HISTÓRICO-------------')
    //     let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
        
    // }

    async function handleDelete() {
        let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
        // setCallHistory(!callHistory)
        setModalVisible(false)
        navigation && setLoaderVisible(true)

        try {
            await canceled.child(cityId).child(deviceId).on('value', snapshot => {
                let listIds = []
    
                // snapshot.forEach(childItem => listIds.push(childItem.val().id))
    
                snapshot.forEach(childItem => {
                    if (childItem.val().id == data.id) {
                        canceled
                        .child(cityId)
                        .child(deviceId)
                        .child(childItem.key)
                        .child('removed_from_history')
                        .set(true)
                    }
                })
                
                // if (listIds.includes(data.id)) {
                //     canceled.child(cityId)
                // }
    
                // let newData = []
    
                // order_history.map(item => {
                //     if (item.id == cityId) { newData = item.data }
                // })
    
    
            })
            
            order_history.map((item, index) => {
                if (item.id == cityId) {
                    console.log('----------ORDER_HISTORY_COPY ANTES DE SER REMOVIDO----------')
                    console.log(orderHistoryCopy[index].data.length)
    
                    orderHistoryCopy[index].data.splice(dataIdx, 1)
    
                    console.log('----------ORDER_HISTORY_COPY ANTES DE SER REMOVIDO----------')
                    console.log(orderHistoryCopy[index].data.length)
                }
            })
            setOrderHistory(orderHistoryCopy)
            setCallHistory(!callHistory)
    
            // setTimeout(() => {
                // orderHistoryCopy.splice(dataIdx, 1)
                
                // getHistory(cityId, orderHistoryCopy, setOrderHistory)
    
                setTimeout(async () => {
                    // setLoaderVisible(false)
                    // toastMsg('Pedido removido.')
                    toastMsg('Removido do histórico.')
                    if (navigation) {
                        let goBack = navigation.goBack
    
                        await goBack()

                        setLoaderVisible(false)
                    }
                }, 2000)
            // }, 1000)
        } catch(error) {
            toastMsg(`${error.code} - ${error.message}`)
            console.log(error)
        }


    }

    // function handleDelete() {
    //     console.log('------HANDLE_DELETE------')
    //     // console.log(dataIdx)
    //     // console.log('------ORDER_HISTORY------')
    //     // console.log(order_history)

    //     AsyncStorage.getItem('deviceId').then(deviceId => {
    //         canceled.child(cityId).child(deviceId).on('value', snapshot => {
    //             let listIds = []
    //             snapshot.forEach(childItem => {
    //                 // console.log(childItem.val())
    //                 listIds.push(childItem.val().id)
    //                 if (childItem.val().id == data.id) {
    //                     console.log('------ID ESTÁ INCLUSO NA LISTA SIM.------')
    //                     console.log(childItem.key)
    //                     canceled.child(cityId).child(deviceId).child(childItem.key).on('value', snapshot => {
    //                         console.log(snapshot.val())
    //                     })
    //                 }
    //             })
    //             // console.log(listIds.length)

    //             // console.log('------ID ESTÁ INCLUSO NA LISTA? SIM OU NÃO?------')
    //             // console.log(listIds.includes(data.id))

    //             // let newData = []

    //             // order_history.map(item => {
    //             //     if (item.id == cityId) {
    //             //         // console.log('ITEM_DATA:')
    //             //         // console.log(item.data)
    //             //         newData = item.data
    //             //     }
    //             // })

    //             // let count = 0
    //             // newData.map(item => {
    //             //     if (listIds.includes(item.id)) {
    //             //         console.log('------ID ESTÁ INCLUSO NA LISTA------')
    //             //         count++
    //             //     }
    //             // })
    //             // console.log('------RESULTADO FINAL DA CONTA------')
    //             // console.log(count)
    //         })
    //     })
    // }

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
                    <ModalTitle>Remover do histórico</ModalTitle>
                    <ModalText>Este pedido já foi finalizado. Deseja removê-lo do histórico?</ModalText>
                    <ButtonArea>
                        <ModalButton
                            onPress={() => setModalVisible(false)}
                            underlayColor='#eee'
                            hitSlop={{ left: 25 }}
                        >
                            <ModalText size={14} color='#009a67' weight='bold' >CANCELAR</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleDelete} underlayColor='#eee' hitSlop={{  right: 25 }} >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}

