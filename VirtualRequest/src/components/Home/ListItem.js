import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { normalize } from '../../functions';
import styled from 'styled-components/native';
import firebase from '../../../firebase';

const { height, width } = Dimensions.get('window');

// function normalize(size) {
//     return (width + height) / size;
// }

const BottomItem = styled.View`
    height: ${height / 4.5}px;
    width: ${width / 2}px;
    padding: ${normalize(11.30)}px ${normalize(18.84)}px;
`;
// padding: ${normalize(100)}px ${normalize(60)}px;

const ButtonItem = styled.TouchableOpacity`
    
`

const BottomItemInner = styled.ImageBackground`
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    resize-mode: cover;
    border-radius: ${normalize(5)}px;
`;
// background-color: #ddd;

const Overlay = styled.View`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(7, 122, 21, .2);
    border-radius: ${normalize(5)}px;
`

const TextTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-style: italic;
    letter-spacing: ${normalize(1.5)}px;
    color: #fff;
`

export default (props) => {
    const [ image, setImage ] = useState(null)

    const { cityId, item, index, nav } = props

    const posts_img = firebase.storage().ref().child('posts')

    useEffect(() => {
        const dataId = item.id

        if (item.image) {
            posts_img.child(cityId).child('categories').child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                const source = { uri: url }

                setImage(source)
            })
        }
    }, [])

    return (
        <BottomItem key={index} >                    
            <ButtonItem
                onPress={() => nav('InfoCategory', { title: item.title, id: item.id, index: index })}
                activeOpacity={.9}
            >
                <BottomItemInner borderRadius={normalize(5)} source={image} >
                <Overlay>
                    <TextTitle>{item.title}</TextTitle>
                </Overlay>
                </BottomItemInner>
            </ButtonItem>
        </BottomItem>
    )
}