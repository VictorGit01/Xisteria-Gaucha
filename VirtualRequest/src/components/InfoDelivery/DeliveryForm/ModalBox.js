import React, { useState, useEffect } from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5)
`

const ModalBox = styled.TouchableOpacity`
    width: 75%;
    height: 250px;
    justify-content: space-around;
    align-items: flex-start;
    background-color: #fff
    border-radius: 2px;
    padding-vertical: 10px
    elevation: 15px;
`
//padding-horizontal: 20px;
//width: 280px

const TitleModal = styled.Text`
    font-size: 20px;
    font-weight: bold;
    top: 5px
    margin-horizontal: 20px
`

const OptionArea = styled.View`
    height: 140px;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 10px
`

const ButtonOption = styled.TouchableHighlight`
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    padding-horizontal: 20px;
`

const BoxOption = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => props.payActive ? '#009a67' : '#777'};
    border-radius: 10px;
    margin-right: 20px;
`
//#03BB85

const SelectOption = styled.View`
    height: 10px;
    width: 10px;
    background-color: ${props => props.payActive ? '#009a67' : 'transparent'};
    border-radius: 5px;
`

const BottomArea = styled.View`
    height: 40px;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end
    align-items: flex-end;
    margin-bottom: -5px;
    padding-horizontal: 20px;
`

const TextModal = styled.Text`
    font-size: 18px;
`

const ButtonModal = styled.TouchableHighlight`
    height: 36px;
    width: 100px;
    justify-content: center;
    align-items: center;
    margin-horizontal: 3px;
`

const TextBottom = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #009a67
`

export default (props) => {
    //const [ payActive, setPayActive ] = useState('credit')
    let payActive = props.payActive
    let setPayActive = props.setPayActive

    useEffect(() => {
        props.select ? null : setPayActive('credit')
    }, [])

    const handleCancel = () => {
        props.setVisibleModal(false)
        //props.select ? null : setPayActive('credit')
        console.log(payActive)
    }

    const handleSelect = () => {
        props.setVisibleModal(false)
        props.setSelect(true)
        props.setFormPay(() => {
            if (payActive == 'credit') {
                return 'Crédito'
            } else if (payActive == 'debit') {
                return 'Débito'
            } else if (payActive == 'money') {
                return 'Dinheiro'
            }
        })
    }

    return (
        <Modal
            visible={props.visibleModal}
            animationType='fade'
            transparent={true}
            onRequestClose={() => props.setVisibleModal(false)}
        >
            <ModalArea onPress={() => props.setVisibleModal(false)} activeOpacity={1}  >
                <ModalBox activeOpacity={1} >
                    <TitleModal>Formas de pagamento:</TitleModal>
                    <OptionArea>
                        <ButtonOption
                            onPress={() => setPayActive('credit')}
                            activeOpacity={.8}
                            underlayColor='#eee'
                        >
                            <>
                            <BoxOption payActive={payActive == 'credit'} >
                                <SelectOption payActive={payActive == 'credit'} ></SelectOption>
                            </BoxOption>
                            <TextModal>Crédito</TextModal>
                            </>
                        </ButtonOption>
                        <ButtonOption
                            onPress={() => setPayActive('debit')}
                            activeOpacity={.8}
                            underlayColor='#eee'
                        >
                            <>
                            <BoxOption payActive={payActive == 'debit'} >
                                <SelectOption payActive={payActive == 'debit'} ></SelectOption>
                            </BoxOption>
                            <TextModal>Débito</TextModal>
                            </>
                        </ButtonOption>
                        <ButtonOption
                            onPress={() => setPayActive('money')}
                            activeOpacity={.8}
                            underlayColor='#eee'
                        >
                            <>
                            <BoxOption payActive={payActive == 'money'} >
                                <SelectOption payActive={payActive == 'money'} ></SelectOption>
                            </BoxOption>
                            <TextModal>Dinheiro</TextModal>
                            </>
                        </ButtonOption>
                        
                    </OptionArea>
                    <BottomArea>
                            <ButtonModal
                                onPress={handleCancel}
                                underlayColor='#eee'
                            >
                                <TextBottom>CANCELAR</TextBottom>
                            </ButtonModal>
                            <ButtonModal
                                onPress={handleSelect}
                                underlayColor='#eee'
                            >
                                <TextBottom>SELECIONAR</TextBottom>
                            </ButtonModal>
                        </BottomArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}