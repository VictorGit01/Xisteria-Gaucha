import React, { useState, useRef } from 'react'
import { ToastAndroid, Vibration } from 'react-native'
import styled from 'styled-components/native'

// Components:
import InputArea from './DeliveryForm/InputArea'
import ButtonArea from './DeliveryForm/ButtonArea'
import ModalBox from './DeliveryForm/ModalBox'

const Area = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`

const Form = styled.KeyboardAvoidingView`
    flex: 1;
    width: 90%;
`

const BottomArea = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    background-color: #0000ff
`



export default () => {
    const [ activeWBD, setActiveWBD ] = useState('')
    const [ name, setName ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    //const [ address, setAddress ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ visibleModal, setVisibleModal ] = useState(false)
    const [ payActive, setPayActive ] = useState('credit')
    const [ select, setSelect ] = useState(false)
    const [ formPay, setFormPay ] = useState('')

    let newName;
    let newDDD;
    let newPhone;

    let ajustedDDD;

    let part1;
    let part2;
    let ajustedPhone;

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg,
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
        if ((name && district && street && phone && ddd && number).trim().length <= 0) {
            Vibration.vibrate(80)
            toastMsg('Preencha os campos acima.')
        } else {
            newName = name.replace(/\s{2,}/g, ' ').trim()
            alert('Todos os campos estão preenchidos!')
        }
    }

    const nameDefocus = () => {
        newName = name.replace(/\s{2,}/g, ' ').trim()
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
        if (phone.length === 9) {
            part1 = phone.slice(0, 5)
            part2 = phone.slice(5, 9)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        } else if (phone.length === 8) {
            part1 = phone.slice(0, 4)
            part2 = phone.slice(4, 8)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        }
    }

    const handleVisible = () => {
        setVisibleModal(true)
    }

    return (
        <Form behavior='height' >
            <InputArea
                // values:
                name={name}
                district={district}
                street={street}
                number={number}
                ddd={ddd}
                phone={phone}
                // setValues:
                setName={setName}
                setDistrict={setDistrict}
                setStreet={setStreet}
                setNumber={setNumber}
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
            <ButtonArea
                handleSend={handleSend}
                //handleVisible={handleVisible}
                visibleModal={visibleModal}
                setVisibleModal={setVisibleModal}
                //
                payActive={payActive}
                setPayActive={setPayActive}
                //
                select={select}
                setSelect={setSelect}
                //
                formPay={formPay}
            />
            <ModalBox
                visibleModal={visibleModal}
                setVisibleModal={setVisibleModal}
                //
                payActive={payActive}
                setPayActive={setPayActive}
                //
                select={select}
                setSelect={setSelect}
                //
                formPay={formPay}
                setFormPay={setFormPay}
            />
        </Form>
    )
}