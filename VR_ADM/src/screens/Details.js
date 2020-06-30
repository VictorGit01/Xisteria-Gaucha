import React, { useEffect, useState, useContext } from 'react'
import { ToastAndroid, Keyboard } from 'react-native'
import styled from 'styled-components/native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'uuid/v4'
import firebase from '../../firebase'
import { NavigationEvents } from 'react-navigation'

import DataDetailsContext from '../contexts/DataDetailsContext'

// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest


// const tempWindowXMLHttpRequest = window.XMLHttpRequest
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob

// window.XMLHttpRequest = tempWindowXMLHttpRequest

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    height: 50px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    border-bottom-width: .5px;
    border-color: #999;
    padding-left: 20px;
`

const HeaderTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #999;
`

const TopAndMiddleArea = styled.View`
    min-height: 450px;
    width: 100%;
    align-items: center;
`

const AddPhotoArea = styled.TouchableOpacity`
    height: 200px;
    width: 90%;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ccc;
    border-radius: 3px;
    margin-vertical: 20px;
`

const ButtonAddPhoto = styled.TouchableOpacity``

const ImageArea = styled.View`
    height: 200px;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-vertical: 20px;
`

const Image = styled.Image`
    height: 200px;
    width: 90%;
    resize-mode: cover;
    border-radius: 3px;
    margin-vertical: 20px;
`

const Input = styled.TextInput`
    height: ${props => props.height || '40px'};
    width: 90%;
    border: 1px solid #999;
    border-radius: 3px;
    padding: 0px;
    padding-left: 10px;
    font-size: 18px;
    margin-bottom: 20px;
`

const ButtonArea = styled.View`
    height: 40px;
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-vertical: 20px;
`

const ButtonChoose = styled.TouchableHighlight`
    height: 100%;
    width: 45%;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor || '#fe9601'};
    border: 1px solid #fe9601;
    border-radius: 3px;
`

const ButtonText = styled.Text`
    font-size: 18px;
    color: ${props => props.color || '#fff'};
`

const Screen = (props) => {
    const [ image, setImage ] = useState(null)
    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ dataDetails, setDataDetails ] = useContext(DataDetailsContext)

    let { navigation } = props
    // let { name, description, price } = dataDetails

    let nav = navigation.navigate
    let goBack = navigation.goBack
    let params = navigation.state.params
    let sectionId = params.section.id
    let editEnabled = params.editEnabled
    let dataId = params.dataId
    let dataImg = params.dataImg
    let data = params.data

    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    const cityId = firebase.auth().currentUser.uid

    let newData = JSON.parse(JSON.stringify(dataDetails))

    // let dataDetailsCopy = JSON.parse(JSON.stringify(dataDetails))
    let data_id = uuid()

    useEffect(() => {
        // console.log(data)
        if (editEnabled) {
            function getSection() {
                posts.child(cityId).child(sectionId).child('data').child(dataId).on('value', snapshot => {
                    if (snapshot.val()) {
                        setName(snapshot.val().name)
                        setDescription(snapshot.val().description)
                        setPrice(snapshot.val().price)
                        setDataDetails(snapshot.val())
                        // console.log(snapshot.val())
                    }
                })
            }

            if (dataImg) {
                posts_img.child(cityId).child('items').child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                    const source = { uri: url }
                    setImage(source)
                    // console.log(source)
                    getSection()
                })
            } else {
                getSection()
            }
        } else {
            newData.id = data_id
            setDataDetails(newData)
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

    const onChangePrice = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        // newData.price = cleaned
        // setDataDetails(newData)
        setPrice(cleaned)
    }

    // const postImage = () => {
    //     let uri = response.uri.replace('file://', '')
    //     let imagem = firebase.storage().ref().child('images').child('imagem2.jpg')
    //     let mime = 'image/jpeg'

    //     RNFetchBlob.fs.readFile(uri, 'base64')
    //     .then((data) => {
    //         return RNFetchBlob.polyfill.Blob.build(data, {type:mime+';BASE64'})
    //     })
    //     .then((blob) => {

    //         imagem.put(blob, {contentType:mime})
    //         .then(() => {
    //             blob.close()
                
    //             // let url = imagem.getDownloadURL()

    //             imagem.getDownloadURL().then((url) => {

    //                 setImage({ uri: url })
                    
    //             })

    //             alert('Terminou o processo!')
    //         })
    //         .catch((error) => {
    //             alert(error.code)
    //         })

    //     })
    // }

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
                newData.image = source
                setDataDetails(newData)
                // console.log(source)
            }
        })
    }

    const handleAdvance = () => {
        if (name.trim().length < 1) {
            toastMsg('Digite o nome do item.')
        } else {
            console.log(dataDetails.image)
            newData.name = name
            newData.description = description
            newData.price = price
            setDataDetails(newData)
            Keyboard.dismiss()
            nav('AddOns')
        }

        // if ((name && price).trim().length > 0) {
        //     let posts = firebase.database().ref('posts')
        //     let post_id = params.section.id
        //     let newPost = JSON.parse(JSON.stringify(params.section))
        //     let id = uuid()

        //     newPost.data.push({
        //         id,
        //         name,
        //         price,
        //         description
        //     })
        //     // console.log(newPost)
        //     posts.child(post_id).set(newPost)
        //     .then((resp) => {
        //         setName('')
        //         setDescription('')
        //         setPrice('')
        //         alert('Item inserido com sucesso!')
        //         // console.log(resp)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        //     // posts.child(post_id).on('value', snapshot => {
        //     //     let newSnapshot = JSON.parse(JSON.stringify(snapshot.val))
        //     //     newSnapshot['data'] = 
        //     // })
        // } else {
        //     alert('Preencha os campos')
        // }
    }

    // useEffect(() => {
    //     console.log(dataDetails)
    // }, [dataDetails])

    const clear = () => {
        // newData.name = ''
        // newData.description = ''
        // newData.price = ''
        // setDataDetails(newData)
    }

    return (
        <Page>
            <Scroll
                contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps='handled'
            >
                <NavigationEvents
                    // onWillFocus={payload => console.log('will focus', payload)}
                    // onDidFocus={payload => console.log('did focus', payload)}
                    // onWillBlur={payload => console.log('will blur', payload)}
                    // onDidBlur={payload => console.log('did blur', payload)}
                    onWillBlur={clear}
                />
                <Header>
                    <HeaderTitle>Detalhes</HeaderTitle>
                </Header>
                <TopAndMiddleArea>
                {image !== null ? 
                <ImageArea>
                <Image source={image} />
                <ButtonAddPhoto
                    onPress={selectImage}
                    activeOpacity={.7}
                    style={{
                        padding: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fe9601',
                        borderRadius: 3,
                        position: "absolute",
                        right: 28,
                        bottom: 8
                    }}
                >
                    <ButtonText style={{ fontSize: 12, fontWeight: 'bold' }} color='#fff' >ALTERAR IMAGEM</ButtonText>
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
                        <Icon name='image-plus' size={35} color='#ccc' />
                    {/* </ButtonAddPhoto> */}
                </AddPhotoArea>}
                <Input
                    // value={name}
                    onChangeText={(t) => setName(t)}
                    value={name}
                    // onChangeText={text => {
                    //     newData.name = text
                    //     setDataDetails(newData)
                    // }}
                    placeholder='Nome'
                />
                <Input
                    // value={description}
                    onChangeText={(t) => setDescription(t)}
                    value={description}
                    // onChangeText={text => {
                    //     newData.description = text
                    //     setDataDetails(newData)
                    // }}
                    placeholder='Descrição (opcional)'
                    height='60px'
                    // numberOfLines={3}
                    multiline={true}
                    // maxLength={10}
                />
                <Input
                    // value={price}
                    // onChangeText={(t) => setPrice(t)}
                    value={price}
                    onChangeText={text => onChangePrice(text)}
                    placeholder='Preço'
                    keyboardType='numeric'
                />
                </TopAndMiddleArea>
                <ButtonArea>
                    <ButtonChoose
                        onPress={() => nav('Menu')}
                        bgColor='#fff'
                        underlayColor='#eee'
                    >
                        <ButtonText color='#fe9601' >Cancelar</ButtonText>
                    </ButtonChoose>

                    <ButtonChoose
                        onPress={handleAdvance}
                        underlayColor='#f18b00'
                    >
                        <ButtonText>Próximo</ButtonText>
                    </ButtonChoose>
                </ButtonArea>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        tabBarLabel: 'Detalhes'
    }
}

export default Screen