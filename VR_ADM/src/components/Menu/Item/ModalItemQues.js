import React, { useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../../../firebase'
import RNFetchBlob from 'react-native-fetch-blob'
import uuid from 'uuid/v4'

// Contexts:
import LoaderContext from '../../../contexts/LoaderContext'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    width: 50%;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 2px;
    padding: 15px 0px;
    elevation: 15;
`
// height: 20%;

const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: 40px;
    width: 110px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
`

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : 16}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: 50px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: 10px;
    margin-vertical: 5px;
`

export default (props) => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const posts = firebase.database().ref('posts')
    const add_ons = firebase.database().ref('add-ons')
    const posts_img = firebase.storage().ref().child('posts')
    const cityId = firebase.auth().currentUser.uid

    let {
        modalVisible, setModalVisible,
        setAddVisible, setDeleteVisible,
        nav, section, data
    } = props
    let dataCopy = JSON.parse(JSON.stringify(data))

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    const handleEdit = () => {
        // console.log(data.same)
        setModalVisible(false)
        nav('InsItemsTab', { editEnabled: true, section, dataId: data.id, dataImg: data.image, dataAddOns: data.add_ons, data })
    }

    const saveAddOns = () => {
        let id = dataCopy.id
        add_ons.child(cityId).child(data.id).on('value', snapshot => {
            add_ons.child(cityId).child(id).set(snapshot.val())
            .then(() => {
                setLoaderVisible(false)
                toastMsg('Item duplicado.')
            })
            .catch((error) => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
            })
        })
    }

    const savePost = () => {
        let sectionId = section.id
        let id = uuid()
        dataCopy.id = id
        posts.child(cityId).child(sectionId).child('data').child(id).set(dataCopy)
        .then(() => {
            if (data.add_ons) {
                saveAddOns()
            } else {
                setTimeout(() => {
                    setLoaderVisible(false)
                    toastMsg('Item duplicado.')
                }, 1500)
            }

        })
        .catch((error) => {
            setTimeout(() => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
            }, 1500)
        })
    }

    const handleDuplicate = () => {
        setLoaderVisible(true)
        setModalVisible(false)
        if (data.image) {
            delete dataCopy.image
            savePost()
        } else {
            savePost()
        }

        // if (data.image) {
        //     // function saveImg() {
        //         img_copy = JSON.parse(JSON.stringify(data.image))
        //         // let uri = data.image.uri.replace('file://', '')
        //         // let storageRef = firebase.storage().ref()

        //         // RNFetchBlob.fs.readFile(uri, 'base64')
        //         // .then((blob) => {
        //         //     storageRef.child(`posts/${id}.jpg`).put(blob)
        //         //     .then(() => console.log('Funcionou!'))
        //         //     .catch((error) => console.log(error))

        //         // })

        //         // console.log(dataCopy.image)
        //         let uri = img_copy.uri.replace('file://', '')
        //         let image = firebase.storage().ref().child('posts').child(`${id}.jpg`)
        //         // console.log(image)
        //         let mime = 'image/jpeg'

        //         RNFetchBlob.fs.readFile(uri, 'base64')
        //         .then((data) => {
        //             return RNFetchBlob.polyfill.Blob.build(data, {type: mime+';BASE'})
        //         })
        //         .then((blob) => {
                    
        //             image.put(blob, {contentType: mime})
        //             .then(() => {
        //                 blob.close()

        //                 savePost()
        //             })
        //             .catch((error) => {
        //                 setLoaderVisible(false)
        //                 console.log(error)
        //                 toastMsg(`${error.code} - ${error.message}`)
        //             })

        //         })
        //         .catch((error) => {
        //             setLoaderVisible(false)
        //             console.log(error)
        //             toastMsg(`${error.code} - ${error.message}`)
        //         })
        //     // }

        //     // posts_img.child(`${data.id}.jpg`).getDownloadURL().then((url) => {
        //     //     const source = { uri: url }
        //     //     delete dataCopy.image
        //     //     dataCopy.image = source
        //     //     // console.log(source)
        //     // }).then(() => {
        //     //     saveImg()
        //     //     // console.log(dataCopy)
        //     // })


            
        // } else {
        //     // savePost(id)
        // }
    }

    return (
        <Modal
            visible={modalVisible}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    {/* <ModalTitle>Excluir</ModalTitle>
                    <ModalText>Deseja excluir este serviço cancelado?</ModalText> */}

                    <ModalButton onPress={handleEdit} underlayColor='#eee' >
                        <>
                        <ModalText>Editar</ModalText>
                        <FontIcon name='edit' size={20} color='#999' />
                        </>
                    </ModalButton>
                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        setDeleteVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Excluir</ModalText>
                        <FontIcon name='trash-alt' size={20} color='#999' />
                        </>
                    </ModalButton>
                    <ModalButton
                        onPress={handleDuplicate}
                        underlayColor='#eee'
                    >
                        <>
                        <ModalText>Duplicar</ModalText>
                        <FontIcon name='clone' size={20} color='#999' />
                        </>
                    </ModalButton>

                    {/* <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                    </ButtonArea> */}
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}