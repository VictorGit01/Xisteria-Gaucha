import React, { useEffect, useState, useContext } from 'react';
import { Dimensions, ToastAndroid } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { insertImage, wp, hp, normalize } from '../functions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../../firebase';
import NetInfo from '@react-native-community/netinfo';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

// Components:
import LoadingPage from '../components/LoadingPage';
import ButtonNoConnection from '../components/ButtonNoConnection';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     // return (width + height) / size
//     return (wp(width) + hp(height)) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`
// width: ${wp(360)};
// height: ${hp(640)};

// const Page = styled.SafeAreaView`
//     flex: 1;
//     align-items: center;
//     background-color: #fff;
// `;

const AddPhotoArea = styled.TouchableOpacity`
    height: 31.5%;
    width: 95%;
    justify-content: center;
    align-items: center;
    border: ${normalize(1)}px dashed #ccc;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`
// height: 200px;
// height: ${hp(200)}px;
// height: ${normalize(200)}px;
// width: 90%;

const ButtonChangePhoto = styled.TouchableOpacity``

const ImageArea = styled.View`
    height: 31.5%;
    width: 95%;
    justify-content: center;
    align-items: center;
    margin-vertical: ${normalize(20)}px;
`
// height: 200px;
// background-color: #eee;
// height: ${hp(200)}px;
// height: ${normalize(200)}px;
// height: 26.5%;

const Image = styled.Image`
    height: 100%;
    width: 100%;
    border-radius: ${normalize(3)}px;
    resize-mode: stretch;
`
// height: 200px;
// height: ${hp(200)}px;
// height: ${normalize(200)}px;
// width: 90%;
// margin-vertical: ${normalize(20)}px;

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
// margin-vertical: ${normalize(60)}px;

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold
    color: ${props => props.color || '#fff'};
