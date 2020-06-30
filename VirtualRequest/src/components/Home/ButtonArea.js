import React, { useState, useContext } from 'react'
import styled from 'styled-components/native'

import ActiveContext from '../../contexts/ActiveContext'

const BackArea = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    background-color: #077a15;
    elevation: 3px;
`

const LeftArea = styled.View`
    flex: 1;
`

const RightArea = styled.View`
    flex: 1;
`

const ButtonSnack = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.active ? '#fe9601' : '#077a15'};
    elevation: 2;
    border-radius: 2px;
    margin: 6px;
`

const BorderSnack = styled.View`
    height: 1px;
    background-color: ${props => props.active ? '#fff' : '#077a15'};
    
`

const TextSnack = styled.Text`
    color: #fff;
    font-size: 16px;
`

export default () => {
    const [active, setActive] = useContext(ActiveContext)

    return (
        <BackArea>
            <LeftArea>
            <ButtonSnack
                activeOpacity={.9}
                active={active == 'foods'}
                onPress={() => setActive('foods')}
            >
                <TextSnack>Lanches</TextSnack>
            </ButtonSnack>
            <BorderSnack active={active == 'foods'} ></BorderSnack>
            </LeftArea>
            <RightArea>
            <ButtonSnack
                activeOpacity={.9}
                active={active == 'drinks'}
                onPress={() => setActive('drinks')}
            >
                <TextSnack>Bebidas</TextSnack>
            </ButtonSnack>
            <BorderSnack active={active == 'drinks'} ></BorderSnack>
            </RightArea>
        </BackArea>
    )
}