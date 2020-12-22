import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { normalize } from '../functions';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`;

const AddPhotoArea = styled.TouchableOpacity`
    height: 31.5%;
    width: 95%;
    justify-content: center;
    align-items: center;
    border: ${normalize(1)}px dashed #ccc;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`
// height: 220px;
// width: 90%;
// border: 1px dashed #ccc;
// border-radius: 3px;
// margin-vertical: 20px;

const ButtonAddPhoto = styled.TouchableOpacity``

const ImageArea = styled.View`
    height: 31.5%;
    width: 95%;
    justify-content: center;
    align-items: center;
    margin-vertical: ${normalize(20)}px;
`
// height: 220px;
// width: 100%;
// justify-content: center;
// align-items: center;
// margin-vertical: 20px;

const Image = styled.Image`
    height: 100%;
    width: 100%;
    border-radius: ${normalize(3)}px;
    resize-mode: stretch;
`
// height: 220px;
// width: 90%;
// resize-mode: cover;
// border-radius: 3px;
// margin-vertical: 20px;

const ButtonSave = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(40)}px;
`
// height: ${normalize(24)}px;
// border-radius: 3px;
// margin-vertical: 40px;

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold
    color: ${props => props.color || '#fff'};
`
// font-size: 18px;

const Screen = ({ navigation, bannerImg, setBannerImg }) => {
    const [ image, setImage ] = useState(null);
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext);

    const goBack = navigation.goBack

    useEffect(() => {
        if (bannerImg) {
            setImage(bannerImg)
        }
    }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    const selectImage = () => {
        const options = {
            noData: true
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {
                const source = { uri: response.uri }
                setImage(source)
                // newData.image = source
                // setDataDetails(newData)
                // console.log(source)
            }
        })
    }

    const handleSave = () => {
        if (!image) {
            toastMsg('Insira uma imagem.');
        } else {
            setLoaderVisible(true);

            setTimeout(() => {
                setBannerImg(image);
                setLoaderVisible(false);
                toastMsg('Imagem inserida.')
                console.log(image)
                goBack()
            }, 1500)
        }
    }

    return (
        <Page>
            {image !== null ? 
            <ImageArea>
                <Image source={image} />
                <ButtonAddPhoto
                    onPress={selectImage}
                    activeOpacity={.7}
                    style={{
                        padding: normalize(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fe9601',
                        borderRadius: normalize(3),
                        position: "absolute",
                        // right: normalize(28),
                        right: normalize(8),
                        bottom: normalize(8)
                    }}
                >
                    <ButtonText style={{ fontSize: normalize(12), fontWeight: 'bold' }} color='#fff' >ALTERAR IMAGEM</ButtonText>
                </ButtonAddPhoto>
            </ImageArea>:
            <AddPhotoArea
                onPress={selectImage}
                activeOpacity={.7}
            >
                {/* <ButtonAddPhoto
                    onPress={selectImage}
                    activeOpacity={.7}
                > */}
                    <Icon name='image-plus' size={normalize(35)} color='#ccc' />
                {/* </ButtonAddPhoto> */}
            </AddPhotoArea>}
            <ButtonSave 
                onPress={handleSave} 
                activeOpacity={.7} 
                underlayColor='#e5921a'
            >
                <ButtonText>Salvar</ButtonText>
            </ButtonSave>
        </Page>
    )
}

Screen.navigationOptions = ({ navigation }) => {
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    return {
        headerShown: true,
        headerTitle: 'Inserir banner',
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         <Icon name='menu' size={25} color='#fff' />
        //     </ButtonIcon>
        // )
    }
}

const mapStateToProps = state => {
    return {
        bannerImg: state.registerReducer.bannerImg,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBannerImg: (bannerImg) => dispatch({type: 'SET_BANNER_IMG', payload: { bannerImg }})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);