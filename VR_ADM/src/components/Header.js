import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled.View`
    width: 100%;
    height: 8%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #077a15;   
`;

const Title = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: 700;
    color: #fff;
`;

export default function Header({ title, navigation }) {
    const goBack = navigation.goBack

    return (
        <Container>
            <BorderlessButton 
                onPress={goBack}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                style={{ marginHorizontal: 12, padding: 2 }} 
                rippleColor='rgba(0, 0, 0, .4)' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {/* <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} /> */}
                <Icon name='arrow-back' size={26} color='#fff' />
            </BorderlessButton>

                <Title>{title}</Title>

            <BorderlessButton
                onPress={() => nav('Resume')}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                style={{ marginHorizontal: 24, padding: 2 }} 
                rippleColor='rgba(0, 0, 0, .4)' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {/* <HeaderIcon source={require('../assets/icons/done_64px.png')} /> */}
                {/* <Icon name='done' size={26} color='#fff' /> */}
            </BorderlessButton>
        </Container>
    );
}