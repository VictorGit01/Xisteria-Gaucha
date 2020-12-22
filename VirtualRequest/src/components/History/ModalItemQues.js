import React, { useEffect, useState, useContext } from 'react'
import { /*Modal,*/ Dimensions, Platform, ToastAndroid } from 'react-native'
import Modal from 'react-native-modal'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../../firebase'
import uuid from 'uuid/v4'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

// Contexts:
// import LoaderContext from '../../contexts/LoaderContext'

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`
// width: 100%;

const ModalBox = styled.TouchableOpacity`
    width: 50%;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 2px;
    padding: 15px 0px;
    elevation: 15;
`
// height: 20%;

// const ModalTitle = styled.Text`
//     font-size: 18px;
//     font-weight: bold;
// `

// const ButtonArea = styled.View`
//     height: 40px;
//     width: 110px;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     align-self: flex-end;
// `

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
    // const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ deleted, setDeleted ] = useState(false);

    // const posts = firebase.database().ref('posts')
    // const add_ons = firebase.database().ref('add-ons')
    // const posts_img = firebase.storage().ref().child('posts')
    // const cityId = firebase.auth().currentUser.uid

    const {
        modalVisible, setModalVisible,
        setCancelVisible, setDeleteVisible,
        cityId, nav, data, dataIdx,
        callGetHistory, setLoading
    } = props
    // let dataCopy = JSON.parse(JSON.stringify(data))

    const { deviceId, pushId } = data

    const requests = firebase.database().ref('requests')

    useEffect(() => {
        if (modalVisible) {
            requests.child(cityId).child(deviceId).child(pushId).on('value', snapshot => {
                // console.log(snapshot.val())
                if (!snapshot.val()) {
                    setDeleted(true)
                }
            })
        }
    }, [modalVisible])

    useEffect(() => {
        if (modalVisible) {
            console.log('-----------MODAL_ITEM_QUES-----------')
            console.log('DATA:')
            console.log(data)
            console.log('DATA_IDX:')
            console.log(dataIdx)
        }
    }, [modalVisible])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180)
        )
    }

    const handleEdit = () => {
        // console.log(data.same)
        setModalVisible(false)
        // nav('InsItemsTab', { editEnabled: true, section, dataIndex, dataId: data.id, dataImg: data.image, dataAddOns: data.add_ons, data })
    }

    function handleCancel() {
        setModalVisible(false)
        setCancelVisible(true)
    }

    function handleDelete() {
        setModalVisible(false)
        setDeleteVisible(true)
    }

    function condChoose() {
        if (data.response < 3) {
            return (
                <ModalButton onPress={handleCancel} underlayColor='#eee' >
                    <>
                    <ModalText>Cancelar</ModalText>
                    <FontIcon name='ban' size={20} color='#fe9601' />
                    </>
                </ModalButton>
            )
        // } else if (data.response == 5) {
        } else if (data.response >= 3 && deleted) {
            return (
                <ModalButton onPress={handleDelete} underlayColor='#eee'>
                    <>
                    <ModalText>Remover</ModalText>
                    <FontIcon name='trash-alt' size={20} color='#fe9601' />
                    </>
                </ModalButton>
            )
        }
    }

    return (
        <Modal
            // visible={modalVisible}
            // animationType={'fade'}
            // transparent={true}
            // onRequestClose={() => setModalVisible(false)}
            isVisible={modalVisible}
            backdropOpacity={0.9}
            // backdropColor='rgba(0, 0, 0, .5)'
            backdropColor='transparent'
            animationIn='fadeIn'
            animationOut='fadeOut'
            coverScreen={false}
            // deviceHeight={Dimensions.get('screen').height}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
            hideModalContentWhileAnimating={true}
        >
            <ModalArea onPress={() => setModalVisible(false)} activeOpacity={1} >
                <ModalBox activeOpacity={1} >
                    {/* <ModalTitle>Excluir</ModalTitle>
                    <ModalText>Deseja excluir este serviço cancelado?</ModalText> */}

                    <ModalButton
                        onPress={() => {
                            setModalVisible(false)
                            nav('OrderDetails', { data, dataIdx, callGetHistory, setLoading })
                        }}
                        underlayColor='#eee'
                    >
                        <>
                        <ModalText>Detalhes</ModalText>
                        <FontIcon name='info-circle' size={20} color='#fe9601' />
                        </>
                    </ModalButton>
                    {condChoose()}
                    {/* {data.response < 4 ? 
                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        setCancelVisible(true)
                    }} underlayColor='#eee' >
                        <>
                        <ModalText>Cancelar</ModalText>
                        <FontIcon name='ban' size={20} color='#fe9601' />
                        </>
                    </ModalButton>
                    :
                    <ModalButton onPress={() => {
                        setModalVisible(false)
                        setDeleteVisible(true)
                    }} underlayColor='#eee'
                    >
                        <>
                        <ModalText>Remover</ModalText>
                        <FontIcon name='trash-alt' size={20} color='#fe9601' />
                        </>
                    </ModalButton>
                    } */}



                    {/* <ModalButton
                        // onPress={handleDuplicate}
                        underlayColor='#eee'
                    >
                        <>
                        <ModalText>Duplicar</ModalText>
                        <FontIcon name='clone' size={20} color='#999' />
                        </>
                    </ModalButton> */}

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