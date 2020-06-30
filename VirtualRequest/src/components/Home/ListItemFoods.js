import React from 'react'
import styled from 'styled-components/native'

const Item = styled.TouchableHighlight`
    align-items: center;
    justify-content: center;
    padding-horizontal: 15px;
`

const ItemArea = styled.View`
    width: 100%;
    height: 70px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-bottom-width: .5px;
`

const ItemText = styled.View`
    flex: 1;
    height: 100%;
    justify-content: space-evenly;
    
`

const ItemFood = styled.Text`
    font-size: 18px;
    color: #ff2626;
`

const ItemPrice = styled.Text`
    font-size: 16px;
    color: #000;
`

const ItemIcon = styled.Image`
    height: 16px;
    width: 16px;
`
//height: 20px;
//width: 20px;

export default (props) => {
    return (
        <Item key={props.id}
            underlayColor='rgba(0, 0, 0, .03)'
            //activeOpacity={.7}
            onPress={props.handleNav}
        >
            <ItemArea>
                <ItemText>
                    <ItemFood>{props.food}</ItemFood>
                    <ItemPrice>R$ {props.price.toFixed(2).replace('.', ',')}</ItemPrice>
                </ItemText>
                <ItemIcon source={require('../../assets/icons/next.png')} />
            </ItemArea>
        </Item>
    )
}