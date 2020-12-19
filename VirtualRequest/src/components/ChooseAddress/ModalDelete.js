import React, { useEffect } from 'react'
import { Dimensions, Platform, BackHandler } from 'react-native'
import Modal from 'react-native-modal'
import { normalize } from '../../functions'
import styled from 'styled-components/native'
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
    width: 75%;
    justify-content: space-between
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px ${normalize(20)}px;
    elevation: 15;
`
// height: 155px;

const ModalTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: ${normalize(40)}px;
    
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
    
`
// width: 110px;

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : normalize(16)}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
    margin-vertical: ${normalize(10)}px;
`

const ModalButton = styled.TouchableHighlight`
    height: ${normalize(35)}px;
    justify-content: center;
    align-items: center;
    
    padding-horizontal: ${normalize(10)}px;
`
// width: 50px;

export default (props) => {
    let { modalVisible, setModalVisible, handleDelete, idxChos } = props

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [modalVisible])

    function onBack() {
        if (modalVisible) {
            setModalVisible(false)
            return true
        }
        return false
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
            // onBackdropPress={() => props.setModalVisible(false)}
            // animationInTiming={300}
            // // animationOutTiming={500}
            // backdropTransitionOutTiming={300}
            hideModalContentWhileAnimating={true}  
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Exluir Endereço</ModalTitle>
                    <ModalText>Deseja excluir este endereço?</ModalText>
                    <ButtonArea>
                        <ModalButton
                            onPress={() => setModalVisible(false)}
                            underlayColor='#eee'
                            hitSlop={{ left: 25 }}
                        >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >CANCELAR</ModalText>
                        </ModalButton>
                        <ModalButton onPress={() => {
                            handleDelete(idxChos)
                            setModalVisible(false)
                        }} underlayColor='#eee' hitSlop={{  right: 25 }} >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}

