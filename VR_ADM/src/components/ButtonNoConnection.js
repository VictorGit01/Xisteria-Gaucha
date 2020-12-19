import React from 'react';
import styled from 'styled-components/native';
import { normalize } from '../functions';

const ButtonNoNet = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    padding-horizontal: ${normalize(20)}px;
`
// height: ${normalize(24)}px;

const TextButton = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: bold;
    color: #fff;
`

export default function ButtonNoConnection({ onPress }) {
    return (
        <ButtonNoNet onPress={onPress} underlayColor='#e5921a' >
            <TextButton>Tentar Novamente</TextButton>
        </ButtonNoNet>
    );
}