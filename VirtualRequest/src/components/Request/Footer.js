import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

const Area = styled.View`
    flex-direction: row;
    height: 50px;
    width: 100%;
    align-items: center;
    background-color: #077a15;
    padding-horizontal: 15px;
`

const TotalArea = styled.View`
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`

const TotalText = styled.Text`
    font-size: 18px;
    text-align: center;
    color: #fff;
`

export default (props) => {
    return (
        <Area>
            <TotalArea>
                <TotalText>Total:</TotalText>
                {props.indicator ? <ActivityIndicator size='small' color='#fff' /> :
                <TotalText>R$ {props.total.toFixed(2).replace('.', ',')}</TotalText>}
            </TotalArea>
        </Area>
    )
}