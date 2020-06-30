import React from 'react';
import styled from 'styled-components/native';

const Page = styled.SafeAreaView`
    flex: 1;
    width: 100%
    justify-content: center;
    align-items: center;
    background-color: green;
    position: absolute;
    zIndex: 9;
    top: 0;
`

export default () => {
    return (
        <Page />
    )
}