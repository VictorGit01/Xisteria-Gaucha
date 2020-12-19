import React, { useContext } from 'react'
import { /*Modal,*/ Dimensions, Platform, ToastAndroid } from 'react-native'
import Modal from 'react-native-modal'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import firebase from '../../firebase'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    width: 70%;
    justify-content: space-between
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px ${normalize(20)}px;
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

    let { 
        modalVisible, setModalVisible, 
        finishLoad, callChange, 
        valueProcess, indexProcess, 
        setDisabled, cityId,
        userId, pushId,
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

    function handleFinish() {
        callChange(valueProcess, indexProcess, true)

        requests.child(cityId).child(userId).child(pushId).child('disabled').set(true)
        setDisabled(true)

        setModalVisible(false)
        finishLoad()
    }

    function handleCancel() {
        setModalVisible(false)
        finishLoad()
    }

    return (
        <Modal
            // visible={modalVisible}
            // animationType='fade'
            // transparent={true}
            // onRequestClose={handleCancel}

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
            <ModalArea onPress={handleCancel} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Pedido entregue?</ModalTitle>
                    <ModalText style={{ marginVertical: normalize(10) }} >Ao selecionar esta opção, não será possível alterá-la.</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={handleCancel} underlayColor='#eee' >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleFinish} underlayColor='#eee' >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}