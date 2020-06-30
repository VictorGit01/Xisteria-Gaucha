import React, { useEffect, useState, useContext } from 'react';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { Dimensions, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import ListOfCities from '../ListOfCities';
import firebase from '../../firebase';
import axios from 'axios';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

function normalize(size) {
    return (width + height) / size
}

const Page = styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
    align-items: center;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    padding-horizontal: ${normalize(50)}px;
`

const Section = styled.View`
    width: 100%;
    justify-content: center;
    background-color: rgba(0, 0, 0, .08);
    padding: 15px;
`

const SectionText = styled.Text`
    font-size: 17px;
    font-weight: bold;
    color: #000;
`

const ItemArea = styled.View`
    padding-horizontal: ${normalize(50)}px;
    padding-bottom: 30px;
`

const Item = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    align-items: center;
    padding-vertical: 15px;
    border-bottom-width: .5px;
    border-color: #999;
`
// width: ${width - 30}px;

const LeftItem = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`

const ItemText = styled.Text`
    font-size: 16px;
    color: #555;
`

const BoxExtra = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ccc'};
    border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: .5px;
    margin-right: 15px;
    margin-left: 5px;
`

const DoubleAction = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${normalize(50)}px;
`

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '100%'};
`

const Title = styled.Text`
    font-size: ${normalize(63)}px;
    font-weight: bold;
    color: #000;
`

const SubTitle = styled.Text`
    font-size: ${normalize(72)}px;
    color: #999;
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

const InputSelect = styled.View`
    border-bottom-width: 1px;
    border-color: #fe9601;
`

const ButtonSave = styled.TouchableOpacity`
    height: ${normalize(24)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 3px;
    margin-vertical: 40px;
`

const ButtonText = styled.Text`
    font-size: ${props => props.size || normalize(63)}px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
`

const Screen = (props) => {
    const [ city, setCity ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ address, setAddress ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ ddd1, setDDD1 ] = useState('')
    const [ ddd2, setDDD2 ] = useState('')
    const [ phone1, setPhone1 ] = useState('')
    const [ phone2, setPhone2 ] = useState('')
    const [ deliveryFee, setDeliveryFee ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPass, setConfirmPass ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ count, setCount ] = useState(false)
    const [ listCities, setListCities ] = useState([])
    const [ selectedPay, setSelectedPay ] = useState([])
    const [ selectedDlv, setSelectedDlv ] = useState([])
    const [ selectedCity, setSelectedCity ] = useState({})
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const { navigation } = props
    const cities = firebase.database().ref('cities')
    const cityId = firebase.auth().currentUser.uid

    const payMethods = ['Dinheiro', 'Cartão de crédito']
    const dlvMethods = ['Delivery', 'Retirada no balcão']

    function onScreen() {
        cities.child(cityId).on('value', snapshot => {
            let newDDD1 = snapshot.val().ddd1 ? snapshot.val().ddd1 : ''
            let newPhone1 = snapshot.val().phone1 ? snapshot.val().phone1 : ''

            let newDDD2 = snapshot.val().ddd2 ? snapshot.val().ddd2 : ''
            let newPhone2 = snapshot.val().phone2 ? snapshot.val().phone2 : ''

            setEmail(snapshot.val().email)
            // setCity(snapshot.val().city)
            setSelectedCity(snapshot.val().selectedCity)
            setDistrict(snapshot.val().district)
            setAddress(snapshot.val().address)
            setNumber(snapshot.val().number)
            setDDD1(newDDD1)
            setPhone1(newPhone1)
            setDDD2(newDDD2)
            setPhone2(newPhone2)
            setDeliveryFee(snapshot.val().deliveryFee)
            setSelectedDlv(snapshot.val().selectedDlv)
            setSelectedPay(snapshot.val().selectedPay)
        })

        const fetchData = async () => {
            let newListCities = []

            function secondOption() {
                ListOfCities.map((item, index) => {
                    newListCities.push({
                        label: item.nome,
                        value: index,
                    })
                })
            }

            await axios(
                'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios'
            )
            .then(resp => {
                resp.data.map((item, index) => {
                    newListCities.push({
                        label: item.nome,
                        value: index,
                    })
                })
            })
            .catch(error => {
                console.log(error)
                secondOption()
            })

            setListCities(newListCities)
            // setTimeout(() => {
            // }, 1500)
        }

        fetchData()
    }

    const onDDD1Change = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDDD1(cleaned)
        // if (cleaned.length == 2) ref_input8.current.focus()
    }

    const onDDD2Change = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDDD2(cleaned)
        // if (cleaned.length == 2) ref_input8.current.focus()
    }

    const onPhone1Change = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setPhone1(cleaned)
        // if (cleaned.length == 9) ref_input9.current.focus()
    }

    const onPhone2Change = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setPhone2(cleaned)
        // if (cleaned.length == 9) ref_input9.current.focus()
    }

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    function handleLoadEd() {
        setLoaderVisible(false)
        // setEditable(true)
    }

    function saveData() {
        let snapCopy;

        cities.child(cityId).on('value', snapshot => {
            snapCopy = JSON.parse(JSON.stringify(snapshot.val()))
        })

        let newDDD1 = ddd1.trim().length > 0 ? ddd1.replace(/\D/g, '') : null
        let newPhone1 = phone1.trim().length > 0 ? phone1.replace(/\D/g, '') : null

        let newDDD2 = ddd2.trim().length > 0 ? ddd2.replace(/\D/g, '') : null
        let newPhone2 = phone2.trim().length > 0 ? phone2.replace(/\D/g, '') : null

        snapCopy.city = city
        snapCopy.district = district
        snapCopy.address = address
        snapCopy.number = number
        snapCopy.ddd1 = newDDD1
        snapCopy.phone1 = newPhone1
        snapCopy.ddd2 = newDDD2
        snapCopy.phone2 = newPhone2

        console.log(snapCopy)

        cities.child(cityId).set(snapCopy)
        .then(() => {
            setTimeout(() => {
                handleLoadEd()
                toastMsg('Dados salvos com sucesso!')
            }, 2000)
        })

        // cities.child(cityId).set({
        //     city,
        //     district,
        //     address,
        //     number,
        //     ddd1: newDDD1,
        //     phone1: newPhone1,
        //     ddd2: newDDD2,
        //     phone2: newPhone2,
        //     deliveryFee,
        //     selectedCity,
        //     selectedDlv,
        //     selectedPay,
        // })
    }

    function handleSave() {
        function dddOrPhoneEmpty(camp1, camp2) {
            return camp1.trim().length > 0 && camp2.trim().length < 1
        }

        function checkDDD(camp) {
            return camp.trim().length > 0 && camp.trim().length < 2
        }

        function checkPhone(camp) {
            return camp.trim().length > 0 && camp.trim().length < 8
        }

        if (email.trim().length <= 0) {
            toastMsg('Digite um email para o local.')
        } else if (Object.keys(selectedCity).length == 0 || selectedCity.index == 0) {
            toastMsg('Selecione uma cidade.')
        } else if (district.trim().length <= 0) {
            toastMsg('Digite o bairro do local.')
        } else if (address.trim().length <= 0) {
            toastMsg('Digite o endereço do local.')
        } else if (number.trim().length <= 0) {
            toastMsg('Digite o número do endereço.')
        } else if (((ddd1 && phone1) || (ddd2 && phone2)).trim().length < 1) {
            toastMsg('Insira um telefone.')
        } else if ((dddOrPhoneEmpty(ddd1, phone1) || dddOrPhoneEmpty(phone1, ddd1)) || ((dddOrPhoneEmpty(ddd2, phone2) || dddOrPhoneEmpty(phone2, ddd2)))) {
            toastMsg('Termine de inserir o telefone.')
        }
        // else if (!state.isConnected) {
        //     // handleLoadEd()
        //     toastMsg('Verifique sua conexão com a internet.')
        // } 
        else if (checkDDD(ddd1) || checkDDD(ddd2)) {
            toastMsg('DDD inválido.')
        } else if (checkPhone(phone1) || checkPhone(phone2)) {
            toastMsg('Número de telefone inválido.')
        } else if (selectedDlv.length == 0) {
            toastMsg('Selecione as formas de entrega.')
        } else if (selectedPay.length == 0) {
            toastMsg('Selecione as formas de pagamento.')
        } else {
            if (!count) {
                setLoaderVisible(true)
                saveData()
            }
        }
    }

    function handleSelectedPay(index) {
        let alreadySelectedPay = selectedPay.findIndex(item => item === index)

        if (alreadySelectedPay >= 0) {
            const filteredPay = selectedPay.filter(item => item !== index)

            setSelectedPay(filteredPay)
        } else {
            setSelectedPay([ ...selectedPay, index ])
        }
    }

    function handleSelectedDlv(index) {
        let alreadySelectedDlv = selectedDlv.findIndex(item => item === index)

        if (alreadySelectedDlv >= 0) {
            const filteredDlv = selectedDlv.filter(item => item !== index)

            setSelectedDlv(filteredDlv)
        } else {
            setSelectedDlv([ ...selectedDlv, index ])
        }
    }

    function onValueChange(value, index) {
        setSelectedCity({ value, index })
        setCity(ListOfCities[value].nome)
    }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={onScreen}
            />
            <Scroll
                contentContainerStyle={{  paddingTop: normalize(50), paddingBottom: normalize(10) }}
                // paddingHorizontal: normalize(50),
            >
                <Header>
                    <Title style={{ marginBottom: 10, marginTop: 0 }} >Informações de cadastro</Title>   
                    <SubTitle>E-mail cadastrado</SubTitle>
                    <SubTitle>{email}</SubTitle>
                </Header>

                <Section style={{ marginTop: normalize(40) }} >
                    <SectionText>Endereço</SectionText>
                </Section>
                <ItemArea>
                    <DoubleAction>
                        <Action width='46%' >
                            <Title>Nome da cidade:</Title>
                            <InputSelect>
                                <RNPickerSelect
                                    // itemKey={1}
                                    items={listCities}
                                    onValueChange={onValueChange}
                                    // onValueChange={() => {}}
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
                                    value={selectedCity.value}
                                    useNativeAndroidPickerStyle={false}
                                    placeholder={{ label: 'Cidade', value: null, color: '#999' }}

                                />
                            </InputSelect>
                        </Action>

                        <Action width='46%' >
                            <Title>Bairro:</Title>
                            <Input
                                value={district}
                                onChangeText={(t) => setDistrict(t)}
                                returnKeyType='next'
                                // editable={editable}
                                // onSubmitEditing={() => ref_input5.current.focus()}
                                // ref={ref_input4}
                                blurOnSubmit={false}
                                placeholderTextColor='#999'
                            />
                        </Action>
                    </DoubleAction>

                    <DoubleAction>
                        <Action width='72%' >
                            <Title>Endereço:</Title>
                            <Input
                                value={address}
                                onChangeText={(t) => setAddress(t)}
                                // placeholder='Rua/Avenida'
                                returnKeyType='next'
                                // editable={editable}
                                // onSubmitEditing={() => ref_input6.current.focus()}
                                // ref={ref_input5}
                                blurOnSubmit={false}
                                placeholderTextColor='#999'
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
                                placeholderTextColor='#999'
                            />
                        </Action>
                    </DoubleAction>
                </ItemArea>

                <Section>
                    <SectionText>Telefones</SectionText>
                </Section>
                <ItemArea>
                    <DoubleAction
                        // style={{ marginTop: normalize(40) }}
                    >
                        <Action width='20%' >
                            <Title>DDD:</Title>
                            <Input
                                value={ddd1}
                                onChangeText={(t) => onDDD1Change(t)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD}
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
                                value={phone1}
                                onChangeText={(t) => onPhone1Change(t)}
                                placeholder='00000-0000'
                                keyboardType='phone-pad'
                                maxLength={maxLenPhone}
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

                    <DoubleAction
                        // style={{ marginTop: normalize(40) }}
                    >
                        <Action width='20%' >
                            <Title>DDD:</Title>
                            <Input
                                value={ddd2}
                                onChangeText={(t) => onDDD2Change(t)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD}
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
                                value={phone2}
                                onChangeText={(t) => onPhone2Change(t)}
                                placeholder='00000-0000'
                                keyboardType='phone-pad'
                                maxLength={maxLenPhone}
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
                </ItemArea>

                <Section>
                    <SectionText>Taxa de entrega</SectionText>
                </Section>
                <ItemArea>
                    <Action
                        style={{ marginTop: normalize(50) }}
                    >
                        <Title>Valor da taxa:</Title>
                        <Input
                            value={deliveryFee}
                            onChangeText={(t) => setDeliveryFee(t)}
                            placeholder='R$ 0,00'
                        />
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Formas de entrega</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0 }} >
                    <Action>
                        {dlvMethods.map((item, index) => (
                            <Item
                                key={index}
                                onPress={() => handleSelectedDlv(index)}
                                activeOpacity={.7}
                                style={{ borderBottomWidth: index == 0 ? .5 : 0 }}
                            >
                                <LeftItem>
                                    <BoxExtra selected={selectedDlv.includes(index) ? true : false} ></BoxExtra>
                                    <ItemText>{item}</ItemText>
                                </LeftItem>
                                <FontIcon name={index === 0 ? 'motorcycle' : 'store'} size={20} color='#077a15' />
                            </Item>
                        ))}
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Formas de pagamento</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0, marginBottom: 30, borderBottomWidth: .5 , borderColor: '#999' }} >
                    <Action
                        // style={{ marginTop: normalize(50) }}
                    >
                        {payMethods.map((item, index) => (
                            <Item
                                key={index}
                                onPress={() => handleSelectedPay(index)}
                                activeOpacity={.7}
                                style={{ borderBottomWidth: index == 1 ? 0 : .5 }}
                            >
                                <LeftItem>
                                    <BoxExtra selected={selectedPay.includes(index) ? true : false} ></BoxExtra>
                                    <ItemText>{item}</ItemText>
                                </LeftItem>
                                {<FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={20} color='#077a15' />}
                            </Item>
                        ))}
                    </Action>
                </ItemArea>

                <ButtonSave style={{ alignSelf: 'center' }} onPress={handleSave} >
                    <ButtonText>Salvar</ButtonText>
                </ButtonSave>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    return {
        headerTitle: 'Dados da cidade',
        headerLeft: () => (
            <ButtonIcon
                onPress={() => navigation.openDrawer()}
                activeOpacity={.7}
                hitSlop={{ right: 30 }}
            >
                <Icon name='menu' size={25} color='#fff' />
            </ButtonIcon>
        )
    }
}

export default Screen;