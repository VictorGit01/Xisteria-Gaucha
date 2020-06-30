import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../../firebase'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'

const TopArea = styled.View`
    width: 100%;
    align-items: center;
`
// flex: 1;
// margin-vertical: 20px;

const TopInternalArea = styled.View`
    height: 140px;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 20px;
`
// padding-vertical: 20px;

const ImageArea = styled.View`
    flex: 1;
    height: 100%;
    background-color: rgb(245, 240, 235);
    border-radius: 5px;
    elevation: 2px;
`

const PriceArea = styled.View`
    flex: 1;
    height: 100%;
    justify-content: space-around;
    align-items: center;
`

const AmountArea = styled.View`
    width: 100px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Button = styled.TouchableHighlight`
    height: 40px;
    width: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
`

const PlusMinusIcon = styled.Image`
    height: 20px;
    width: 20px;
`

const TextPrice = styled.Text`
    font-size: 18px;
    color: #ff2626;
`

const ImageSnack = styled.Image`
    height: 100%;
    width: 100%;
    border-radius: 5px;
`

export default (props) => {
    const [ image, setImage ] = useState(null)
    const [ opacityImg, setOpacityImg ] = useState(new Animated.Value(0))
    // let opacityImg = new Animated.Value(0)

    const posts_img = firebase.storage().ref().child('posts')
    const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    let { data, priceInfo, amount, handleSum, handleSub } = props

    
    useEffect(() => {
        let dataId = data.id
        
        // console.log(opacityImg)
        
        if (data.image) {
            
            posts_img.child(cityId).child(`${dataId}.jpg`).getDownloadURL().then((url) => {
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

    // useEffect(() => {
    //     console.log(opacityImg)
    // }, [opacityImg])

    return (
        <TopArea>
            <TopInternalArea>
            <ImageArea>
                {/* <ImageSnack source={{uri: props.img}} /> */}
                {/* {image && <ImageSnack source={image} />} */}
                {image && <Animated.Image source={image} style={[styles.image_snack, { opacity: opacityImg }]} />}
            </ImageArea>
            <PriceArea>
                <TextPrice>R$ {priceInfo.toFixed(2).replace('.', ',')} </TextPrice>
                {/* <TextPrice>13</TextPrice> */}
                <AmountArea>
                    <Button onPress={handleSub} underlayColor='rgba(0, 0, 0, .05)' >
                    {/* <Button underlayColor='rgba(0, 0, 0, .05)' > */}
                        {/* <PlusMinusIcon source={require('../../assets/icons/minus.png')} /> */}
                        {/* <FontIcon name='minus' size={20} color='#ff2626' /> */}
                        <Icon name='remove' size={25} color='#ff2626' />
                    </Button>
                    <TextPrice>{amount}</TextPrice>
                    {/* <TextPrice>1</TextPrice> */}
                    <Button onPress={handleSum} underlayColor='rgba(0, 0, 0, .05)' >
                    {/* <Button underlayColor='rgba(0, 0, 0, .05)' > */}
                        {/* <PlusMinusIcon source={require('../../assets/icons/plus.png')} /> */}
                        {/* <FontIcon name='plus' size={20} color='#ff2626' /> */}
                        <Icon name='add' size={25} color='#ff2626' />
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
        borderRadius: 5,
    }
})