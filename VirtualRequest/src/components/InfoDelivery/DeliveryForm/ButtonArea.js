import React, { useState } from 'react'
import styled from 'styled-components/native'

const ButtonSave = styled.TouchableOpacity`
    heigth: 40px;
    width: 165px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 40px;
`

const ButtonForm = styled.TouchableOpacity`
    height: 40px;
    width: ${props => props.width ? props.width : 165};
    justify-content: center;
    align-items: center;
    align-self: ${props => props.aSelf ? props.aSelf : 'flex-end'};
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 40px;
`
//margin-bottom: 40px;
//margin-top: ${props => props.mTop ? props.mTop : 0}

const ButtonSend = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    align-self: center;
    background-color: #077a15; 
    border-radius: 2px;
    elevation: 2px
`
//margin-bottom: 15px;

const TextButton = styled.Text`
    font-size: 16px;
    color: #fff;
`

export default (props) => {
    //props.visibleModal ? props.setPayActive('credit') : null

    const handleVisible = () => {
        props.setVisibleModal(true)
    }

    return (
        <>
        <ButtonForm activeOpacity={.9} >
                <TextButton>Salvar informações</TextButton>
        </ButtonForm>
        <ButtonForm
                width='100%'
                mTop={40}
                aSelf='center'
                activeOpacity={.9}
                onPress={handleVisible}
        >
            <TextButton>{props.select ? props.formPay : 'Formas de pagamento'}</TextButton>
        </ButtonForm>
        <ButtonSend
            activeOpacity={.9}
            onPress={props.handleSend}
        >
            <TextButton>Enviar pedido</TextButton>
        </ButtonSend>
        </>
    )
}