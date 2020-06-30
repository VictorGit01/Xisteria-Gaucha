import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../../firebase';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const { height, width } = Dimensions.get('window');

function normalize(size) {
    return (width + height) / size
}

const OverlayContainer = styled.View`
    height: 100%
    width: 100%
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, .4);
    position: absolute
    zIndex: 3;
`

const Item = styled.TouchableHighlight`
    justify-content: center;
    align-items: center;
    border-bottom-width: .5px;
`
// padding-horizontal: 15px;

const ItemArea = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    
    border-color: #000;
    padding: ${normalize(120)}px 15px;
    
`

const ItemImage = styled.Image`
    height: ${normalize(16)}px;
    width: ${normalize(13)}px;
    background-color: #fff0da;
    border-radius: 5px;
    resize-mode: cover;
    margin-left: 5px;
    shadow-radius: 5px;
`

const ItemText = styled.Text`
    font-size: ${props => props.size || normalize(72)}px;
    color: ${props => props.color || '#ff2626'};
`
// margin-horizontal: ${normalize(110)}px;

const LeftArea = styled.View`
    width: 20%
    justify-content: space-between;
`
// flex: .8;

const RightArea = styled.View`
    
    flex: 1
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-horizontal: 20px;
`
// justify-content: flex-start;
// justify-content: space-between;
// flex: 1.8;

const Title = styled.Text`
    font-size: 18px;
`

export default (props) => {
    const [ image, setImage ] = useState(null)

    const { item, navigation, cityId } = props
    const nav = navigation.navigate
    const params = navigation.state.params

    const posts_img = firebase.storage().ref().child('posts')

    let price = Number(item.price)

    useEffect(() => {
        const dataId = item.id
        if (item.image) {
            posts_img.child(cityId).child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                const source = { uri: url }
    
                setImage(source)
                // console.log(source)
            })
        }
    }, [])

    return (
        <Item
            onPress={() => nav('InfoSnack', { name: item.name, data: item, sectionId: params.id, sectionIndex: params.index })}
            underlayColor='rgba(0, 0, 0, .03)'
            disabled={!item.publish}
        >
            <>
                <ItemArea>
                    <LeftArea>
                        <ItemText style={{ marginVertical: 5 }} >{item.name}</ItemText>
                        <ItemText style={{ marginVertical: 5 }} color='#000' >R$ {price.toFixed(2).replace('.', ',')}</ItemText>
                    </LeftArea>
                    <RightArea>
                        <ItemText color='#999' numberOfLines={2} >{item.description}</ItemText>
                        {!item.image && <Icon name='keyboard-arrow-right' size={normalize(57)} color='#999' />}
                    </RightArea>
                    {item.image && <ItemImage source={image} />}
                </ItemArea>
                {!item.publish && <OverlayContainer>
                    <Icon name='not-interested' size={20} color='#ff2626' />
                    <ItemText style={{ fontSize: 18, marginLeft: 10 }} >Produto Indisponível</ItemText>
                </OverlayContainer>}
            </>
        </Item>
    )
}