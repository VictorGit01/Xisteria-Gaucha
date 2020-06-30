import React from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
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
    margin-vertical: 10px;
`

const ModalButton = styled.TouchableHighlight`
    height: 35px;
    justify-content: center;
    align-items: center;
    
    padding-horizontal: 10px;
`
// width: 50px;

export default (props) => {
    let { modalVisible, setModalVisible, selectAddress, itemChos, idxChos, pop } = props

    function handleConfirm() {
        selectAddress(itemChos, idxChos)
        pop(3)
        setModalVisible(false)
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
                    <ModalTitle>Trocar Localização</ModalTitle>
                    <ModalText>Este pedido não pode ser entregue nesse endereço. Deseja alterar sua localização?</ModalText>
                    <ButtonArea>
                        <ModalButton
                            onPress={() => setModalVisible(false)}
                            underlayColor='#eee'
                            hitSlop={{ left: 25 }}
                        >
                            <ModalText size={14} color='#009a67' weight='bold' >CANCELAR</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleConfirm} underlayColor='#eee' hitSlop={{  right: 25 }} >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}

