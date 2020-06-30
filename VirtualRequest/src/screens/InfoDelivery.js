import React, { useEffect, useState, useRef } from 'react'
import { TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

// Components:
import PlaceForm from '../components/InfoDelivery/PlaceForm1'
import DeliveryForm from '../components/InfoDelivery/DeliveryForm1'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const ScrollPage = styled.ScrollView`
    flex: 1;
    width: 100%;
    padding-top: 10px;
`

const HeaderArea = styled.View`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
`

const ButtonTopArea = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0px 30px 0px;
`
//margin-vertical: 20px;

const ButtonOption = styled.TouchableOpacity`
    width: 46%
    height: 40px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.active ? '#077a15' : '#fe9601'};
    elevation: 2px;
    border-radius: 2px;
`
/*
margin-vertical: 7px;
margin-horizontal: 10px;
width: 165px;
*/

const TextButton = styled.Text`
    font-size: 15px;
    color: #fff;
`

const TextSelect = styled.Text`
    font-size: 18px;
    color: #999;
    align-self: center
`

const FooterCode = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
    background-color: #077a15;
    padding-horizontal: 20px;
`

const TextCode = styled.Text`
    font-size: 16px;
    color: #fff;
`

const Screen = (props) => {
    const [ active, setActive ] = useState('')
    const [ isKeyboardVisible, setKeyboardVisible ] = useState(false)
    const [ activeCode, setActiveCode ] = useState(false)
    const [ countCode, setCountCode ] = useState(0)
    const [ code, setCode ] = useState('')
    const [ scrollY, setScrollY ] = useState(0)

    let nav = props.navigation.navigate
    let codeEmpty = '- '.repeat(10)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true) // or some other action
            }
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false)
            }
        )

        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])

    useEffect(() => {
        // console.log(active == 'place' ? 'Screen Place' : 'Outra Tela')
        if (active != 'place') {
            activeCode ? setActiveCode(false) : null
            countCode > 0 ? setCountCode(0) : null
            code != '' ? setCode('') : null
            // console.log('Chamando tela')
        }
    }, [active])

    let scrollPos = 0

    const scroller = useRef()

    const scrollToEnd = (valueY) => {
        scroller.current.scrollTo({x: 0, y: valueY})
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <Page>
            <ScrollPage ref={scroller} >
            <HeaderArea>
            <ButtonTopArea>
                <ButtonOption
                    active={active == 'place'}
                    activeOpacity={.9}
                    onPress={() => setActive('place')}
                    // right={10}
                >
                    <TextButton>Retirar no local</TextButton>
                </ButtonOption>
                <ButtonOption
                    active={active == 'delivery'}
                    activeOpacity={.9}
                    onPress={() => setActive('delivery')}
                    // left={5}
                >
                    <TextButton>Entrega delivery</TextButton>
                </ButtonOption>
            </ButtonTopArea>
            </HeaderArea>
            {active == '' &&
            <TextSelect>Selecione uma opção</TextSelect>}
            {active == 'place' &&
            <PlaceForm
                nav={nav}
                isKeyboardVisible={isKeyboardVisible}
                setKeyboardVisible={setKeyboardVisible}
                activeCode={activeCode}
                setActiveCode={setActiveCode}
                countCode={countCode}
                setCountCode={setCountCode}
                code={code}
                setCode={setCode}
                scrollToEnd={scrollToEnd}
            />}
            {active == 'delivery' &&
            <DeliveryForm nav={nav} />}
            </ScrollPage>
            {!isKeyboardVisible && active == 'place' &&
            <FooterCode>
                <TextCode>Código de retirada: {` ${activeCode ? code : codeEmpty}`}</TextCode>
            </FooterCode>}
        </Page>
        </TouchableWithoutFeedback>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Info. entrega'
    }
}

export default Screen