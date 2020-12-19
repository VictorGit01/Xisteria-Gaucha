import React from 'react'
// import { Modal, StatusBar } from 'react-native'
import { Dimensions, Platform } from 'react-native'
import Modal from 'react-native-modal'
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
    height: 155px;
    width: 70%;
    justify-content: space-between
    background-color: #fff;
    border-radius: 2px;
    padding: 20px 20px 10px 20px;
    elevation: 15px;
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
    return (
        <Modal
            // visible={props.modalVisible}
            // animationType='fade'
            // transparent={true}
            // onRequestClose={() => props.setModalVisible(false)}
            isVisible={props.modalVisible}
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
            {/* <StatusBar barStyle='light-content' backgroundColor={props.modalVisible ? 'rgb(3, 61, 10)' : '#077a15'} /> */}
            <ModalArea onPress={() => props.setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    <ModalTitle>Excluir</ModalTitle>
                    <ModalText>Deseja excluir este item do seu pedido?</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={() => props.setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={props.handleDel} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}