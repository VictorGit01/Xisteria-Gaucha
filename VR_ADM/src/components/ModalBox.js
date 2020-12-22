import React, { useEffect, useState, useContext } from 'react'
import { Modal, ToastAndroid, Dimensions, Platform } from 'react-native'
// import Modal from 'react-native-modal'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-community/async-storage'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    width: 50%;
    justify-content: space-between;
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(15)}px 0px;
    elevation: 15;
`
// height: 20%;

// const ModalTitle = styled.Text`
//     font-size: 18px;
//     font-weight: bold;
// `

// const ButtonArea = styled.View`
//     height: 40px;
//     width: 110px;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     align-self: flex-end;
// `

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : normalize(16)}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: ${normalize(50)}px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: ${normalize(10)}px;
    margin-vertical: ${normalize(5)}px;
`

export default (props) => {
    const [ deviceId, setDeviceId ] = useState('')

    let {
        modalVisible, setModalVisible,
        handleNavigate, remove_enabled,
        openSecondModal, canceled_enabled
    } = props

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    useEffect(() => {
        if (modalVisible) {
            AsyncStorage.getItem('deviceId')
                .then(id => {
                    if (id) {
                        setDeviceId(id)
                    }
                })
        }
    }, [modalVisible])

    useEffect(() => {
        console.log('-------SE ESTIVER FUNCIONANDO IRÁ APARECER AQUI: USE_STATE-------')
        console.log(deviceId)
    }, [deviceId])

    return (
        <Modal
            visible={modalVisible}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}

            // isVisible={modalVisible}
            // backdropOpacity={0.9}
            // // backdropColor='rgba(0, 0, 0, .5)'
            // backdropColor='transparent'
            // animationIn='fadeIn'
            // animationOut='fadeOut'
            // coverScreen={false}
            // // deviceHeight={Dimensions.get('screen').height}
            // deviceWidth={deviceWidth}
            // deviceHeight={deviceHeight}
            // style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
            // hideModalContentWhileAnimating={true}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >

                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        handleNavigate()
                        // setAddVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Detalhes</ModalText>
                        <FontIcon name='info-circle' size={normalize(20)} color='#999' />
                        </>
                    </ModalButton>
                    {/* {(remove_enabled || canceled_enabled) && */}
                    {remove_enabled &&
                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        openSecondModal()
                        // setDeleteVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Excluir</ModalText>
                        <FontIcon name='trash-alt' size={normalize(20)} color='#999' />
                        </>
                    </ModalButton>}
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}