import React, { useEffect, useState, useContext } from 'react'
import { Modal, ToastAndroid, View } from 'react-native'
import { normalize } from '../../functions'
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
import LoadingPage from '../LoadingPage'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob


const Area = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

const Box = styled.TouchableOpacity`
    width: 75%;
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(10)}px ${normalize(10)}px ${normalize(20)}px ${normalize(10)}px;
`
// height: 250px;
// height: 52%;
// height: ${normalize(370)}px;

const Header = styled.View`
    height: ${normalize(40)}px;
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
    height: ${normalize(140)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-vertical: ${normalize(20)}px;
`

const AddPhotoArea = styled.TouchableOpacity`
    height: ${normalize(140)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border: ${normalize(1)}px dashed #ccc;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`

const Image = styled.Image`
    height: ${normalize(140)}px;
    width: 100%;
    resize-mode: cover;
    border-radius: ${normalize(3)}px;
`

const BoxFooter = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: ${normalize(10)}px;
`
// flex: 1;

const Title = styled.Text`
    font-size: ${normalize(18)}px;
`

const Text = styled.Text`
    font-size: ${normalize(12)}px;
    color: ${props => props.color ? props.color : '#000'}
`

const TextCaption = styled.Text`
    font-size: ${normalize(10)}px;
    color: #999;
    align-self: flex-end;
`

const TextButton = styled.Text`
    font-size: ${normalize(16)}px;
    color: ${props => props.color ? props.color : '#fe9601'}
`

const Input = styled.TextInput`
    height: ${normalize(40)}px;
    width: 100%;
    border: ${normalize(1)}px solid #000;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(10)}px;
`

const ButtonClose = styled.TouchableOpacity`
    height: 100%;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
`

const ButtonModal = styled.TouchableHighlight`
    height: ${normalize(40)}px;
    width: 48%
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor? props.bgColor : '#fff'}
    border: ${normalize(1)}px solid #fe9601
    border-radius: ${normalize(2)}px;
