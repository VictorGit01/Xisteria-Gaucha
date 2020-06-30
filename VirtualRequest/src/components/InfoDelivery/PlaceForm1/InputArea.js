import React, { useState } from 'react'
import { ToastAndroid } from 'react-native'
import styled from 'styled-components/native'

const InputArea = styled.View`
    height: 100px;
    width: 90%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
`

const Input = styled.TextInput`
    height: 40px;
    width: ${props => props.width ? props.width : '100%'}
    border-bottom-width: ${props => props.WBD ? 2 : 1};
    border-color: #ff2626;
    padding: 0px;
    margin-bottom: 10px;
`
//width: ${props => props.width ? props.width : 165};

export default (props) => {
    const [ activeWBD, setActiveWBD ] = useState('')
    
    let {
        name, setName,
        ddd, setDDD,
        phone, setPhone,
        maxLenDDD, setMaxLenDDD,
        maxLenPhone, setMaxLenPhone
    } = props

    let newName;
    let newDDD;
    let newPhone;
    let ajustedDDD;
    let part1;
    let part2;
    let ajustedPhone;

    const onDDDChange = text => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDDD(cleaned)
        // if (cleaned.length == 2) 
    }

    const onPhoneChange = text => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setPhone(cleaned)
    }

    const nameDefocus = () => {
        newName = name.replace(/\s{2,}/g, ' ').trim()
        setName(newName)
    }

    const dddFocus = () => {
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

    return (
        <InputArea>
            <Input
                value={name}
                onChangeText={(t) => setName(t)}
                width='100%'
                placeholder='Nome'
                selectionColor='#ff2626'
                WBD={activeWBD == 'name'}
                //onFocus={() => setActiveWBD('name')}
                autoCapitalize='words'
                autoCompleteType='off'
                onBlur={nameDefocus}
                // onSubmitEditing={handleSubmit}
            />
            <Input
                value={ddd}
                onChangeText={onDDDChange}
                // width={75}
                // width='15%'
                width='20%'
                placeholder='DDD'
                selectionColor='#ff2626'
                WBD={activeWBD == 'ddd'}
                onFocus={dddFocus}
                autoCompleteType='off'
                keyboardType='phone-pad'
                maxLength={maxLenDDD}
                onBlur={dddDefocus}
                // onSubmitEditing={handleSubmit}
            />
            <Input
                value={phone}
                onChangeText={onPhoneChange}
                // width={255}
                // width='78%'
                width='72%'
                placeholder='Celular'
                selectionColor='#ff2626'
                WBD={activeWBD == 'phone'}
                onFocus={phoneFocus}
                autoCompleteType='off'
                keyboardType='phone-pad'
                maxLength={maxLenPhone}
                onBlur={phoneDefocus}
                // onSubmitEditing={handleSubmit}
            />
        </InputArea>
    )
}