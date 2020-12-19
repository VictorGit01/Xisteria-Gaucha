import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { normalize } from '../../functions'

const Area = styled.View`
    flex-direction: row;
    width: 100%;
    align-items: center;
    background-color: #077a15;
    border-bottom-width: ${normalize(.5)}px;
    border-color: rgba(255, 255, 255, .5);
    padding-horizontal: ${normalize(15)}px;
    padding-vertical: ${normalize(13)}px;
`
// height: 50px;

const TotalArea = styled.View`
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`

const TotalText = styled.Text`
    font-size: ${normalize(18)}px;
    text-align: center;
    color: #fff;
`

export default (props) => {
    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        return num_format
    }

    return (
        <Area>
            <TotalArea>
                <TotalText>Total:</TotalText>
                {props.indicator ? <ActivityIndicator size='small' color='#fff' /> :
                // <TotalText>R$ {props.total.toFixed(2).replace('.', ',')}</TotalText>}
                // <TotalText>{onPriceChange(props.total.toFixed(2))}</TotalText>}
                <TotalText>{onPriceChange(props.total)}</TotalText>}
            </TotalArea>
        </Area>
    )
}