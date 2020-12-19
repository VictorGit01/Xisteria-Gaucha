import React, { useEffect, useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import { normalize } from '../../../functions'
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
    border-radius: ${normalize(2)}px;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px ${normalize(20)}px;
    elevation: 15;
`

const ModalTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
`

const ButtonArea = styled.View`
    height: ${normalize(40)}px;
    width: ${normalize(110)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
`

const ModalText = styled.Text`
    font-size: ${props => props.size ? props.size : normalize(16)}px;
    font-weight: ${props => props.weight ? props.weight : 'normal'}
    color: ${props => props.color ? props.color : '#000'};
`

const ModalButton = styled.TouchableHighlight`
    height: ${normalize(35)}px;
    width: ${normalize(50)}px;
    justify-content: center;
    align-items: center;
`

export default (props) => {
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    let { modalVisible, setModalVisible, section, sectionId, dataId, dataImg, dataAddOns } = props
    const posts = firebase.database().ref('posts')
    const img_posts = firebase.storage().ref().child('posts')
    const add_ons = firebase.database().ref('add-ons')
    const currentCity = firebase.auth().currentUser
    // const cityId = firebase.auth().currentUser.uid

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
        if (currentCity) {
            const cityId = currentCity.uid

            setModalVisible(false)
            setLoaderVisible(true)
    
            // function removeAddOns() {
            //     add_ons.child(dataId).remove()
            // }
    
            function pauseSection() {
                posts.child(cityId).child(sectionId).child('publish').set(false)
                .catch(error => {
                    console.log(`${error}`)
                    toastMsg(`${erro.code} - ${error.message}`)
                })
            }
    
            function removeAddOns() {
                add_ons.child(cityId).child(dataId).remove()
                .then(() => {
                    setTimeout(() => {
                        setLoaderVisible(false)
                        toastMsg('Item exluído.')
                    }, 1500)
                })
            }
    
            function removeItem() {
                posts.child(cityId).child(sectionId).child('data').child(dataId).remove()
                .then(() => {
                    if (section.data.length <= 1) {
                        pauseSection()
                        toastMsg('Mudando para false')
                    }
    
                    if (dataAddOns) {
                        removeAddOns()
                    } else {
                        setTimeout(() => {
                            setLoaderVisible(false)
                            toastMsg('Item excluído')
                        }, 1500)
                    }
                })
                .catch((error) => {
                    setLoaderVisible(false)
                    console.log(error)
                    toastMsg(`${error.code} - ${error.message}`)
                })
            }
    
            if (dataImg) {
                img_posts.child(cityId).child('items').child(`${dataId}.jpg`).delete()
                .then(() => {
                    removeItem()
                })
                .catch((error) => {
                    setLoaderVisible(false)
                    console.log(error)
                    toastMsg(`${error.code} - ${error.message}`)
                })
            } else {
                removeItem()
            }
        }



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
                    <ModalTitle>Excluir Item</ModalTitle>
                    <ModalText>Deseja excluir este item? Se fizer isso perderá os dados do item.</ModalText>
                    <ButtonArea>
                        <ModalButton onPress={() => setModalVisible(false)} underlayColor='#eee' >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >NÃO</ModalText>
                        </ModalButton>
                        <ModalButton onPress={handleDelete} underlayColor='#eee' >
                            <ModalText size={normalize(14)} color='#009a67' weight='bold' >SIM</ModalText>
                        </ModalButton>
                    </ButtonArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}