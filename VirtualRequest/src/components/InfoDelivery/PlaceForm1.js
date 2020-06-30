import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { ToastAndroid, Vibration, Keyboard } from 'react-native'
import styled from 'styled-components/native'

// Components:
import InputArea from './PlaceForm1/InputArea'
import ButtonArea from './PlaceForm1/ButtonArea'

// Contexts:
import ActiveContext from '../../contexts/ActiveContext'

const Form = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`

const FormArea = styled.View``

/*
const TextCode = styled.Text`
    font-size: 16px;
    color: #fff;
`
*/

const FooterCode = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
    background-color: #077a15;
    padding-horizontal: 20px;
`

const TextCodeArea = styled.View`
    flex: 1;
    width: 100%;
    padding: 10px
    justify-content: center;
    align-items:center;
`

const TextCode = styled.Text`
    font-size: 18px;
    text-align: center;
    color: #999;
    margin-vertical: 25%
`

const PlaceForm = (props) => {
    const [ name, setName ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)

    // const [ valueY, setValueY ] = useState(0)
    /*
    const [ code, setCode ] = useState('')
    const [ activeCode, setActiveCode ] = useState(false)
    const [ isKeyboardVisible, setKeyboardVisible ] = useState(false)
    */
    const [ activeScreen, setActiveScreen ] = useContext(ActiveContext)
    // const [ countCode, setCountCode ] = useState(0)
    let {
        isKeyboardVisible, setKeyboardVisible,
        activeCode, setActiveCode,
        countCode, setCountCode,
        code, setCode,
        scrollToEnd
    } = props

    useEffect(() => {
        if (props.ddd.length === 2) {
            setMaxLenDDD(4)
            ajustedDDD = `(${props.ddd})`
            setDDD(ajustedDDD)
        }

        if (props.phone.length == 9) {
            setMaxLenPhone(10)
            part1 = props.phone.slice(0, 5)
            part2 = props.phone.slice(5, 9)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        } else if (phone.length == 8) {
            setMaxLenPhone(9)
            part1 = props.phone.slice(0, 4)
            part2 = props.phone.slice(4, 8)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        }

        setName(props.name)
        // setDDD(props.ddd)
        // setPhone(props.phone)
    }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    const handleSaveInfo = () => {
        let newDDD = ddd.replace(/\D/g, '')
        let newPhone = phone.replace(/\D/g, '')

        props.setName(name)
        props.setDDD(newDDD)
        props.setPhone(newPhone)

        toastMsg('Informações salvas com sucesso!')
    }

    const handleSend = () => {
        let phoneWithoutHypen = phone.split('-')
        let newPhoneJoin = phoneWithoutHypen.join('')
        
        if ((name && ddd && phone).trim().length <= 0) {
            Vibration.vibrate(70)
            toastMsg('Preencha os campos acima.')
        } else if (newPhoneJoin.length < 8) {
            toastMsg('Digite um número de telefone válido.')
            /*
            let phoneJoin;
            let phoneSplit;
            phoneSplit = phone.split('')
            console.log(phone)
            console.log(phone.length)
            if (phone.length == 10) {
                console.log('O tamanho é igual à 10')
            } else if (phone.length == 9) {
                console.log('O tamanho é igual à 9')
            } else if (phone.length == 8) {
                console.log('O tamanho é igual à 8')
            } else {
                console.log('Tamanho insuficiente')
            }
            */
            /*
            
            */
        } else if (!activeCode) {
            // alert(`Seu nome é ${name}`)
            Vibration.vibrate(70)
            toastMsg('Gere seu código de retirada.')
        } else {
            Keyboard.dismiss()
            setActiveScreen('foods')
            props.nav('Home')
            toastMsg('Pedido enviado com sucesso!')
            /*
            console.log(phoneWithoutHypen)
            console.log(phoneJoin)
            console.log(phoneJoin.length)
            */
        }
    }

    var letter_num = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    let randomNum;
    let seq = [];
    let seq_check;
    

    function genNumAndLetter(cont) {
        randomNum = Math.round(Math.random() * Number(cont))
        return Number(randomNum)
    }

    function seqNumLetter() {
        for (let p = 0; p < 10; p++) {
            seq.push(letter_num[genNumAndLetter(Number(letter_num.length))])
        }

        // console.log(seq)
    }

    function findUndef() {
        seq.map((item, index) => {
            try {
                if (item === undefined) {
                    throw new Error('Variável indefinada')
                }
            } catch(e) {
                console.log(`ERROR: ${e.message}`)
                seq[index] = letter_num[genNumAndLetter(letter_num.length)]
            } finally {
                seq_check = seq.join('')
            }
        })
        setCode(seq_check)
        // console.log(seq_check)
    }
    let valueY = 0
    const handleGenCode = () => {
        if (countCode == 0) {
            Keyboard.dismiss()
            setActiveCode(true)
            seqNumLetter()
            findUndef()
            setCountCode(1)
            // let timerId = setInterval(() => {
            //     scrollToEnd(valueY)
            //     console.log(valueY)
            //     valueY = valueY + 1
            // }, 1)
            // setTimeout(() => {
            //     clearInterval(timerId)
            // }, 4000)
        } else {
            Vibration.vibrate(70)
            toastMsg('Desculpe, mas você já gerou seu código!')
        }
    }

    // useEffect(() => {
    //     // seqNumLetter()
    //     // findUndef()
    //     //console.log(`Número: ${active}`)
    //     //console.log(isKeyboardVisible)
    // }, [/*isKeyboardVisible*/])



    return (
        <Form>
            <InputArea
                name={name}
                setName={setName}
                //
                ddd={ddd}
                setDDD={setDDD}
                //
                phone={phone}
                setPhone={setPhone}
                //  
                maxLenDDD={maxLenDDD}
                setMaxLenDDD={setMaxLenDDD}
                //
                maxLenPhone={maxLenPhone}
                setMaxLenPhone={setMaxLenPhone}
            />
            <ButtonArea
                handleSaveInfo={handleSaveInfo}
                handleSend={handleSend}
                handleGenCode={handleGenCode}
                activeCode={activeCode}
            />
            {activeCode && 
            <TextCodeArea>
                <TextCode>Mostre esse código no local de retirada:</TextCode>
            </TextCodeArea>
            }
            {/* {!isKeyboardVisible &&
            <FooterCode>
                <TextCode>Código de retirada: {` ${activeCode ? code : codeEmpty}`}</TextCode>
            </FooterCode>} */}
        </Form>
    )
}

const mapStateToProps = (state) => {
    return {
        name: state.userReducer.name,
        ddd: state.userReducer.ddd,
        phone: state.userReducer.phone,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setName: (name) => dispatch({type: 'SET_NAME', payload: {name}}),
        setDDD: (ddd) => dispatch({type: 'SET_DDD', payload: {ddd}}),
        setPhone: (phone) => dispatch({type: 'SET_PHONE', payload: {phone}}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceForm)