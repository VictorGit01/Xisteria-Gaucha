import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Paths:
import { normalize } from '../functions';

const Container = styled.View`
    width: 100%;
    height: ${normalize(56.5)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #077a15;
`
// padding-horizontal: ${normalize(15)}px;
// height: 8%;

const Title = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: 700;
    color: #fff;
`

export default function Header({ title, navigation, right_side, left_icon = 'arrow-back' }) {
    const nav = navigation.navigate
    const goBack = navigation.goBack

    return (
        <Container>
            <BorderlessButton 
                onPress={goBack}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                style={{ marginHorizontal: normalize(13), padding: normalize(3) }} 
                rippleColor='rgba(0, 0, 0, .4)' 
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                {/* <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} /> */}
                <Icon name={left_icon} size={normalize(24)} color='#fff' />
            </BorderlessButton>

                <Title>{title}</Title>

            <BorderlessButton
                onPress={() => {right_side && nav('Resume')}}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                // style={{ marginHorizontal: 12, padding: 2 }} 
                style={{ marginHorizontal: normalize(13), padding: normalize(3) }} 
                rippleColor={right_side ? 'rgba(0, 0, 0, .4)' : 'transparent'} 
                // rippleColor='transparent'
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                // activeOpacity={1}
            >
                {/* <HeaderIcon source={require('../assets/icons/done_64px.png')} /> */}
                <Icon name='done' size={normalize(24)} color={right_side ? '#fff' : 'transparent'} />
            </BorderlessButton>
        </Container>
    )
}