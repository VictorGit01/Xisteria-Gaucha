import React, { useContext } from 'react'
import { NavigationEvents } from 'react-navigation'
import styled from 'styled-components/native'

import LoaderContext from '../contexts/LoaderContext'

const Page = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const Text = styled.Text`
    font-size: 20px;
`

const Screen = () => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    return (
        <Page>
            <NavigationEvents
                onWillFocus={() => setLoaderVisible(false)}
            />
            <Text>Delivery</Text>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        title: 'Delivery'
    }
}

export default Screen