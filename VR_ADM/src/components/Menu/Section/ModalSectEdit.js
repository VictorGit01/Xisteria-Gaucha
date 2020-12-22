import React, { useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import { normalize } from '../../../functions'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    height: 20%;
    width: 50%;
    justify-content: space-between;
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(15)}px 0px;
    elevation: 15;
`

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
    font-weight: ${props => props.weight ? props.weight : 'normal'};
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: ${normalize(50)}px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: ${normalize(10)}px;
`

export default (props) => {

    let {
        modalVisible, setModalVisible,
        setAddVisible, setDeleteVisible
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

    return (
        <Modal
            visible={modalVisible}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    {/* <ModalTitle>Excluir</ModalTitle>
                    <ModalText>Deseja excluir este serviço cancelado?</ModalText> */}

                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        setAddVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Editar</ModalText>
                        <FontIcon name='edit' size={normalize(20)} color='#999' />
                        </>
                    </ModalButton>
                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        setDeleteVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Excluir</ModalText>
                        <FontIcon name='trash-alt' size={normalize(20)} color='#999' />
                        </>
                    </ModalButton>

                    {/* <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                    </ButtonArea> */}
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}