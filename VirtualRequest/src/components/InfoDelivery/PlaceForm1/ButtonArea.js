import React from 'react'
import styled from 'styled-components/native'

const ButtonArea = styled.View`
    flex: 1;
    width: 90%;
    align-items: center;
`

const ButtonForm = styled.TouchableOpacity`
    height: 40px;
    width: 165px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 30px;
`

const ButtonGenCode = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 30px;
`

const ButtonSend = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    border-radius: 2px;
    elevation: 2px;
`
//margin-top: 20px;

const TextButton = styled.Text`
    font-size: 16px;
    color: #fff;
`

const TextCodeArea = styled.View`
    flex: 1;
    width: 100%;
    background-color: tomato
`

const TextCode = styled.Text`
    font-size: 18px;
    text-align: center
    color: #999;   
`

export default (props) => {
    let { handleGenCode, handleSend, handleSaveInfo, activeCode } = props

    return (
        <ButtonArea>
            <ButtonForm
                activeOpacity={.9}
                onPress={handleSaveInfo}
            >
                <TextButton>Salvar informações</TextButton>
            </ButtonForm>
            <ButtonGenCode
                activeOpacity={.9}
                onPress={handleGenCode}
            >
                <TextButton>Gerar código</TextButton>
            </ButtonGenCode>
            <ButtonSend
                activeOpacity={.9}
                onPress={handleSend}
            >
                <TextButton>Enviar pedido</TextButton>
            </ButtonSend>
                
        </ButtonArea>
    )
}