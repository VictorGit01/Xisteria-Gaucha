import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

const Page = styled.SafeAreaView`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`

export default () => {
    return (
        <Page>
            <ActivityIndicator size='large' color='#077a15' />
        </Page>
    )
}