`
// font-size: ${normalize(63)}px;

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const Screen = () => {
    const [ image, setImage ] = useState(null);
    const [ imgGallery, setImgGallery ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ noConnection, setNoConnection ] = useState(false);
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext);

    const currentCity = firebase.auth().currentUser;
    const cities = firebase.database().ref('cities');
    const posts_img = firebase.storage().ref().child('posts');

    // useEffect(() => {
    //     alert(`Normalize 200: ${normalize(200)}`)
    // }, [])

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    useEffect(() => {
        console.log('-----------------VALOR DE LOADING EM BANNER-----------------')
        console.log(loading)
    }, [loading])

    // useEffect(() => {
    //     NetInfo.fetch().then(state => {
    //         if (!state.isConnected) {
    //             endOfLoading()
    //             console.log('-----------------NÃO CHAMANDO IMAGE-----------------')
    //         } else {
    //             getImage()
    //             console.log('-----------------CHAMANDO IMAGE-----------------')
    //         }
    //     })
    // }, [])

    function onScreen() {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getImage()
            }
        })
    }

    function getImage() {
        if (currentCity) {
            const cityId = currentCity.uid;
            // let postId = '';

            cities.child(cityId).child('banner').on('value', snapshot => {
                let postId = snapshot.val().id
                let img = snapshot.val().image

                posts_img.child(cityId).child('banners').child(`${postId}.jpg`).getDownloadURL().then(url => {
                    const source = { uri: url }
    
                    setImage(source);
                    endOfLoading();
                });
                
                setImgGallery(img);
                
                console.log('----------SNAPSHOT.VAL() BANNER----------')
                console.log(postId)
            })

            // if (postId.length) {
                
            // }
        }
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function selectImage() {
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
                setImage(source);
                setImgGallery(source);
                // newData.image = source
                // setDataDetails(newData)
                // console.log(source)
            }
        })
    }

    // function saveNow(cityId, id) {
    //     const message = 'Image salva com sucesso!';
    //     // console.log('---------IMAGEM DIFERENTE DA ANTIGA---------')
    //     

    //     function finish() {
    //         try {
    //             cities.child(cityId).child('banner').child('image').set(image)
    //             setLoaderVisible(false)
    //         } catch(e) {
    //             setLoaderVisible(false)
    //             console.log(e)
    //             toastMsg(`${e.code} - ${e.message}`)
    //         }
    //     }
    // }

    function savePath(cityId) {
        cities.child(cityId).child('banner').child('image').set(image)
            .then(() => {
                setLoaderVisible(false)
                toastMsg('Imagem salva com sucesso!')
            })
            .catch(e => {
                setLoaderVisible(false)
                console.log(e)
                toastMsg(`${e.code} - ${e.message}`)
            })
    }

    function saveImage() {
        if (currentCity) {
            const cityId = currentCity.uid;
            let old_img = {};
            let id = '';

            setLoaderVisible(true)

            cities.child(cityId).child('banner').on('value', snapshot => {
                old_img = snapshot.val().image;
                id = snapshot.val().id
            })

            console.log('---------IMG GALLERY---------')
            console.log(imgGallery)

            console.log('---------OLD IMG---------')
            console.log(old_img)
            
                
            if (imgGallery.uri !== old_img.uri) {

                insertImage(cityId, id, image).then(resp => {
                    if (resp) {
                        savePath(cityId)
                    } else {
                        setLoaderVisible(false)
                    }
                })

            } else {
                
                setTimeout(() => {
                    setLoaderVisible(false)
                    toastMsg('Imagem salva.')
                }, 1500)

            }

            // cities.child(cityId).child('banner').on('value', snapshot => {
                //     const old_img = snapshot.val().image;
                //     const id = snapshot.val().id;

                //     console.log('---------IMG GALLERY---------')
                //     console.log(imgGallery)

                //     console.log('---------OLD IMG---------')
                //     console.log(old_img)
            // })
        }
    }

    function navigationEventsOnAndOutScreen() {
        return (
            <NavigationEvents
                onWillFocus={onScreen}
                // onWillBlur={outScreen}
            />
        )
    }

    if (loading) {
        return (
            <>
                {navigationEventsOnAndOutScreen()}
                <LoadingPage />
            </>
        );
    } else if (noConnection && !loading) {
        return (
            <Page style={{ justifyContent: 'center', backgroundColor: '#fff' }} >
                <NavigationEvents onWillFocus={onScreen} />
                
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={onScreen} />
            </Page>
        )
    }

    return (
        // <Page style={{ width: wp(360), height: hp(640) }} >
        <Page>
            {/* <NavigationEvents
                onWillFocus={onScreen}
            /> */}
            {navigationEventsOnAndOutScreen()}
            {image !== null ? 
            <ImageArea>
                <Image source={image} />
                <ButtonChangePhoto
                    onPress={selectImage}
                    activeOpacity={.7}
                    style={{
                        padding: normalize(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fe9601',
                        borderRadius: normalize(3),
                        position: "absolute",
                        // right: 28,
                        // right: wp(28),
                        right: normalize(8),
                        bottom: normalize(8),
                    }}
                >
                    <ButtonText style={{ fontSize: normalize(12), fontWeight: 'bold' }} color='#fff' >ALTERAR IMAGEM</ButtonText>
                </ButtonChangePhoto>
            </ImageArea>:
            <AddPhotoArea
                onPress={selectImage}
                activeOpacity={.7}
            >
                {/* <ButtonChangePhoto
                    onPress={selectImage}
                    activeOpacity={.7}
                > */}
                    {/* <Icon name='image-plus' size={35} color='#ccc' /> */}
                    <Icon name='image-plus' size={normalize(35)} color='#ccc' />
                {/* </ButtonChangePhoto> */}
            </AddPhotoArea>}
            <ButtonSave onPress={saveImage} underlayColor='#e5921a' >
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
        headerTitle: 'Banner',
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         <Icon name='menu' size={25} color='#fff' />
        //     </ButtonIcon>
        // )
        headerLeft: () => (
            <RectButton
                onPress={() => navigation.openDrawer()}
                style={{ 
                    padding: normalize(8), 
                    marginHorizontal: normalize(10), 
                    borderRadius: normalize(50),
                }}
                hitSlop={{ right: normalize(30), left: normalize(30) }}
            >
                <Icon name='menu' size={normalize(25)} color='#fff' />
            </RectButton>
        ),

        headerTitleContainerStyle: {
            width: '63%',
            position: 'relative',
            justifyContent: 'center',
        },

        headerTitleAlign: 'center',
    }
}

export default Screen;