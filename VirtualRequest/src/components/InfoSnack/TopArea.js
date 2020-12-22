import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { normalize } from '../../functions'
import styled from 'styled-components/native'
import firebase from '../../../firebase'
// import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'

const TopArea = styled.View`
    width: 100%;
    align-items: center;
`
// flex: 1;
// margin-vertical: 20px;

const TopInternalArea = styled.View`
    height: ${normalize(140)}px;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: ${normalize(20)}px;
`
// padding-vertical: 20px;

const ImageArea = styled.ImageBackground`
    flex: 1;
    height: 100%;
    background-color: rgb(245, 240, 235);
    border-radius: ${normalize(5)}px;
    elevation: 2;
`

const ButtonImage = styled.TouchableOpacity``

const PriceArea = styled.View`
    flex: 1;
    height: 100%;
    justify-content: space-around;
    align-items: center;
`

const AmountArea = styled.View`
    width: ${normalize(100)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Button = styled.TouchableHighlight`
    height: ${normalize(40)}px;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
    border-radius: ${normalize(20)}px;
`

// const PlusMinusIcon = styled.Image`
//     height: 20px;
//     width: 20px;
// `

const TextPrice = styled.Text`
    font-size: ${normalize(18)}px;
    color: #ff2626;
`

// const ImageSnack = styled.Image`
//     height: 100%;
//     width: 100%;
//     border-radius: 5px;
// `

export default (props) => {
    const [ image, setImage ] = useState(null)
    const [ opacityImg, setOpacityImg ] = useState(new Animated.Value(0))
    // let opacityImg = new Animated.Value(0)

    const posts_img = firebase.storage().ref().child('posts')
    // const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    let { cityId, data, priceInfo, amount, handleSum, handleSub, nav } = props

    
    useEffect(() => {
        let dataId = data.id
        
        console.log('------------DATA TOP_AREA------------')
        console.log(data.id)
        
        if (data.image) {
            
            posts_img.child(cityId).child('items').child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                const source = { uri: url }

                setImage(source)

                Animated.timing(
                    opacityImg,
                    {
                        toValue: 1,
                        duration: 500
                    }
                ).start()
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
            // console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            // console.log(intCleaned)
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

    // useEffect(() => {
    //     console.log(opacityImg)
    // }, [opacityImg])

    return (
        <TopArea>
            <TopInternalArea>
            <ImageArea source={require('../../assets/images/fast-food-background.jpg')} imageStyle={{ borderRadius: normalize(5) }} >
                <ButtonImage 
                    onPress={() => nav('ViewImage', { cityId, data, image })}
                    activeOpacity={1}
                >
                    {/* <ImageSnack source={{uri: props.img}} /> */}
                    {/* {image && <ImageSnack source={image} />} */}
                    {/* {image && <Animated.Image source={image} style={[styles.image_snack, { opacity: opacityImg }]} />} */}
                    {image && <Animated.Image source={image} style={[styles.image_snack, { opacity: opacityImg }]} /> }
                    {/* // <ImageSnack source={require('../../assets/images/fast-food-background.jpg')} /> */}
                    {/* require('../../assets/images/fast-food-background.jpg') */}
                </ButtonImage>
            </ImageArea>
            <PriceArea>
                {/* <TextPrice>R$ {priceInfo.toFixed(2).replace('.', ',')} </TextPrice> */}
                <TextPrice>{onPriceChange(priceInfo.toFixed(2))}</TextPrice>
                {/* <TextPrice>13</TextPrice> */}
                <AmountArea>
                    <Button onPress={handleSub} underlayColor='rgba(0, 0, 0, .05)' >
                    {/* <Button underlayColor='rgba(0, 0, 0, .05)' > */}
                        {/* <PlusMinusIcon source={require('../../assets/icons/minus.png')} /> */}
                        {/* <FontIcon name='minus' size={20} color='#ff2626' /> */}
                        <Icon name='remove' size={normalize(25)} color='#ff2626' />
                    </Button>
                    <TextPrice>{amount}</TextPrice>
                    {/* <TextPrice>1</TextPrice> */}
                    <Button onPress={handleSum} underlayColor='rgba(0, 0, 0, .05)' >
                    {/* <Button underlayColor='rgba(0, 0, 0, .05)' > */}
                        {/* <PlusMinusIcon source={require('../../assets/icons/plus.png')} /> */}
                        {/* <FontIcon name='plus' size={20} color='#ff2626' /> */}
                        <Icon name='add' size={normalize(25)} color='#ff2626' />
                    </Button>
                </AmountArea>
            </PriceArea>
            </TopInternalArea>
        </TopArea>
    )
}

// '../assets/icons/minus.png'
// '../assets/icons/plus.png'

// flex: 1;
// height: 100%;
// background-color: rgb(245, 240, 235);
// border-radius: 5px;
// elevation: 2px;

const styles = StyleSheet.create({
    image_snack: {
        height: '100%',
        width: '100%',
        borderRadius: normalize(5),
        backgroundColor: '#d3d3d3',
    }
})