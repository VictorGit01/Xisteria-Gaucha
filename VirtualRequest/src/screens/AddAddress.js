import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid } from 'react-native';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
import uuid from 'uuid/v4';
import firebase from '../../firebase';

// Components:
import LoadingPage from '../components/LoadingPage'

const { height, width } = Dimensions.get('window');

// function normalize(size) {
//     return (width + height) / size;
// }

const Page = styled.ScrollView`
    flex: 1;
    background-color: #b9f7bf;
`;

const DoubleAction = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${normalize(28)}px;
`
// margin-top: ${normalize(40)}px;

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '90%'};
`

const Title = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #000;
`

const InputArea = styled.View`
    margin-top: ${normalize(8)}px;
    justify-content: center;
`
// margin-top: ${normalize(7.53)}px;
// margin-top: ${normalize(150)}px;

const Input = styled.TextInput`
    margin-top: ${normalize(8)}px;
    padding-bottom: ${normalize(5)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
    font-size: ${normalize(16)}px;
`
// margin-top: ${normalize(150)}px
// padding-bottom: ${normalize(230)}px;

const InputSelect = styled.View`
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
`
// margin-top: ${normalize(150)}px;
// padding-bottom: ${normalize(230)}px;
// padding-top: 2px

const ButtonArea = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-bottom: ${normalize(20)}px;
`

const ButtonSave = styled.TouchableHighlight`
    width: 90%;
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(30)}px;
    `
// height: ${normalize(24)}px;
// height: ${normalize(47.12)}px;

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #fff;
`

const AddAddress = (props) => {
    const [ loading, setLoading ] = useState(false)
    const [ name, setName ] = useState('')
    const [ surname, setSurname ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ landmark, setLandmark ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ clickedButton, setClickedButton ] = useState(false)
    const [ listCities, setListCities ] = useState([])
    const [ selectedCity, setSelectedCity ] = useState({})

    const ref_input2 = useRef()
    const ref_input3 = useRef()
    const ref_input4 = useRef()
    const ref_input5 = useRef()
    const ref_input6 = useRef()
    const ref_input7 = useRef()
    const ref_input8 = useRef()
    const ref_input9 = useRef()

    const cities = firebase.database().ref('cities')

    const { navigation, list_address, setListAddress, address, setAddress, cityId, list_request, setListRequest } = props;
    const nav = navigation.navigate
    const goBack = navigation.goBack
    const params = navigation.state.params
    const editEnabled = params.editEnabled

    function isObject(n) {
        return Object.prototype.toString.call(n) === '[object Object]'
    }

    useEffect(() => {
        // alert(`NORMALIZE 24: ${normalize(24)}`)
        // setSelectedCity({ value: cityId })
        function callCities() {
            cities.on('value', snapshot => {
                let newList = []
                snapshot.forEach(childItem => {
                    newList.push({
                        label: childItem.val().city,
                        value: childItem.val().id
                    })
                    // if (childItem.val().id == cityId) {
                    //     setSelectedCity({ value: childItem.val().city,  })
                    // }
                })
                setListCities(newList)
            })
        }

        if (editEnabled) {
            let { item } = params
            let ajustedDDD = `(${item.ddd})`;

            setLoading(true)
            setMaxLenDDD(4)

            callCities()
            setTimeout(() => {
                setSelectedCity({ value: params.item.idCity })
                setName(item.name)
                setSurname(item.surname)
                setDistrict(item.district)
                setStreet(item.street)
                setNumber(item.number)
                setLandmark(item.landmark)
                // setDDD(item.ddd)
                // dddDefocus(item.ddd)
                setDDD(ajustedDDD)
                // setPhone(item.phone)
                onPhoneChange(item.phone)

                setLoading(false)
            }, 1500)
        } else {
            callCities()
        }
        
    }, [])

    const onDDDChange = text => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDDD(cleaned)
        // if (cleaned.length == 2) 
    }

    function dddFocus() {
        maxLenDDD == 4 ? setMaxLenDDD(2) : null;
        let newDDD = ddd.replace(/\D/g, '');
        setDDD(newDDD);
    }

    function dddDefocus() {
        maxLenDDD == 2 ? setMaxLenDDD(4) : null;

        if (ddd.length == 2) {
            let ajustedDDD = `(${ddd})`;
            setDDD(ajustedDDD);
        }
    }

    // const onPhoneChange = text => {
    //     let cleaned = ('' + text).replace(/\D/g, '')
    //     setPhone(cleaned)
    // }

    function onPhoneChange(text) {
        let cleaned = ('' + text).replace(/\D/g, '')

        let part1;
        let part2;
        let newPhone;

        if (cleaned.length <= 4) {
            setPhone(cleaned)
        } else if (cleaned.length > 4 && cleaned.length <= 8) {
            part1 = cleaned.slice(0, 4);
            part2 = cleaned.slice(4, 8);

            newPhone = part1 + '-' + part2;
            setPhone(newPhone)
        } else if (cleaned.length === 9) {
            part1 = cleaned.slice(0, 5);
            part2 = cleaned.slice(5, 9);

            newPhone = part1 + '-' + part2;
            setPhone(newPhone)
        }
    }

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180)
        )  
    }

    // function handleSave() {
    //     const index = listCities.findIndex(item => item.value === selected.value)
    //     console.log(listCities[index].label)
    // }

    function handleSave() {
        function cleaned(text) {
            let newText = ('' + text).replace(/\D/g, '');
            return newText;
        }

        function dddOrPhoneEmpty(field1, field2) {
            return cleaned(field1).trim().length > 0 && cleaned(field2).trim().length < 1
        }

        function checkDDD(field) {
            return cleaned(field).trim().length > 0 && cleaned(field).trim().length < 2
        }

        function checkPhone(field) {
            return cleaned(field).trim().length > 0 && cleaned(field).trim().length < 8
        }

        function onlyOneSpace(text) {
            let newText = text.replace(/\s+/g, ' ').trim();
            return newText;
        }

        console.log('SELECTED CITY:')
        console.log(selectedCity)

        if (name.trim().length <= 0) {
            toastMsg('Digite seu nome.')
        } else if (surname.trim().length <= 0) {
            toastMsg('Digite seu sobrenome')
        } else if (Object.keys(selectedCity).length == 0 || selectedCity.index == 0) {
            toastMsg('Selecione uma cidade.')
        } else if (district.trim().length <= 0) {
            toastMsg('Digite seu bairro.')
        } else if (street.trim().length <= 0) {
            toastMsg('Insira sua rua ou avenida.')
        } else if (number.trim().length <= 0) {
            toastMsg('Digite o número da sua residência.')
        } else if ((ddd && phone).trim().length < 1) {
            toastMsg('Insira seu telefone.')
        } else if (dddOrPhoneEmpty(ddd, phone) || dddOrPhoneEmpty(phone, ddd)) {
            toastMsg('Termine de inserir seu telefone.')
        } else if (checkDDD(ddd)) {
            toastMsg('DDD inválido.')
        } else if (checkPhone(phone)) {
            toastMsg('Número de telefone inválido.')
        } else if (!clickedButton) {
            const indCity = listCities.findIndex(item => item.value === selectedCity.value)
            const city = listCities[indCity].label
            const idCity = listCities[indCity].value
            
            let index = params.index
            let id = isObject(params.item) ? params.item.id : undefined
            let listCopy = Array.from(list_address)
            let newListRequest = Array.from(list_request)

            let newDDD = cleaned(ddd)
            let newPhone = cleaned(phone)

            let info_address = {
                id: editEnabled ? id : uuid(),
                idCity,
                city: onlyOneSpace(city),
                name: onlyOneSpace(name),
                surname: onlyOneSpace(surname),
                district: onlyOneSpace(district),
                street: onlyOneSpace(street),
                number,
                landmark: onlyOneSpace(landmark),
                ddd: newDDD,
                phone: newPhone,
            }
    
            if (editEnabled) {
                listCopy[index] = info_address
                setAddress(info_address)
            } else {
                listCopy = list_address.length > 0 ? [ ...list_address, info_address ] : [info_address]
                let indReq = newListRequest.findIndex(item => item.id == idCity)
                if (indReq === -1) {
                    newListRequest.push({
                        id: idCity,
                        data: []
                    })
        
                    setListRequest(newListRequest)
                }
            }
            // let listCopy = []
            // listCopy.push(info_address)
    
            // let list_address = [ ...list_address, info_address ]
    
            setListAddress(listCopy)
            setClickedButton(true)
            
            console.log('------------------LISTCOPY------------------')
            console.log(listCopy)
            console.log('------------------INFO_ADDRESS------------------')
            console.log(info_address)
            toastMsg('Enderço salvo com sucesso!')
            goBack()
        }

        // if ((name && surname && district && street && number && ddd && phone).trim().length > 0 && selectedCity.index !== 0) {
        // } else {
        //     toastMsg('Preencha os campos acima.')
        // }
    }

    function onChangeText(text, setText, isName) {
        let newText;
        // let alphaExp = /^[a-zA-Z]+$/;
        // let newText = text.match(alphaExp);

        // let cleaned = ('' + text).replace(/\D/g, '')

        // let alphaExp = /^[a-zA-Z]*$/g
        // let newText = ('' + text).replace(/^[a-zA-Z]*$/g);
        // let newText = ('' + text).replace(/^[a-zA-Z]+$/);
        // let newText = alphaExp.test(text)

        if (isName) {
            newText = text.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1. ]*$/g, '');
        } else {
            newText = text.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d10-9. ]*$/g, '');
        }

        // return newText;
        setText(newText)
    }

    function onNumberChange(text) {
        let cleaned = ('' + text).replace(/\D/g, '')
        setNumber(cleaned)
    }

    if (loading) {
        return <LoadingPage />
    }

    return (
        <Page contentContainerStyle={{ alignItems: 'center' }} keyboardShouldPersistTaps='handled' >
            <DoubleAction
                style={{
                    // marginTop: normalize(40)
                    marginTop: normalize(28)
                }}
            >
                <Action width='46%' >
                    <Title>Nome:</Title>
                    <Input
                        value={name}
                        // onChangeText={(t) => setName(t)}
                        onChangeText={(text) => onChangeText(text, setName, true)}
                        returnKeyType='next'
                        // editable={editable}
                        onSubmitEditing={() => ref_input3.current.focus()}
                        ref={ref_input2}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
                <Action width='46%' >
                    <Title>Sobrenome:</Title>
                    <Input
                        value={surname}
                        // onChangeText={(t) => setSurname(t)}
                        onChangeText={(text) => onChangeText(text, setSurname, true)}
                        returnKeyType='next'
                        // editable={editable}
                        onSubmitEditing={() => ref_input4.current.focus()}
                        ref={ref_input3}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            {/* <DoubleAction style={{ marginTop: normalize(40) }}> */}
            <DoubleAction style={{ marginTop: normalize(28) }}>
                <Action width='46%' >
                    <Title>Cidade:</Title>
                    <InputSelect>
                        <RNPickerSelect
                            // itemKey={1}
                            items={listCities}
                            onValueChange={(value, index) => setSelectedCity({ value, index })}
                            style={{
                                inputAndroid: {
                                    // paddingBottom: normalize(230),
                                    paddingBottom: normalize(5),
                                    // marginTop: normalize(150),
                                    marginTop: normalize(8),
                                    // fontSize: normalize(72),
                                    fontSize: normalize(16),
                                    color: '#000'
                                },
                                placeholder: {
                                    color: '#999'
                                }
                            }}
                            value={selectedCity.value}
                            key={selectedCity.value}
                            // onSubmitEditing={() => ref_input5.current.focus()}
                            // ref={ref_input4}
                            // onUpArrow={() => console.log('------------FECHOU O MODAL------------')}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: 'Sua cidade', value: null, color: '#999' }}

                        />
                    </InputSelect>
                </Action>
                <Action width='46%' >
                    <Title>Bairro:</Title>
                    <Input
                        value={district}
                        // onChangeText={(t) => setDistrict(t)}
                        onChangeText={(text) => onChangeText(text, setDistrict)}
                        // placeholder='Seu email'
                        // keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        // editable={editable}
                        onSubmitEditing={() => ref_input5.current.focus()}
                        ref={ref_input4}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            <DoubleAction
                style={{
                    // marginTop: normalize(40)
                    marginTop: normalize(28)
                }}
            >
                <Action width='72%' >
                    <Title>Rua / Avenida:</Title>
                    <Input
                        value={street}
                        // onChangeText={(t) => setStreet(t)}
                        onChangeText={(text) => onChangeText(text, setStreet)}
                        // placeholder='Rua/Avenida'
                        returnKeyType='next'
                        // editable={editable}
                        onSubmitEditing={() => ref_input6.current.focus()}
                        ref={ref_input5}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
                <Action width='20%' >
                    <Title>Nº:</Title>
                    <Input
                        value={number}
                        // onChangeText={(t) => setNumber(t)}
                        onChangeText={(t) => onNumberChange(t)}
                        keyboardType='numeric'
                        returnKeyType='next'
                        // editable={editable}
                        onSubmitEditing={() => ref_input7.current.focus()}
                        ref={ref_input6}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            <Action
                // style={{ marginTop: normalize(40) }}
                style={{ marginTop: normalize(28) }}
            >
                <Title>Ponto de referência:</Title>
                <Input
                    value={landmark}
                    // onChangeText={(t) => setLandmark(t)}
                    onChangeText={(text) => onChangeText(text, setLandmark)}
                    placeholder='Opcional'
                    returnKeyType='next'
                    onSubmitEditing={() => ref_input8.current.focus()}
                    ref={ref_input7}
                    blurOnSubmit={false}
                    placeholderTextColor='#999'
                />
            </Action>

            <DoubleAction
                    style={{
                        // marginTop: normalize(40)
                        marginTop: normalize(28)
                    }}
                >
                    <Action width='20%' >
                        <Title>DDD:</Title>
                        <Input
                            value={ddd}
                            onChangeText={(t) => onDDDChange(t)}
                            placeholder='(00)'
                            keyboardType='phone-pad'
                            maxLength={maxLenDDD}
                            returnKeyType='next'
                            // editable={editable}
                            onFocus={dddFocus}
                            onSubmitEditing={() => ref_input9.current.focus()}
                            ref={ref_input8}
                            blurOnSubmit={false}
                            onBlur={dddDefocus}
                            placeholderTextColor='#999'
                        />
                    </Action>
                    <Action width='72%' >
                        <Title>Telefone:</Title>
                        <Input
                            value={phone}
                            onChangeText={(t) => onPhoneChange(t)}
                            placeholder='00000-0000'
                            keyboardType='phone-pad'
                            maxLength={10}
                            returnKeyType='done'
                            // editable={editable}
                            // onFocus={phoneFocus}
                            // onSubmitEditing={() => ref_input9.current.focus()}
                            ref={ref_input9}
                            // blurOnSubmit={false}
                            // onBlur={phoneDefocus}
                            placeholderTextColor='#999'
                        />
                    </Action>
                </DoubleAction>
                <ButtonSave
                    onPress={handleSave}
                    // underlayColor='#fe9702'
                    underlayColor='#e5921a'
                >
                    <ButtonText>Salvar</ButtonText>
                </ButtonSave>
        </Page>
    );
}

AddAddress.navigationOptions = ({ navigation }) => {
    const editEnabled = navigation.state.params.editEnabled

    return {
        headerTitle: editEnabled ? 'Alterar endereço' : 'Adicionar novo endereço'
    }
}

const mapStateToProps = (state) => {
    return {
        list_address: state.userReducer.list_address,
        address: state.userReducer.address,
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListAddress: (list_address) => dispatch({type: 'SET_LIST_ADDRESS', payload: {list_address}}),
        setAddress: (address) => dispatch({type: 'SET_ADDRESS', payload: {address}}),
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);