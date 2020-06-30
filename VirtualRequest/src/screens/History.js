import React, { useEffect, useContext } from 'react'
import styled from 'styled-components/native'

// Contexts:
import ToTopContext from '../contexts/ToTopContext'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Screen = () => {
    const [ top, setTop ] = useContext(ToTopContext)

    useEffect(() => {
        setTop(true)
    }, [])

    return (
        <Page>

        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Histórico de pedidos'
    }
}

export default Screen