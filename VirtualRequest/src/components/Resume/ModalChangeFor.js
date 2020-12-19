import React, { useEffect, useState, useContext } from 'react'
import { Modal, ToastAndroid } from 'react-native'
import { hp, wp, normalize } from '../../functions'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Area = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5) 
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

// const Scroll = styled.ScrollView`
//     flex: 1;
//     width: 100%;
// `

const Box = styled.View`
    width: 65%;
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding: ${normalize(10)}px ${normalize(10)}px ${normalize(20)}px ${normalize(10)}px;
`
// height: 260px;

const Header = styled.View`
    height: ${normalize(40)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
// height: 40px

const BoxBody = styled.View`
    margin-vertical: ${normalize(40)}px;
    justify-content: center;
`
// flex: 1.2;
// margin-vertical: 40px;

const BoxFooter = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`
// flex: 1;

const Title = styled.Text`
    font-size: ${normalize(18)}px;
`

const Text = styled.Text`
    font-size: ${normalize(14)}px;
    color: ${props => props.color ? props.color : '#000'};
`

// const TextCaption = styled.Text`
//     font-size: 10px;
//     color: #999
//     align-self: flex-end
// `

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
    margin-bottom: ${normalize(40)}px;
`

const BoxExtra = styled.View`
    height: ${normalize(18)}px;
    width: ${normalize(18)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ccc'};
    border: ${normalize(4)}px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${normalize(.5)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(8)}px;
`

const ButtonOption = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding-vertical: ${normalize(8)}px;
    border: ${normalize(.5)}px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${normalize(3)}px;
`

const ButtonClose = styled.TouchableOpacity`
    height: 100%;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
`

const ButtonModal = styled.TouchableOpacity`
    height: ${normalize(40)}px;
    width: 48%;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor? props.bgColor : '#fff'};
    border: ${normalize(1)}px solid #fe9601;
    border-radius: ${normalize(2)}px;
`

export default (props) => {
    let {
        modalVisible, setModalVisible,
        changeFor, setChangeFor, setActivePay,
        noChange, setNoChange, totalOrder,
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
            normalize(180),
        )
    }

    useEffect(() => {
        if (modalVisible) {
            console.log('-----------ENTROU NA TELA-----------')
            console.log(onChangeFor(changeFor, true))
            setPrice(onChangeFor(changeFor, true))
            setNoPrice(noChange)
        }
    }, [modalVisible])

    useEffect(() => {
        if (noPrice) {
            // setPrice('')
            onChangeFor('')
        }
    }, [noPrice])

    useEffect(() => {
        // if (price.length > 0) {
        //     setNoPrice(false)
        // }
        // let cleaned = ('' + price).replace(/\D/g, '')
        // console.log('----------PRICE ----------')
        // let cleaned = remSpecChar(price)
        if (Number(remSpecChar(price)) > 0) {
            setNoPrice(false)
        }
    }, [price])

    function remSpecChar(text) {
        return ('' + text).replace(/\D/g, '')
    }

    function convToFloat(text) {
        return text.split('R$ ').join('').split('.').join('').replace(',', '.')
    }

    const onChangeFor = (text, secOption) => {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            // console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            // console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }

            // if (newCleaned.length <= 2) {
            //     return '000'
            // } else if (newCleaned.length == 3) {
            //     return '00' + newCleaned.slice(-3, -2)
            // } else if (newCleaned.length == 4) {
            //     return '0' + newCleaned.slice(-4, -2)
            // } else {
            //     return newCleaned.slice(-5, -2)
            // }
            // if (cleaned.length <= 3) {
            //     return '000' + afterComma()
            // } else if (cleaned.length === 4) {
            //     return `00${cleaned}` + afterComma()
            // } else {
            //     return cleaned.slice(-6, -2)
            // }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        // console.log('R$ ' + afterPoint() + ',' + afterComma())
        let fatia = cleaned.length == 1 ? ',0' + cleaned : ',' + cleaned.slice(-2)
        // console.log(fatia)
        // let newCleaned = 'R$ ' + num_format
        // setPrice(num_format)
        if (secOption) {
            return num_format
        } else {
            setPrice(num_format)
        }
        // if (cleaned.length == 2) 
    }

    function onFocus() {
        // if (price.length) {
        //     // let cleaned = ('' + price).replace(/\D/g, '')
        //     // setPrice(newText)
        //     let newText = price.split('R$ ').join('')
        //     let newPrice = Number(newText).toFixed(0).toString()
        //     // console.log(newPrice)
        //     setPrice(newPrice)
        // }
    }

    function onEndEditing() {
        // setPrice('10000')
        if (price.length) {
            let newFormat = 'R$ '+ Number(price).toFixed(2)
            setPrice(newFormat.toString())
        }
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
        if ((price.length == 0 || Number(remSpecChar(price)) == 0) && !noPrice) {
            toastMsg('Digite um valor ou selecione a opção.')
        } else if (Number(convToFloat(price)) < Number(totalOrder) && !noPrice) {
            toastMsg('Desculpe, mas o troco não pode ser menor do que o total do pedido.')
        } else {
            setChangeFor(price)
            setNoChange(noPrice)
            setModalVisible(false)
        }

        // console.log('---------------TOTAL_ORDER---------------')
        // console.log(Number(totalOrder))

        // console.log('---------------CHANGE_FOR---------------')
        // console.log(Number(convToFloat(price)))

        // console.log('---------------CHANGE_FOR---------------')
        // console.log(Number(convToFloat(price)) < Number(totalOrder))
    }

    
    
    return (
        <Modal
            visible={modalVisible}
            onRequestClose={handleClose}
            transparent={true}
            animationType='fade'
        >
            <Area>
                {/* <Scroll contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} > */}
                    <Box behavior='height' >
                        <Header>
                            <Title>Troco para:</Title>
                            <ButtonClose onPress={handleClose} >
                                {/* <TextButton color='#fe9601' >X</TextButton> */}
                                <Icon name='close' size={normalize(20)} color='#fe9601' />
                            </ButtonClose>
                        </Header>
                        <BoxBody>
                            {/* <Text>TROCO PARA</Text> */}
                            <Input
                                value={price}
                                onChangeText={onChangeFor}
                                // onFocus={onFocus}
                                // onEndEditing={onEndEditing}
                                // placeholder='R$ 0,00'
                                autoFocus={true}
                                maxLength={13}
                                keyboardType='numeric'
                                // prop para inserir imagem no lado esquesdo campo de texto
                                // inlineImageLeft='search_icon'
                            />
                            {/* <TextCaption>{nameCTG.length}/25 caracteres</TextCaption> */}
                            <ButtonOption 
                                onPress={() => setNoPrice(!noPrice)} 
                                activeOpacity={.6}
                                selected={noPrice} 
                                hitSlop={{ top: 20, bottom: 20 }} 
                            >
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
                {/* </Scroll> */}
            </Area>
        </Modal>
    )
}