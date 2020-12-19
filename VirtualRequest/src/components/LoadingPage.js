import React from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { height, width } = Dimensions.get('window');

function normalize(size) {
    return (width + height) / size
}

const Page = styled.SafeAreaView`
    height: ${props => props.height || height + 'px'};
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
    position: ${props => props.pos || 'relative'};
    padding-top: ${props => props.pdTop || 0}px;
    padding-bottom: ${props => props.pdBottom || normalize(10.2)}px;
    zIndex: 9;
`

export default (props) => (
    <Page height={props.height} pos={props.position} pdTop={props.pdTop} pdBottom={props.pdBottom} >
        <ActivityIndicator size='large' color='#fe9601' />
    </Page>
)