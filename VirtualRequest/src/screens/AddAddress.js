import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
import uuid from 'uuid/v4';
import firebase from '../../firebase';

const { height, width } = Dimensions.get('window');

function normalize(size) {
    return (width + height) / size
}

const Page = styled.ScrollView`
    flex: 1;
    background-color: #b9f7bf;
`;

const DoubleAction = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${normalize(40)}px;
`

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '90%'};
`

const Title = styled.Text`
    font-size: ${normalize(63)}px;
    font-weight: bold;
    color: #000;
`

const InputArea = styled.View`
    margin-top: ${normalize(150)}px;
    justify-content: center;
`

const Input = styled.TextInput`
margin-top: ${normalize(150)}px
padding-bottom: ${normalize(230)}px;
    border-bottom-width: 1px;
    border-color: #fe9601;
    font-size: ${normalize(72)}px;
`

// margin-top: ${normalize(150)}px
// padding-bottom: ${normalize(230)}px;

const InputSelect = styled.View`

    border-bottom-width: 1px;
    border-color: #fe9601;
`
// margin-top: ${normalize(150)}px;
// padding-bottom: ${normalize(230)}px;
// padding-top: 2px

const ButtonArea = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px
`

const ButtonSave = styled.TouchableHighlight`
    width: 90%;
    height: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 3px;
    margin-vertical: 30px;
`

const ButtonText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`

const AddAddress = (props) => {
    const [ name, setName ] = useState('')
    const [ surname, setSurName ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ listCities, setListCities ] = useState([])
    const [ selected, setSelected ] = useState({ value: undefined })

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
        // setSelected({ value: cityId })
        function callCities() {
            cities.on('value', snapshot => {
                let newList = []
                snapshot.forEach(childItem => {
                    newList.push({
                        label: childItem.val().city,
                        value: childItem.val().id
                    })
                    // if (childItem.val().id == cityId) {
                    //     setSelected({ value: childItem.val().city,  })
                    // }
                })
                setListCities(newList)
            })
        }

        if (editEnabled) {
            let { item } = params

            callCities()
            setTimeout(() => {
                setSelected({ value: params.item.idCity })
                setName(item.name)
                setSurName(item.surname)
                setDistrict(item.district)
                setStreet(item.street)
                setNumber(item.number)
                setDDD(item.ddd)
                setPhone(item.phone)
            }, 1000)
        } else {
            callCities()
        }
        
    }, [])

    const onDDDChange = text => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDDD(cleaned)
        // if (cleaned.length == 2) 
    }

    const onPhoneChange = text => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setPhone(cleaned)
    }

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )  
    }

    // function handleSave() {
    //     const index = listCities.findIndex(item => item.value === selected.value)
    //     console.log(listCities[index].label)
    // }

    function handleSave() {
        if ((name && surname && district && street && number && ddd && phone).trim().length > 0 && selected.index !== 0) {
            const indCity = listCities.findIndex(item => item.value === selected.value)
            const city = listCities[indCity].label
            const idCity = listCities[indCity].value
            let index = params.index
            let id = isObject(params.item) ? params.item.id : undefined
            let listCopy = Array.from(list_address)
            let newListRequest = Array.from(list_request)
    
            let info_address = {
                id: editEnabled ? id : uuid(),
                idCity,
                city,
                name,
                surname,
                district,
                street,
                number,
                ddd,
                phone,
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
            
            console.log('------------------LISTCOPY------------------')
            console.log(listCopy)
            console.log('------------------INFO_ADDRESS------------------')
            console.log(info_address)
            toastMsg('Enderço salvo com sucesso!')
            goBack()
        } else {
            toastMsg('Preencha os campos acima.')
        }
    }

    return (
        <Page contentContainerStyle={{ alignItems: 'center' }} >
            <DoubleAction
                style={{
                    marginTop: normalize(40)
                }}
            >
                <Action width='46%' >
                    <Title>Nome:</Title>
                    <Input
                        value={name}
                        onChangeText={(t) => setName(t)}
                        returnKeyType='next'
                        // editable={editable}
                        // onSubmitEditing={() => ref_input4.current.focus()}
                        // ref={ref_input3}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
                <Action width='46%' >
                    <Title>Sobrenome:</Title>
                    <Input
                        value={surname}
                        onChangeText={(t) => setSurName(t)}
                        returnKeyType='next'
                        // editable={editable}
                        // onSubmitEditing={() => ref_input5.current.focus()}
                        // ref={ref_input4}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            <DoubleAction style={{ marginTop: normalize(40) }}>
                <Action width='46%' >
                    <Title>Cidade:</Title>
                    <InputSelect>
                        <RNPickerSelect
                            // itemKey={1}
                            items={listCities}
                            onValueChange={(value, index) => setSelected({ value, index })}
                            style={{
                                inputAndroid: {
                                    paddingBottom: normalize(230),
                                    marginTop: normalize(150),
                                    fontSize: normalize(72)
                                },
                                placeholder: {
                                    color: '#999'
                                }
                            }}
                            value={selected.value}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: 'Sua cidade', value: null, color: '#999' }}

                        />
                    </InputSelect>
                </Action>
                <Action width='46%' >
                    <Title>Bairro:</Title>
                    <Input
                        value={district}
                        onChangeText={(t) => setDistrict(t)}
                        // placeholder='Seu email'
                        // keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        // editable={editable}
                        // onSubmitEditing={() => ref_input3.current.focus()}
                        // ref={ref_input2}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            <DoubleAction
                style={{
                    marginTop: normalize(40)
                }}
            >
                <Action width='72%' >
                    <Title>Rua / Avenida:</Title>
                    <Input
                        value={street}
                        onChangeText={(t) => setStreet(t)}
                        // placeholder='Rua/Avenida'
                        returnKeyType='next'
                        // editable={editable}
                        // onSubmitEditing={() => ref_input6.current.focus()}
                        // ref={ref_input5}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
                <Action width='20%' >
                    <Title>Nº:</Title>
                    <Input
                        value={number}
                        onChangeText={(t) => setNumber(t)}
                        keyboardType='numeric'
                        returnKeyType='next'
                        // editable={editable}
                        // onSubmitEditing={() => ref_input7.current.focus()}
                        // ref={ref_input6}
                        blurOnSubmit={false}
                        placeholderTextColor='#ff2626'
                    />
                </Action>
            </DoubleAction>

            <DoubleAction
                    style={{
                        marginTop: normalize(40)
                    }}
                >
                    <Action width='20%' >
                        <Title>DDD:</Title>
                        <Input
                            value={ddd}
                            onChangeText={(t) => onDDDChange(t)}
                            placeholder='(00)'
                            keyboardType='phone-pad'
                            // maxLength={maxLenDDD}
                            returnKeyType='next'
                            // editable={editable}
                            // onFocus={dddFocus}
                            // onSubmitEditing={() => ref_input8.current.focus()}
                            // ref={ref_input7}
                            blurOnSubmit={false}
                            // onBlur={dddDefocus}
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
                            // maxLength={maxLenPhone}
                            returnKeyType='next'
                            // editable={editable}
                            // onFocus={phoneFocus}
                            // onSubmitEditing={() => ref_input9.current.focus()}
                            // ref={ref_input8}
                            blurOnSubmit={false}
                            // onBlur={phoneDefocus}
                            placeholderTextColor='#999'
                        />
                    </Action>
                </DoubleAction>
                <ButtonSave
                    onPress={handleSave}
                    underlayColor='#fe9702'
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