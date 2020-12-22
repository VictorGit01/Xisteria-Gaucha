import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, BackHandler, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

const { height } = Dimensions.get('window')

const heightReal = PixelRatio.getPixelSizeForLayoutSize(height)

const Page = styled.SafeAreaView`
    height: ${heightReal}px;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
`
// flex: 1;

const Within = styled.View`
    height: ${height}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: transparent;
`

export default (props) => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', props.onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', props.onBack)
        }
    }, [])

    return (
        <Page>
            <Within>
                <ActivityIndicator size='large' color='#fe9601' />
            </Within>
        </Page>
    )
}

// rgba de #077a15
// rgba(7, 122, 21)