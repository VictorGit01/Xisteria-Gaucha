import React, { useEffect, useState, useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ComuIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'uuid/v4'
const firebase = require('firebase')
// const firebase = require('firebase')
// require('firebase/firestore')
// require('firebase/firestore')

// list:
import listDetails from '../../menu_list/listDetails'

// Contexts:
import MenuListContext from '../../contexts/MenuListContext'
import LoaderContext from '../../contexts/LoaderContext'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob


const Area = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5) 
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

const Box = styled.TouchableOpacity`
    width: 75%;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px 10px 20px 10px;
`
// height: 250px;

const Header = styled.View`
    height: 40px
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const BoxBody = styled.View`
    justify-content: center;
    align-items: center;
`
// flex: 1.2;
// justify-content: flex-end;

const ImageArea = styled.TouchableOpacity`
    height: 140px;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-vertical: 20px;
`

const AddPhotoArea = styled.TouchableOpacity`
    height: 140px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ccc;
    border-radius: 3px;
    margin-vertical: 20px;
`

const Image = styled.Image`
    height: 140px;
    width: 100%;
    resize-mode: cover;
    border-radius: 3px;
`

const BoxFooter = styled.View`
    
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 10px;
`
// flex: 1;

const Title = styled.Text`
    font-size: 18px;
`

const Text = styled.Text`
    font-size: 12px;
    color: ${props => props.color ? props.color : '#000'}
`

const TextCaption = styled.Text`
    font-size: 10px;
    color: #999
    align-self: flex-end
`

const TextButton = styled.Text`
    font-size: 16px;
    color: ${props => props.color ? props.color : '#fe9601'}
`

const Input = styled.TextInput`
    height: 40px;
    width: 100%;
    border: 1px solid #000;
    border-radius: 2px;
    padding: 10px;
`

const ButtonClose = styled.TouchableOpacity`
    height: 100%;
    width: 40px;
    justify-content: center;
    align-items: center;
`

const ButtonModal = styled.TouchableOpacity`
    height: 40px;
    width: 48%
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor? props.bgColor : '#fff'}
    border: 1px solid #fe9601
    border-radius: 2px;