`

export default (props) => {
    const [ loading, setLoading ] = useState(false)
    const [ image, setImage ] = useState(null)
    const [ imgGallery, setImgGallery ] = useState(null)
    const [ nameCTG, setNameCTG ] = useState('')
    // const [ menuList, setMenuList ] = useContext(MenuListContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    const currentCity = firebase.auth().currentUser
    // const cityId = firebase.auth().currentUser.uid

    let {
        modalVisible, setModalVisible,
        // loaderVisible, setLoaderVisible,
        section, editEnabled, postId
    } = props

    // const postId = section.id

    useEffect(() => {
        if (currentCity) {
            const cityId = currentCity.uid

            if (modalVisible && editEnabled) {
                setLoading(true)

                function getData() {
                    setNameCTG(section.title)
                    setImgGallery(section.image)
                }
    
                posts_img.child(cityId).child('categories').child(`${postId}.jpg`).getDownloadURL().then(url => {
                    const source = { uri: url }
    
                    setImage(source)
                    getData()

                    setTimeout(() => {
                        setLoading(false)
                    }, 1500)
                })
            }
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

    const uploadPost = (id) => {
        // let posts = firebase.database().ref('posts')
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








            // ANTIGO QUE ALTERAVA ATÉ OS DADOS DOS ITENS:
            // posts.child(cityId).child(post.id).set(post)
            // .then(() => {
            //     setTimeout(() => {
            //         setLoaderVisible(false)
            //         setImage(null)
            //         setNameCTG('')
            //         toastMsg('Categoria salva.')
            //     }, 2000)
            // })
            // .catch((error) => {
            //     setLoaderVisible(false)
            //     console.log(error)
            //     toastMsg(`${error.code} - ${error.message}`)
            // })



            // NOVO QUE ALTERA SOMENTE O TÍTULO E IMAGEM DA SEÇÃO:
            // console.log('------------UPLOAD_POST------------')
            // let condPublish = editEnabled ? section.publish : false
            // postId = postId ? postId : uuid()

            // console.log(`condPublish: ${condPublish}`)
            // console.log(`postId: ${postId}`)
            // console.log(`image: ${image}`)
            // console.log(`title: ${nameCTG}`)

            if (currentCity) {
                const cityId = currentCity.uid

                try {
                    let condPublish = editEnabled ? section.publish : false
                    // postId = postId ? postId : uuid()
    
                    posts.child(cityId).child(id).child('id').set(id)
                    posts.child(cityId).child(id).child('title').set(nameCTG)
                    posts.child(cityId).child(id).child('image').set(image)
                    posts.child(cityId).child(id).child('publish').set(condPublish)
    
                    setTimeout(() => {
                        setLoaderVisible(false)
                        setImage(null)
                        setNameCTG('')
                        toastMsg('Categoria salva.')
                    }, 2000)
                } catch(e) {
                    setLoaderVisible(false)
                    console.log(e)
                    toastMsg(`${e.code} - ${e.message}`)
                    console.log('ERROR NO UPLOADPOST')
                }
            }

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
        if (currentCity) {
            const cityId = currentCity.uid

            // setLoaderVisible(false)
            let sec_data = editEnabled ? section.data : []
            let id = editEnabled ? postId : uuid()
            // let sec_data = editEnabled ? section.data : []
            // let sec_image = editEnabled ? section.image : image
            let sec_publish = editEnabled ? section.publish : false
            // const post = editEnabled ? section :
            // {
            //     title: nameCTG,
            //     data: [],
            //     id: id,
            //     image: image,
            //     publish: false,
            // }
    
            const post = {
                title: nameCTG,
                data: sec_data,
                id: id,
                image: image,
                publish: sec_publish,
            }
    
            // let old_uri = editEnabled ? section.image.uri : ''
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
                        // console.log(post)
                        
                        setTimeout(() => {
                            // uploadPost(post)
                            uploadPost(id)
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
                // console.log(post)
                uploadPost(id)
            }
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
            saveImage()
            // try{
            //     // const post = {
            //     //     title: nameCTG,
            //     //     data: [],
            //     //     id: id
            //     // }
    
            //     // uploadPost(post, nameCTG)
            //     // setNameCTG('')
            //     // setModalVisible(false)
            //     // alert('Enviado com sucesso!')
            // } catch(e) {
            //     console.error(e)
            // }
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

    function saveTudo() {
        // setLoaderVisible(false)
        let sec_data = editEnabled ? section.data : []
        let id = editEnabled ? postId : uuid()
        // let sec_data = editEnabled ? section.data : []
        // let sec_image = editEnabled ? section.image : image
        let sec_publish = editEnabled ? section.publish : false
        // const post = editEnabled ? section :
        // {
        //     title: nameCTG,
        //     data: [],
        //     id: id,
        //     image: image,
        //     publish: false,
        // }

        const post = {
            title: nameCTG,
            data: sec_data,
            id: id,
            image: image,
            publish: sec_publish,
        }

        console.log('-------------POSTSSSSSSS-------------')
        console.log(editEnabled ? section.publish : false)
    }
    
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
            <Area onPress={handleClose} activeOpacity={1} >
                {!loading ? <Box activeOpacity={1} >
                    <Header>
                        <Title>{editEnabled ? 'Editar' : 'Criar'} categoria</Title>
                        <ButtonClose onPress={handleClose} activeOpacity={.6} >
                            {/* <TextButton color='#fe9601' >X</TextButton> */}
                            {/* <FontIcon name='times' size={20} color='#fe9601' /> */}
                            <Icon name='close' size={normalize(23)} color='#fe9601' />
                        </ButtonClose>
                    </Header>
                    <BoxBody>
                        {image ?
                        <ImageArea onPress={selectImage} activeOpacity={.7} >
                            <Image source={image} />
                        </ImageArea>
                        :
                        <AddPhotoArea onPress={selectImage} activeOpacity={.6} >
                            <ComuIcon name='image-plus' size={normalize(28)} color='#ccc' />
                        </AddPhotoArea>}
                        <Text style={{ alignSelf: 'flex-start' }} >NOME DA CATEGORIA</Text>
                        <Input
                            value={nameCTG}
                            onChangeText={(t) => setNameCTG(t)}
                            autoFocus={true}
                            maxLength={normalize(25)}
                            // prop para inserir imagem no lado esquesdo campo de texto
                            // inlineImageLeft='search_icon'
                        />
                        <TextCaption>{nameCTG.length}/25 caracteres</TextCaption>
                    </BoxBody>
                    <BoxFooter>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleClose}
                            underlayColor='#eee'
                        >
                            <TextButton>Cancelar</TextButton>
                        </ButtonModal>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleSave}
                            // onPress={saveTudo}
                            bgColor='#fe9601'
                            underlayColor='#e5921a'
                        >
                            <TextButton color='#fff' >Salvar</TextButton>
                        </ButtonModal>
                    </BoxFooter>
                </Box>
                : 
                <Box style={{ height: normalize(370) }} >
                    <LoadingPage height='100%' pdBottom='0' />
                </Box>}
            </Area>
        </Modal>
    )
}