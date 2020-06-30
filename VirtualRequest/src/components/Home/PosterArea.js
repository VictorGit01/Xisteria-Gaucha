import React from 'react'
import styled from 'styled-components/native'

const Area = styled.View`
    flex: .6
    flex-direction: row;
    background-color: rgb(245, 240, 230);
`
//background-color: rgb(245, 240, 235)

const Poster = styled.Image`
    height: 100%;
    width: 100%
`

export default () => (
    <Area>
        <Poster source={{uri: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg'}} />
    </Area>
)