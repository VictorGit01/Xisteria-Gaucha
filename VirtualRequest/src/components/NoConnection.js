import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { normalize } from '../functions';

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${normalize(20)}px;
`

const ButtonNoNet = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    padding-horizontal: ${normalize(20)}px;
`

const TextButton = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: bold;
    color: #fff;
`

export default function NoConnection({ onPress }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <TextInfo>Sem conexão com a internet.</TextInfo>
            <ButtonNoNet onPress={onPress} underlayColor='#e5921a' >
                <TextButton>Tentar Novamente</TextButton>
            </ButtonNoNet>
        </View>
    )
}