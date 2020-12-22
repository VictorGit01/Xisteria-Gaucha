import React, { useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../firebase'

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
    border-radius: 2px;
    padding: 20px 20px 10px 20px;
    elevation: 15;
`

const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: 40px;
    width: 110px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
`

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : 16}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: 35px;
    width: 50px;
    justify-content: center;
    align-items: center;
`

export default (props) => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    let { modalVisible, setModalVisible, goToScreen } = props

    // const cityId = firebase.auth().currentUser.uid

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    const handleSignOut = () => {
        setModalVisible(false)
        setLoaderVisible(true)
        firebase.auth().signOut()
        goToScreen()
        // setTimeout(() => {
            // firebase.database().ref('cities').child(cityId).child('logged').set(false)
            // .then(() => {
                // goToScreen()
        //     })
        //     .catch(error => {
        //         setLoaderVisible(false)
        //         toastMsg(`${error.code} - ${error.message}`)
        //         console.log(error)
        //     })
        // }, 1500)

        
        // firebase.auth().signOut()
        // .then((resp) => {
        //     // setTimeout(() => {
        //         goToScreen()
        //         setLoaderVisible(false)
        //     // }, 1500)
        // })
        // .catch((error) => {
        //     setTimeout(() => {
        //         setLoaderVisible(false)
        //         toastMsg(`${error.code} - ${error.message}`)
        //         console.log(error)
        //     }, 500)
        // })
    }

    return (
        <Modal
            visible={modalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Sair</ModalTitle>
                    <ModalText style={{ marginVertical: 10 }} >Deseja sair desta conta?</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleSignOut} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}