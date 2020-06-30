import React from 'react'
import styled from 'styled-components/native'

const InputArea = styled.View`
    height: 150px;
    width: 90%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
`

const Input = styled.TextInput`
    height: 40px;
    width: ${props => props.width ? props.width : '100%'};
    border-bottom-width: 1px
    border-color: #ff2626;
    padding: 0px;
    margin-bottom: 10px;
`

export default (props) => {
    let {
        name, setName,
        district, setDistrict,
        street, setStreet,
        number, setNumber,
        ddd, setDDD,
        phone, setPhone,
        maxLenDDD, setMaxLenDDD,
        maxLenPhone, setMaxLenPhone
    } = props

    let newName;
    let newDDD;
    let newPhone;
    let part1;
    let part2;
    let ajustedDDD;
    let ajustedPhone;

    const nameDefocus = () => {
        newName = name.replace(/\s{2,}/g, ' ').trim()
        setName(newName)
    }

    const dddFocus = () => {
        maxLenDDD == 4 ? setMaxLenDDD(2) : null
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

    return (
        <InputArea>
            <Input
                value={name}
                onChangeText={(t) => setName(t)}
                placeholder='Nome'
                selectionColor='#ff2626'
                autoCapitalize='words'
                autoCompleteType='off'
                onBlur={nameDefocus}
                width='46%'
            />
            <Input
                value={district}
                onChangeText={(t) => setDistrict(t)}
                placeholder='Bairro'
                selectionColor='#ff2626'
                autoCompleteType='off'
                width='46%'
            />
            <Input
                value={street}
                onChangeText={(t) => setStreet(t)}
                placeholder='Rua'
                selectionColor='#ff2626'
                autoCompleteType='off'
                // width={255}
                width='72%'
            />
            <Input
                value={number}
                onChangeText={(t) => setNumber(t)}
                placeholder='nº'
                selectionColor='#ff2626'
                keyboardType='numeric'
                autoCompleteType='off'
                // width={75}
                width='20%'
            />
            <Input
                value={ddd}
                onChangeText={(t) => setDDD(t)}
                placeholder='DDD'
                selectionColor='#ff2626'
                keyboardType='phone-pad'
                autoCompleteType='off'
                // width={75}
                width='20%'
                maxLength={maxLenDDD}
                onFocus={dddFocus}
                onBlur={dddDefocus}
            />
            <Input
                value={phone}
                onChangeText={(t) => setPhone(t)}
                placeholder='Celular'
                selectionColor='#ff2626'
                keyboardType='phone-pad'
                autoCompleteType='off'
                // width={255}
                width='72%'
                maxLength={maxLenPhone}
                onFocus={phoneFocus}
                onBlur={phoneDefocus}
            />
        </InputArea>
    )
}