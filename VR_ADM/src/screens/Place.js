import React from 'react'
import styled from 'styled-components/native'

const Page = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const Text = styled.Text`
    font-size: 20px;
`

const Screen = () => {
    return (
        <Page>
            <Text>Local</Text>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        title: 'Retirada'
    }
}

export default Screen