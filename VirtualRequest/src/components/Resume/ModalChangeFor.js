import React, { useEffect, useState, useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'

const Area = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5) 
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

const Box = styled.KeyboardAvoidingView`
    height: 260px;
    width: 65%;
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
    justify-content: center;
`

const BoxFooter = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`
// flex: 1;

const Title = styled.Text`
    font-size: 18px;
`

const Text = styled.Text`
    font-size: 14px;
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
    text-align: right;
    margin-bottom: 30px;
`

const BoxExtra = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ccc'};
    border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: 3px;
    margin-right: 15px;
    margin-left: 5px;
`

const ButtonOption = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`

const ButtonClose = styled.TouchableOpacity`
    height: 100%;
    width: 40px;
    justify-content: center;
    align-items: center;
`

const ButtonModal = styled.TouchableOpacity`
    height: 40px;
    width: 48%;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor? props.bgColor : '#fff'};
    border: 1px solid #fe9601;
    border-radius: 2px;
`

export default (props) => {
    let {
        modalVisible, setModalVisible,
        changeFor, setChangeFor, setActivePay,
        noChange, setNoChange
    } = props

    const [ price, setPrice ] = useState('')
    const [ noPrice, setNoPrice ] = useState(false)
    // const [ menuList, setMenuList ] = useContext(MenuListContext)


    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    useEffect(() => {
        if (modalVisible) {
            setPrice(changeFor)
            setNoPrice(noChange)
        }
    }, [modalVisible])

    useEffect(() => {
        if (noPrice) {
            setPrice('')
        }
    }, [noPrice])

    useEffect(() => {
        if (price.length > 0) {
            setNoPrice(false)
        }
    }, [price])

    const onChangeFor = text => {
        let cleaned = '' + ('' + text).replace(/\D/g, '')
        setPrice(cleaned)
        // if (cleaned.length == 2) 
    }

    const handleClose = () => {
        setModalVisible(false)
        if (changeFor.length == 0 && !noChange) {
            setActivePay(null)
            setPrice('')
            setNoPrice(false)
        }
        // setFocusedInput(false)
    }

    const handleSave = () => {
        if (price.length == 0 && !noPrice) {
            toastMsg('Digite um valor ou selecione a opção.')
        } else {
            setChangeFor(price)
            setNoChange(noPrice)
            setModalVisible(false)
        }
    }
    
    return (
        <Modal
            visible={modalVisible}
            onRequestClose={handleClose}
            transparent={true}
            animationType='fade'
        >
            <Area>
                <Box behavior='height' >
                    <Header>
                        <Title>Troco para:</Title>
                        <ButtonClose onPress={handleClose} >
                            <TextButton color='#fe9601' >X</TextButton>
                        </ButtonClose>
                    </Header>
                    <BoxBody>
                        {/* <Text>TROCO PARA</Text> */}
                        <Input
                            value={price}
                            onChangeText={onChangeFor}
                            autoFocus={true}
                            maxLength={25}
                            keyboardType='numeric'
                            // prop para inserir imagem no lado esquesdo campo de texto
                            // inlineImageLeft='search_icon'
                        />
                        {/* <TextCaption>{nameCTG.length}/25 caracteres</TextCaption> */}
                        <ButtonOption onPress={() => setNoPrice(!noPrice)} hitSlop={{ top: 20, bottom: 20 }} >
                            <>
                            <BoxExtra selected={noPrice}></BoxExtra>
                            <Text>Sem troco</Text>
                            </>
                        </ButtonOption>
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