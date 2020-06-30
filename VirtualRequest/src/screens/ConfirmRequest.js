import React from 'react'
import styled from 'styled-components/native'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Text = styled.Text`
    font-size: 18px;
    font-weight: bold;
`

const Screen = () => {
    return (
        <Page>
            
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Info. Pedido'
    }
}

export default Screen