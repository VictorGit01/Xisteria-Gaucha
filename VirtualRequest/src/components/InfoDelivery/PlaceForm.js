import React, { useState, useEffect } from 'react'
import { ToastAndroid, Vibration } from 'react-native'
import styled, { ThemeProvider } from 'styled-components/native'

// Components:
import InputArea from './PlaceForm/InputArea'

const Form = styled.KeyboardAvoidingView`
    flex: 1;
    width: 90%;
    align-items: center;
`

const ButtonForm = styled.TouchableOpacity`
    height: 40px;
    width: 165px;
    justify-content: center;
    align-items: center;
    align-self: flex-end
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 20px;
`

const ButtonSend = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    align-self: center;
    background-color: #077a15;
    border-radius: 2px;
    elevation: 2px;
    margin-top: 20px;
`

const TextButton = styled.Text`
    font-size: 16px;
    color: #fff;
`

const FooterCode = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
    background-color: #077a15;
    padding-horizontal: 20px;
`

export default () => {
    const [ activeWBD, setActiveWBD ] = useState('')
    const [ name, setName ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ code, setCode ] = useState('')

    let newName;
    let newDDD
    let newPhone;

    let ajustedDDD;

    let part1;
    let part2;
    let ajustedPhone;

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    const handleSubmit = () => {
        setActiveWBD('')
    }

    const handleSend = () => {
        if ((name && ddd && phone).trim().length <= 0) {
            Vibration.vibrate(80)
            toastMsg('Preencha os campos acima.')

        } else {
            newName = name.replace(/\s{2,}/g, ' ').trim()
            alert(`Seu nome é ${newName}`)
        }
    }

    const nameDefocus = () => {
        newName = name.replace(/\s{2,}/g, ' ' ).trim()
        setName(newName)
    }

    const dddFocus = () => {
        setActiveWBD('ddd')
        maxLenDDD === 4 ? setMaxLenDDD(2) : null
        newDDD = ddd.replace(/\D/g, '')
        setDDD(newDDD)
    }

    const dddDefocus = () => {
        maxLenDDD === 2 ? setMaxLenDDD(4) : null
        if (ddd.length === 2) {
            ajustedDDD = `(${ddd})`
            setDDD(ajustedDDD)
        }
    }

    const phoneFocus = () => {
        setActiveWBD('phone')
        setMaxLenPhone(9)
        newPhone = phone.replace(/\D/g, '')
        setPhone(newPhone)
    }

    const phoneDefocus = () => {
        setMaxLenPhone(10)
        if (phone.length == 9) {
            part1 = phone.slice(0, 5)
            part2 = phone.slice(5, 9)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        } else if (phone.length == 8) {
            part1 = phone.slice(0, 4)
            part2 = phone.slice(4, 8)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        }
    }

    /*
    function gera_id() {
        var size = 1
        var randomized = Math.ceil(Math.random() * Math.pow(10, size))
        var digito = Math.ceil(Math.log(randomized))
        while(digito > 10) {
            digito = Math.ceil(Math.log(digito))
        }
        var id = `${randomized}-${digito}`
        console.log(id)
    }
    */

    var letra_num = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    function genNumAndLetter (cont) {
        let randomNum = Math.round(Math.random() * Number(cont))
        return Number(randomNum)
    }

    function seqNumLetra() {
        let a = letra_num[genNumAndLetter(Number(letra_num.length))]
        let b = letra_num[genNumAndLetter(Number(letra_num.length))]
        let c = letra_num[genNumAndLetter(Number(letra_num.length))]
        let d = letra_num[genNumAndLetter(Number(letra_num.length))]
        let e = letra_num[genNumAndLetter(Number(letra_num.length))]
        let f = letra_num[genNumAndLetter(Number(letra_num.length))]
        let g = letra_num[genNumAndLetter(Number(letra_num.length))]
        let h = letra_num[genNumAndLetter(Number(letra_num.length))]
        let i = letra_num[genNumAndLetter(Number(letra_num.length))]
        let j = letra_num[genNumAndLetter(Number(letra_num.length))]
        /*
        console.log(`a: ${a}`)
        console.log(`b: ${b}`)
        console.log(`c: ${c}`)
        console.log(`d: ${d}`)
        console.log(`e: ${e}`)
        console.log(`a: ${f}`)
        console.log(`b: ${g}`)
        console.log(`c: ${h}`)
        console.log(`d: ${i}`)
        console.log(`e: ${j}`)
        */
        //let seq = a.concat(b, c, d, e, f, g, h, i, j)
        let seq = []
        seq.push(a, b, c, d, e, f, g, h, i, j)

        console.log(seq)

        findUndef(a, b, c, d, e, f, g, h, i, j)
        

        let seq_check;

        function findUndef(...letter) {
            letter.map((item, index) => {
                try {
                    if (item == undefined) {
                        throw new Error("variável indefinada")
                    }
                } catch(e) {
                    console.log(`ERROR: ${e.message}`)
                    seq[index] = letra_num[genNumAndLetter(letra_num.length)]
                    //seq_check = seq
                } finally {
                    seq_check = seq.join('')
                    //console.log(`seq: ${seq}`)
                }
            })
            setCode(seq_check)
            //console.log(seq_check)
        }
        /*
        if ((a && b && c && d && e && f && g && h && i && j) === undefined) {
            console.log('Tem variável indefinada.')
        }
        */

        
    }

    useEffect(() => {
        // gera_id()
        seqNumLetra()
    }, [])

    return (
        <>
        <Form>
            <InputArea
                // values:
                name={name}
                ddd={ddd}
                phone={phone}
                // setValues:
                setName={setName}
                setDDD={setDDD}
                setPhone={setPhone}
                // WBD:
                activeWBD={activeWBD}
                setActiveWBD={setActiveWBD}
                // Focused and Defocused:
                nameDefocus={nameDefocus}
                dddFocus={dddFocus}
                dddDefocus={dddDefocus}
                phoneFocus={phoneFocus}
                phoneDefocus={phoneDefocus}
                // maxLength:
                maxLenDDD={maxLenDDD}
                maxLenPhone={maxLenPhone}
                // handle:
                handleSubmit={handleSubmit}
            />
            <ButtonForm activeOpacity={.9} >
                <TextButton>Salvar informações</TextButton>
            </ButtonForm>
            <ButtonSend
                activeOpacity={.9}
                onPress={handleSend}
            >
                <TextButton>Enviar pedido</TextButton>
            </ButtonSend>
        </Form>
        {activeWBD == '' &&
        <FooterCode>
            <TextButton>Código de retirada: {code}</TextButton>
        </FooterCode>}
        </>
    )
}