`

export default (props) => {
    const [ image, setImage ] = useState(null)
    const [ imgGallery, setImgGallery ] = useState(null)
    const [ nameCTG, setNameCTG ] = useState('')
    // const [ menuList, setMenuList ] = useContext(MenuListContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    const cityId = firebase.auth().currentUser.uid

    let {
        modalVisible, setModalVisible,
        section, editEnabled, postId
    } = props

    // const postId = section.id

    useEffect(() => {
        if (modalVisible && editEnabled) {
            function getData() {
                setNameCTG(section.title)
                setImgGallery(section.image)
            }

            posts_img.child(cityId).child('categories').child(`${postId}.jpg`).getDownloadURL().then(url => {
                const source = { uri: url }

                setImage(source)
                getData()
            })
        }
    }, [modalVisible])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    const handleClose = () => {
        setModalVisible(false)
        setImage(null)
        setNameCTG('')
        // setFocusedInput(false)
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
                setImgGallery(source)
            }
        })
    }

    const uploadPost = (post, ctg) => {
        let posts = firebase.database().ref('posts')
        // posts.child(id).set({
        //     title: post.title,
        //     data: post.data
        // })

        // if (postId ) {
        // if (editEnabled) {
        //     posts.child(cityId).child(postId).child('title').set(post.title)
        //     .then(() => {
        //         setLoaderVisible(false)
        //         toastMsg('Categoria salva.')
        //     })
        //     .catch((error) => {
        //         setLoaderVisible(false)
        //         console.log(error)
        //         toastMsg(`${error.code} - ${error.message}`)
        //     })
        // } else {
            // posts.child(cityId).push({
            //     title: post.title,
            //     data: post.data,
            //     publish: false,
            //     // id: uuid()
            // })
            posts.child(cityId).child(post.id).set(post)
            .then(() => {
                setTimeout(() => {
                    setLoaderVisible(false)
                    setImage(null)
                    setNameCTG('')
                    toastMsg('Categoria salva.')
                }, 2000)
            })
            .catch((error) => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
            })
        // }

        // const uploadData = {
        //     id: id,
        //     title: post.title,
        //     data: post.data
        // }
        // return firebase
        // .firestore()
        // .collection('posts')
        // .doc(id)
        // .set(uploadData)
        // .then((resp) => {
        //     console.log(resp)
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
    }

    const saveImage = () => {
        const id = editEnabled ? postId : uuid()
        const post = editEnabled ? section :
        {
            title: nameCTG,
            data: [],
            id: id,
            image: image,
            publish: false,
        }

        let old_uri = editEnabled ? section.image.uri : ''
        let ver_image = ''
        console.log('Antiga URI')
        console.log(old_uri)

        console.log('Nova URI')
        console.log(imgGallery)

        // console.log('Nova URI')
        // console.log(image.uri.replace('file://', ''))

        // posts.child(cityId).child(id).on('value', snapshot => {
        //     let snapCopy = snapshot.val() ? JSON.parse(JSON.stringify(snapshot.val())) : {}
        //     if (snapshot.val()) {
        //         // post = snapshot.val()
        //         ver_image = snapshot.val().image
        //     }
        //     // if (snapCopy.image) {
        //     //     old_uri = snapshot.val().image.uri
        //     // }
        // })

        // console.log('Image')
        // console.log(ver_image)

        if (old_uri !== imgGallery.uri) {
            let uri = image.uri.replace('file://', '')
            let img = posts_img.child(cityId).child('categories').child(`${id}.jpg`)
            let mime = 'image/jpeg'
    
            RNFetchBlob.fs.readFile(uri, 'base64')
            .then((data) => {
                return RNFetchBlob.polyfill.Blob.build(data, {type: mime+';BASE64'})
            })
            .then((blob) => {
    
                img.put(blob, {contentType: mime})
                .then(() => {
                    blob.close()
                    
                    // posts.child(post_id).child('data').child(dataId).child('same').set(true)
                    // dataDetails.same = true
                    // setDataDetails(dataDetails)
                    // post.image = image
                    console.log('Post 1')
                    console.log(post)
                    
                    setTimeout(() => {
                        uploadPost(post)
                    }, 1500)
                })
                .catch((error) => {
                    setLoaderVisible(false)
                    console.log(error)
                    toastMsg('Error 1 encontrado')
                })
    
            })
            .catch((error) => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg('Error 2 encontrado')
            })
        } else {
            console.log('Post 2')
            console.log(post)
            uploadPost(post)
        }
    }

    const handleSave = () => {
        if (nameCTG.length < 1 && !image) {
            toastMsg('Insira uma imagem e preencha o campo.')
        } else if (!image) {
            toastMsg('Insira uma imagem para categoria.')
        } else if (nameCTG.length < 1) {
            toastMsg('Digite o nome da categoria.')
        } else {
            setModalVisible(false)
            setLoaderVisible(true)
            try{
                // const post = {
                //     title: nameCTG,
                //     data: [],
                //     id: id
                // }
    
                saveImage()
                // uploadPost(post, nameCTG)
                // setNameCTG('')
                // setModalVisible(false)
                // alert('Enviado com sucesso!')
            } catch(e) {
                console.error(e)
            }
        }
    }

    // useEffect(() => {
    //     // console.log(listDetails)
    //     // console.log(listDetails[1].data)
    //     // setFocusedInput(true)
    // }, [])

    // useEffect(() => {
    //     if (modalVisible) {
    //         console.log(props.postId)
    //     }
    // }, [modalVisible])
    
    return (
        <Modal
            visible={modalVisible}
            onRequestClose={handleClose}
            transparent={true}
            // animated={true}
            animationType='fade'
            // presentationStyle='pageSheet'
            // presentationStyle='formSheet'
            // presentationStyle='fullScreen'
            // presentationStyle='overFullScreen'
        >
            <Area>
                <Box
                    activeOpacity={1}
                >
                    <Header>
                        <Title>{editEnabled ? 'Editar' : 'Criar'} categoria</Title>
                        <ButtonClose onPress={handleClose} >
                            {/* <TextButton color='#fe9601' >X</TextButton> */}
                            {/* <FontIcon name='times' size={20} color='#fe9601' /> */}
                            <Icon name='close' size={23} color='#fe9601' />
                        </ButtonClose>
                    </Header>
                    <BoxBody>
                        {image ?
                        <ImageArea onPress={selectImage} >
                            <Image source={image} />
                        </ImageArea>
                        :
                        <AddPhotoArea onPress={selectImage} >
                            <ComuIcon name='image-plus' size={28} color='#ccc' />
                        </AddPhotoArea>}
                        <Text style={{ alignSelf: 'flex-start' }} >NOME DA CATEGORIA</Text>
                        <Input
                            value={nameCTG}
                            onChangeText={(t) => setNameCTG(t)}
                            autoFocus={true}
                            maxLength={25}
                            // prop para inserir imagem no lado esquesdo campo de texto
                            // inlineImageLeft='search_icon'
                        />
                        <TextCaption>{nameCTG.length}/25 caracteres</TextCaption>
                    </BoxBody>
                    <BoxFooter>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleClose}
                        >
                            <TextButton>Cancelar</TextButton>
                        </ButtonModal>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleSave}
                            bgColor='#fe9601'
                        >
                            <TextButton color='#fff' >Salvar</TextButton>
                        </ButtonModal>
                    </BoxFooter>
                </Box>
            </Area>
        </Modal>
    )
}