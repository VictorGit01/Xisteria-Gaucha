import React, { useContext, useEffect, useState } from 'react'
import { Modal, ToastAndroid, Dimensions, Platform } from 'react-native'
// import Modal from 'react-native-modal'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import NetInfo from '@react-native-community/netinfo'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    width: 70%;
    justify-content: space-between
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(20)}px ${normalize(20)}px 10px ${normalize(20)}px;
    elevation: 15;
`

const ModalTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: ${normalize(40)}px;
    width: ${normalize(110)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
`

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : normalize(16)}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: ${normalize(35)}px;
    width: ${normalize(50)}px;
    justify-content: center;
    align-items: center;
`

export default (props) => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ yesClicked, setYesClicked ] = useState(false)

    let { 
        modalVisible, setModalVisible, 
        handleDelete,
        // setDisabled, cityId,
        // userId, pushId,
    } = props

    // const cityId = firebase.auth().currentUser.uid
    const requests = firebase.database().ref('requests')

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    useEffect(() => {
        console.log('Mudando o estado de YES_CLICKED:')
        console.log(yesClicked)
    }, [yesClicked])

    // function handleFinish() {
    //     requests.child(cityId).child(userId).child(pushId).child('disabled').set(true)
    // }

    async function handleDeleteNow() {
        await setModalVisible(false)
        // setLoaderVisible(true)

        setTimeout(() => {
            setLoaderVisible(true)
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    toastMsg('Verifique sua conexão com a internet.')
                } else {
                    handleDelete()
                }
            })
        }, 100)
    }

    function onDismiss() {
        console.log('---------MODAL_FECHOU---------')
        if (yesClicked) {
            // await setModalVisible(false)
            setLoaderVisible(true)

            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    toastMsg('Verifique sua conexão com a internet.')
                } else {
                    handleDelete()
                }
            })
        }
    }
    
    return (
        <Modal
            visible={modalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
            onDismiss={() => console.log('---------MODAL_FECHOU---------')}

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
            // // onModalHide={() => console.log('---------MODAL_FECHOU ON_MODAL_HIDE---------')}
            // // onModalWillHide={() => console.log('---------MODAL_FECHOU ON_MODAL_WILL_HIDE---------')}
            // // onModalWillHide={onDismiss}
            // // onModalHide={onDismiss}
            // onBackButtonPress={() => setModalVisible(false)}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Excluir pedido</ModalTitle>
                    <ModalText style={{ marginVertical: normalize(10) }} >Este pedido já foi finalizado. Deseja excluí-lo do banco de dados?</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleDeleteNow} underlayColor='#eee' >
                        {/* <ModalButton onPress={() => {
                            setYesClicked(true)
                            setModalVisible(false)
                        }} underlayColor='#eee' > */}
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}