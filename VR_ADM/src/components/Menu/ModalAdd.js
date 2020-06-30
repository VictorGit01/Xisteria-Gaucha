import React, { useEffect, useState, useContext } from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../../firebase'
import '../../fixtimerbug'

// list:
import listDetails from '../../menu_list/listDetails'
import uuid from 'uuid/v4'

// Contexts:
import MenuListContext from '../../contexts/MenuListContext'

const Area = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5) 
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

const Box = styled.KeyboardAvoidingView`
    height: 250px;
    width: 75%;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px 10px 20px 10px
`

const Header = styled.View`
    height: 40px
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const BoxBody = styled.View`
    flex: 1.2;
    justify-content: flex-end;
`

const BoxFooter = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`

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
    const [ nameCTG, setNameCTG ] = useState('')
    const [ menuList, setMenuList ] = useContext(MenuListContext)

    let {
        visibleModal, setVisibleModal,
        focusedInput, setFocusedInput
    } = props
    let newList = [...menuList]
    let category = firebase.database().ref('category')

    const handleClose = () => {
        setVisibleModal(false)
        setNameCTG('')
        setFocusedInput(false)
    }

    const handleSave = () => {
        if (nameCTG.length > 0) {
            newList.push({
                title: nameCTG,
                data: []
            })
            setMenuList(newList)
            // firebase.database().ref(`category/${nameCTG}`).set('')



            // Estava usando esse como exemplo:
            /*
            let chave = firebase.database().ref('ctg').push().key
            firebase.database().ref(`ctg/${chave}`).set({
                title: nameCTG
            })
            */
            let titleCTG = firebase.database().ref('titleCTG')

            // Novo exemplo:
            let chave = titleCTG.push().key
            titleCTG.child(chave).set({
                title: nameCTG
            })






            // console.log(firebase.database.ref('category'))
            /*
            listDetails.push({
                title: nameCTG,
                data: [
                    // {id: uuid(), name: 'Novo item', price: 0}
                ]
            })
            */
            setNameCTG('')
            setVisibleModal(false)
            // console.log(listDetails)
            // console.log(menuList)
        }
    }

    useEffect(() => {
        // console.log(listDetails)
        // console.log(listDetails[1].data)
        // setFocusedInput(true)
    }, [])
    
    return (
        <Modal
            visible={visibleModal}
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
                <Box behavior='height' >
                    <Header>
                        <Title>Criar categoria</Title>
                        <ButtonClose onPress={handleClose} >
                            <TextButton color='#fe9601' >X</TextButton>
                        </ButtonClose>
                    </Header>
                    <BoxBody>
                        <Text>NOME DA CATEGORIA</Text>
                        <Input
                            value={nameCTG}
                            onChangeText={(t) => setNameCTG(t)}
                            autoFocus={focusedInput}
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