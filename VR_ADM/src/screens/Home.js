import React from 'react'
import styled from 'styled-components/native'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
`

const Title = styled.Text`
    font-size: 20px;
`

const Screen = () => {
    return (
        <Page>
            <Title>Tela Home</Title>
        </Page>
    )
}


Screen.navigationOptions = () => {
    return {
        headerTitle: 'ADM'
    }
}

export default Screen