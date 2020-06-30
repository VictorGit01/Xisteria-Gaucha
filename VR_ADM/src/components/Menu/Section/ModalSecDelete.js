import React, { useEffect, useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../../../firebase'

// Contexts:
import LoaderContext from '../../../contexts/LoaderContext'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.TouchableOpacity`
    height: 25%;
    width: 70%;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 2px;
    padding: 20px 20px 10px 20px;
    elevation: 15;
`

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
    height: 35px;
    width: 50px;
    justify-content: center;
    align-items: center;
`

export default (props) => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    let { modalVisible, setModalVisible, postId, section } = props
    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    const add_ons = firebase.database().ref('add-ons')
    const cityId = firebase.auth().currentUser.uid

    useEffect(() => {
        if (modalVisible) {
            console.log('PostId')
            console.log(postId)   
        }
    }, [modalVisible])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    // function handleLoadPg() {
    //     setLoaderVisible(false)
    //     setPageVisible(false)
    // }

    const handleDelete = () => {
        setModalVisible(false)
        setLoaderVisible(true)

        function removeSection() {
            posts.child(cityId).child(postId).remove()
            .then(() => {
                setTimeout(() => {
                    setLoaderVisible(false)
                    toastMsg('Seção excluída')
                }, 1500)
            })
            .catch((error) => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
            })
        }

        function removeImgSection() {
            posts_img.child(cityId).child('categories').child(`${postId}.jpg`).delete()
            .then(() => {
                removeSection()
            })
            .catch(error => {
                setLoaderVisible(false)
                console.log(error)
                toastMsg(`${error.code} - ${error.message}`)
            })
        }

        section.data.forEach(item => {
            if (item.add_ons) {
                add_ons.child(cityId).child(item.id).remove()
                .catch(error => {
                    console.log(error)
                    toastMsg(`${error.code} - ${error.message}`)
                })
            } 
            if (item.image) {
                posts_img.child(cityId).child('items').child(`${item.id}.jpg`).delete()
                .catch(error => {
                    console.log(error)
                    toastMsg(`${error.code} - ${error.message}`)
                })
            }
        })

        removeImgSection()

        // list.length == 1 ? setPageVisible(true) : setLoaderVisible(true)

        // canceled.child(id_user).child(id_item).remove()
        // .then(() => {
        //     setTimeout(() => {
        //         handleLoadPg()
        //         toastMsg('Serviço excluído.')
        //     }, 1500)
        // })
        // .catch((error) => {
        //     handleLoadPg()
        //     console.log(error)
        //     toastMsg(`${error.code} - ${error.message}`)
        // })
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
                    <ModalTitle>Excluir Categoria</ModalTitle>
                    <ModalText>Deseja excluir esta categoria? Se fizer isso os itens inseridos também serão exluídos.</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleDelete} underlayColor='#eee' >
                            <ModalText size={14} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}