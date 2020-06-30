import React from 'react'
import styled from 'styled-components/native'

const InputArea = styled.View`
    width: 100%;
    height: 150px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
`

const Input = styled.TextInput`
    height: 40px;
    width: ${props => props.width ? props.width : 165}px;
    border-bottom-width: ${props => props.WBD ? 2 : 1}px;
    border-color: #ff2626;
    padding: 0px;
    margin-bottom: 10px;
`

export default (props) => {
    let activeWBD = props.activeWBD

    return (
        <InputArea>
                <Input
                    value={props.name}
                    onChangeText={(t) => props.setName(t)}
                    placeholder='Nome'
                    selectionColor='#ff2626'
                    //WBD={nameWBD}
                    //onFocus={() => handleWBD(nameWBD, setNameWBD)}
                    //blurOnSubmit={false}
                    //ref={textInputReference}
                    WBD={activeWBD == 'name'}
                    onFocus={() => props.setActiveWBD('name')}
                    autoCapitalize='words'
                    autoCompleteType='off'
                    onBlur={props.nameDefocus}
                    onSubmitEditing={props.handleSubmit}
                />
                <Input
                    value={props.district}
                    onChangeText={(t) => props.setDistrict(t)}
                    placeholder='Bairro'
                    selectionColor='#ff2626'
                    WBD={activeWBD == 'district'}
                    onFocus={() => props.setActiveWBD('district')}
                    autoCompleteType='off'
                    onSubmitEditing={props.handleSubmit}
                />
                <Input
                    value={props.street}
                    onChangeText={(t) => props.setStreet(t)}
                    placeholder='Rua'
                    selectionColor='#ff2626'
                    width={255}
                    WBD={activeWBD == 'street'}
                    onFocus={() => props.setActiveWBD('street')}
                    autoCompleteType='off'
                    onSubmitEditing={props.handleSubmit}
                />
                <Input
                    value={props.number}
                    onChangeText={(t) => props.setNumber(t)}
                    placeholder='nº'
                    selectionColor='#ff2626'
                    width={75}
                    //WBD={numberWBD}
                    //onFocus={() => handleWBD(numberWBD, setNumberWBD)}
                    //ref={textInputReference}
                    WBD={activeWBD == 'number'}
                    onFocus={() => props.setActiveWBD('number')}
                    autoCompleteType='off'
                    keyboardType='numeric'
                    onSubmitEditing={props.handleSubmit}
                    //onBlur={numberDefocus}
                />
                <Input
                    value={props.ddd}
                    onChangeText={(t) => props.setDDD(t)}
                    placeholder='DDD'
                    selectionColor='#ff2626'
                    width={75}
                    WBD={activeWBD == 'ddd'}
                    onFocus={props.dddFocus}
                    autoCompleteType='off'
                    keyboardType='phone-pad'
                    maxLength={props.maxLenDDD}
                    onBlur={props.dddDefocus}
                    onSubmitEditing={props.handleSubmit}
                />
                <Input
                    value={props.phone}
                    onChangeText={(t) => props.setPhone(t)}
                    placeholder='Celular'
                    selectionColor='#ff2626'
                    width={255}
                    //WBD={phoneWBD}
                    //onFocus={() => handleWBD(phoneWBD, setPhoneWBD)}
                    //ref={textInputReference}
                    WBD={activeWBD == 'phone'}
                    onFocus={props.phoneFocus}
                    autoCompleteType='off'
                    keyboardType='phone-pad'
                    maxLength={props.maxLenPhone}
                    onBlur={props.phoneDefocus}
                    onSubmitEditing={props.handleSubmit}
                />
            </InputArea>
    )
}