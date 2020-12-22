import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { normalize } from '../../functions';
import styled from 'styled-components/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../../firebase';

const { height, width } = Dimensions.get('window');

// function normalize(size) {
//     return (width + height) / size
// }

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
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
`
// padding-horizontal: 15px;

const ItemArea = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-color: #000;
    padding: ${normalize(10)}px ${normalize(15)}px;
`
// padding: ${normalize(120)}px 15px;
// padding: ${normalize(9.42)}px ${normalize(15)}px;

const ItemImage = styled.Image`
    height: ${normalize(70.68)}px;
    width: ${normalize(86.99)}px;
    background-color: #fff0da;
    border-radius: ${normalize(5)}px;
    resize-mode: cover;
    margin-left: ${normalize(5)}px;
    shadow-radius: ${normalize(5)}px;
`
// height: ${normalize(16)}px;
// width: ${normalize(13)}px;

const ItemText = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    color: ${props => props.color || '#ff2626'};
`
// margin-horizontal: ${normalize(110)}px;
// font-size: ${props => props.size || normalize(72)}px;

const LeftArea = styled.View`
    flex: .4;
    justify-content: space-between;
`
// flex: .8;
// flex: .6
// width: 20%;

const RightArea = styled.View`
    flex: 1
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-horizontal: ${normalize(20)}px;
`
// justify-content: flex-start;
// justify-content: space-between;
// flex: 1.8;

// const Title = styled.Text`
//     font-size: 18px;
// `

export default (props) => {
    const [ image, setImage ] = useState(null)

    const { item, navigation, cityId } = props
    const nav = navigation.navigate
    const params = navigation.state.params

    const posts_img = firebase.storage().ref().child('posts')

    let price = Number(item.price)

    useEffect(() => {
        // alert(`NORMALIZE 50: ${normalize(50)}`)
        // alert(`HEIGHT: ${height}`)
        // alert(`WIDTH: ${width}`)
    }, [])

    useEffect(() => {
        const dataId = item.id
        console.log('ID dos items')
        console.log(dataId)
        if (item.image) {
            posts_img.child(cityId).child('items').child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                const source = { uri: url }
    
                setImage(source)
                // console.log(source)
            })
        }
    }, [])

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        return num_format
    }

    return (
        <Item
            onPress={() => nav('InfoSnack', { name: item.name, data: item, sectionId: params.id, sectionIndex: params.index })}
            underlayColor='rgba(0, 0, 0, .03)'
            disabled={!item.publish}
        >
            <>
                <ItemArea>
                    <LeftArea style={{ width: item.description ? '20%' : '40%' }} >
                        <ItemText style={{ marginVertical: normalize(5) }} >{item.name}</ItemText>
                        {/* <ItemText style={{ marginVertical: 5 }} color='#000' >R$ {price.toFixed(2).replace('.', ',')}</ItemText> */}
                        <ItemText style={{ marginVertical: normalize(5) }} color='#000' >{onPriceChange(price.toFixed(2))}</ItemText>
                    </LeftArea>
                    {item.description ? <RightArea>
                        <ItemText color='#999' numberOfLines={2} >{item.description}</ItemText>
                        {/* {!item.image && <Icon name='keyboard-arrow-right' size={normalize(57)} color='#999' />} */}
                    </RightArea> : null}
                    {item.image && <ItemImage source={image} />}
                </ItemArea>
                {!item.publish && <OverlayContainer>
                    {/* <Icon name='not-interested' size={20} color='#ff2626' /> */}
                    <ItemText style={{ fontSize: normalize(18), marginLeft: normalize(10) }} >Produto Indisponível</ItemText>
                </OverlayContainer>}
            </>
        </Item>
    )
}