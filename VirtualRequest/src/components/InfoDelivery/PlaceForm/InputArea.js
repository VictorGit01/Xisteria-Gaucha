import React from 'react'
import styled from 'styled-components/native'

const InputArea = styled.View`
    width: 100%;
    height: 100px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
`

const Input = styled.TextInput`
    height: 40px;
    width: ${props => props.width ? props.width : 165};
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
                    width='100%'
                    //WBD={nameWBD}
                    /*
                    onFocus={() => {
                        setNameWBD(2)
                        setPhoneWBD(1)
                    }}
                    */
                    WBD={activeWBD == 'name'}
                    onFocus={() => props.setActiveWBD('name')}
                    autoCapitalize='words'
                    autoCompleteType='off'
                    onSubmitEditing={props.handleSubmit}
                    onBlur={props.nameDefocus}
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
                    /*
                    onFocus={() => {
                        setPhoneWBD(2)
                        setNameWBD(1)
                    }}
                    */
                    WBD={activeWBD == 'phone'}
                    onFocus={props.phoneFocus}
                    autoCompleteType='off'
                    keyboardType='phone-pad'
                    maxLength={props.maxLenPhone}
                    onSubmitEditing={props.handleSubmit}
                    onBlur={props.phoneDefocus}
                />
            </InputArea>
    )
}