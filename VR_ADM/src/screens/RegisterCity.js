import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid, Keyboard } from 'react-native';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
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

const Item = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    align-items: center;
    padding-vertical: 15px;
    border-bottom-width: .5px;
    border-color: #999;
`

const ItemArea = styled.View`
    padding-horizontal: ${normalize(50)}px;
    padding-bottom: 30px;
`

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
    margin-top: ${normalize(40)}px;
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

const ButtonArea = styled.View`
    justify-content: center;
    align-items: center;
    margin-top: ${normalize(30)}px;
`

const ButtonSignUp = styled.TouchableHighlight`
    width: 90%;
    height: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    margin-bottom: ${normalize(15)}px;
    border-radius: 3px;
`

const ButtonSignIn = styled.TouchableOpacity`
    height: ${normalize(30)}px;
    justify-content: center;
    align-items: center;
    margin: ${normalize(100)}px ${normalize(50)}px;
`

const ButtonText = styled.Text`
    font-size: ${normalize(63)}px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
`

const CaptionText = styled.Text`
    font-size: ${normalize(72)}px;
    color: ${props => props.color || '#999'};
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

    const { navigation, schedulesP1, schedulesP2 } = props
    const nav = navigation.navigate
    const payMethods = ['Dinheiro', 'Cartão de crédito']
    const dlvMethods = ['Delivery', 'Retirada no balcão']

    useEffect(() => {
        firebase.auth().signOut()
    }, [])

    useEffect(() => {
        console.log('--------------SCHEDULES_P1--------------')
        console.log(schedulesP1)

        console.log('--------------SCHEDULES_P2--------------')
        console.log(schedulesP2)
    }, [schedulesP1, schedulesP2])

    useEffect(() => {
        // setLoaderVisible(false)
        const fetchData = async () => {
            let newList = []

            // const reserve_result = await axios(
            //     'http://educacao.dadosabertosbr.com/api/cidades/pa'
            // )

            function secondOption() {
                ListOfCities.map((item, index) => {
                    newList.push({
                        label: item.nome,
                        value: index
                    })
                }) 
            }

            // await axios(
            //     'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios'
            // )
            // .then(resp => {
            //     resp.data.map((item, index) => {
            //         newList.push({
            //             label: item.nome,
            //             value: index
            //         })
            //     })
            // })
            // .catch(error => {
            //     console.log(error)
            //     // toastMsg(`${error.code} - ${error.message}`)
            //     secondOption()
            // })

            secondOption()

            // console.log('-----------LIST_OF_CITIES-----------')
            // ListOfCities.map(item => {
            //     console.log(item)
            // })

            // result.data.map((item, index) => {
            //     newList.push({
            //         label: item.nome,
            //         value: index
            //     })
            // })
            setListCities(newList)
        }

        fetchData()
    }, [])

    // useEffect(() => {
    //     console.log('Dlv:')
    //     console.log(selectedDlv)
    // }, [selectedDlv])

    // useEffect(() => {
    //     console.log('Pay:')
    //     console.log(selectedPay)
    // }, [selectedPay])

    const onNumberChange = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setNumber(cleaned)
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

    const onDlvFeeChange = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        setDeliveryFee(cleaned)
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

    function handleLoadEd() {
        setLoaderVisible(false)
        // setEditable(true)
    }

    const f_Base = () => {
        firebase.auth().createUserWithEmailAndPassword(
            email, password
        ).then((resp) => {
            let user = firebase.auth().currentUser
            if (user) {
                let isCancelled = false
                let id = user.uid
                setCount(true)
                Keyboard.dismiss()
                
                async function handleSetUser() {
                    let cities = await firebase.database().ref('cities')
                    try {
                        if (!isCancelled) {

                            let newDDD1 = ddd1.trim().length > 0 ? ddd1.replace(/\D/g, '') : null
                            let newPhone1 = phone1.trim().length > 0 ? phone1.replace(/\D/g, '') : null

                            let newDDD2 = ddd2.trim().length > 0 ? ddd2.replace(/\D/g, '') : null
                            let newPhone2 = phone2.trim().length > 0 ? phone2.replace(/\D/g, '') : null

                            // let selectedDlvSorted = selectedDlv.sort()
                            // let filteredDlv = selectedDlvSorted.map(item => { return dlvMethods[item] })

                            // let selectedPaySorted = selectedPay.sort()
                            // let filteredPay = selectedPaySorted.map(item => { return payMethods[item] })

                            cities.child(id).set({
                                id,
                                email,
                                city,
                                district,
                                address,
                                number,
                                ddd1: newDDD1,
                                phone1: newPhone1,
                                ddd2: newDDD2,
                                phone2: newPhone2,
                                deliveryFee,
                                selectedCity,
                                selectedDlv,
                                selectedPay,
                                schedulesP1,
                                schedulesP2,
                            }).then((resp) => {
                                setTimeout(() => {
                                    navigation.dispatch(StackActions.reset({
                                        index: 0,
                                        // key: 'HomeDrawer',
                                        actions: [
                                            NavigationActions.navigate({routeName: 'HomeDrawer'})
                                        ]
                                    }))

                                    toastMsg('Cidade cadastrada com sucesso!')
                                }, 2000)
                                
                            }).catch((error) => {
                                handleLoadEd()
                                toastMsg(`${error.code} - ${error.message}`)
                                console.log(error)
                            })

                        }
                    } catch(e) {
                        if (!isCancelled) {
                            handleLoadEd()
                            console.log(e)
                        }
                    }
                }

                handleSetUser()

                return () => {
                    isCancelled = true
                }
            }
    
        })
        .catch((error) => {
            setTimeout(() => {
                handleLoadEd()
                if (error.code == 'auth/invalid-email') {
                    toastMsg('Endereço de email inválido!')
                } else if (error.code == 'auth/weak-password') {
                    toastMsg('Sua senha deve conter pelo menos 6 caracteres.')
                } else if (error.code == 'auth/wrong-password') {
                    toastMsg('Senha incorreta!')
                } else if (error.code == 'auth/email-already-in-use') {
                    toastMsg('Local existente com este email.')
                } else if (error.code == 'auth/too-many-requests') {
                    toastMsg('Ocorreu um erro! Tente mais tarde.')
                } else if (error.code == 'auth/network-requests-failed') {
                    toastMsg('Ocorreu um erro na conexão!')
                } else {
                    toastMsg(`${error.code} - ${error.message}`)
                    console.log(error)
                }
            }, 500)
        })

    }

    function handleSignUp() {
        function dddOrPhoneEmpty(camp1, camp2) {
            return camp1.trim().length > 0 && camp2.trim().length < 1
        }

        function dddAndPhoneEmpty(camp1, camp2) {
            return camp1.trim().length < 1 && camp2.trim().length < 1
        }

        function checkDDD(camp) {
            return camp.trim().length > 0 && camp.trim().length < 2
        }

        function checkPhone(camp) {
            return camp.trim().length > 0 && camp.trim().length < 8
        }

        // console.log(dddOrPhoneEmpty(ddd1, phone1))
        // console.log('DDD1')
        // console.log(dddAndPhoneEmpty(ddd1, phone1))
        // console.log('DDD2')
        // console.log(dddAndPhoneEmpty(ddd2, phone2))

        // if ((email && district && address && password && confirmPass).trim().length <= 0) {
        //     // handleLoadEd()
        //     toastMsg('Preencha os campos acima.')
        // } else 
        if (email.trim().length <= 0) {
            toastMsg('Digite um email para o local.')
        } else if (Object.keys(selectedCity).length == 0 || selectedCity.index == 0) {
            // handleLoadEd()
            toastMsg('Selecione uma cidade.')
        } else if (district.trim().length <= 0) {
            toastMsg('Digite o bairro do local.')
        } else if (address.trim().length <= 0) {
            toastMsg('Digite o endereço do local.')
        } else if (number.trim().length <= 0) {
            toastMsg('Digite o número do endereço.')
        } else if (((ddd1 && phone1) || (ddd2 && phone2)).trim().length < 1) {
        // } else if (dddAndPhoneEmpty(ddd1, phone1) || dddAndPhoneEmpty(ddd2, phone2)) {
            // handleLoadEd()
            toastMsg('Insira um telefone.')
        }
        else if ((dddOrPhoneEmpty(ddd1, phone1) || dddOrPhoneEmpty(phone1, ddd1)) || ((dddOrPhoneEmpty(ddd2, phone2) || dddOrPhoneEmpty(phone2, ddd2)))) {
            // handleLoadEd()
            toastMsg('Termine de inserir o telefone.')
        }
        // else if (((ddd1.trim().length > 0 && phone1.trim().length < 1) || (ddd1.trim().length < 1 && phone1.trim().length > 0)) || ((ddd1.trim().length > 0 && phone1.trim().length < 1) || (ddd1.trim().length < 1 && phone1.trim().length > 0))) {
            // handleLoadEd()
        //     toastMsg('Termine de inserir o telefone.')
        // }
        // else if (ddd1.trim().length < 2 || ddd2.trim().length < 2) {
        else if (checkDDD(ddd1) || checkDDD(ddd2)) {
            // handleLoadEd()
            toastMsg('DDD inválido.')
        // } else if (phone1.trim().length < 8 || phone2.trim().length < 8) {
        } else if (checkPhone(phone1) || checkPhone(phone2)) {
            // handleLoadEd()
            toastMsg('Número de telefone inválido.')
        }
        // else if ((ddd1.trim().length == 0 && ddd2.trim().length < 2) || (ddd2.trim().length == 0 && ddd1.trim().length < 2)) {
            // handleLoadEd()
        //     toastMsg('DDD inválido.')
        // } else if ((phone1.trim().length == 0 && phone2.trim().length < 8) || (phone2.trim().length == 0 && phone1.trim().length < 8)) {
            // handleLoadEd()
        //     toastMsg('Número de telefone inválido.')
        // }
        else if (selectedDlv.length == 0) {
            // handleLoadEd()
            toastMsg('Selecione as formas de entrega.')
        } else if (selectedPay.length == 0) {
            toastMsg('Selecione as formas de pagamento.')
            // handleLoadEd()
        } else if (!schedulesP1 || schedulesP1.length < 1) {
            toastMsg('Defina os horários de funcionamento.')
        } else if (password.trim().length <= 0) {
            toastMsg('Crie uma senha.')
        } else if (confirmPass.trim().length <= 0) {
            toastMsg('Confirme a senha.')
        }
        // else if (!state.isConnected) {
            // handleLoadEd()
        //     toastMsg('Verifique sua conexão com a internet.')
        // } 
        else if (password != confirmPass) {
            // handleLoadEd()
            toastMsg('As senhas não se coincidem.')
        } else {
            if (!count) {
                setLoaderVisible(true)
                f_Base()
                // setTimeout(() => {
                //     handleLoadEd()
                //     toastMsg('Cidade cadastrada!')
                // }, 3000)
            }
        }
    }

    // function handleSignUp() {
    //     // console.log(selectedDlv)
    //     console.log(selectedPay)
    // }

    function navToLogin() {
        navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Login'})
            ]
        }))
    }

    function onValueChange(value, index) {
        setSelectedCity({ value, index })
        setCity(ListOfCities[value].nome)
    }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={() => setLoaderVisible(false)}
            />
            <Scroll
                // contentContainerStyle={{ paddingHorizontal: normalize(50) }}
                keyboardShouldPersistTaps='handled'
            >

                <Section>
                    <SectionText>Endereço</SectionText>
                </Section>
                <ItemArea>
                    <Action
                        style={{ marginTop: normalize(40) }}
                    >
                        <Title>E-mail:</Title>
                        <Input
                            value={email}
                            onChangeText={(t) => setEmail(t)}
                            // placeholder='email para cidade'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            returnKeyType='next'
                            // editable={editable}
                            // onSubmitEditing={() => ref_input3.current.focus()}
                            // ref={ref_input2}
                            blurOnSubmit={false}
                            placeholderTextColor='#999'
                        />
                    </Action>

                    <DoubleAction
                        style={{ marginTop: normalize(40) }}
                    >
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
                                    // value={selected.value}
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
                                placeholder='Rua/Avenida'
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
                                onChangeText={onNumberChange}
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
                        style={{ marginTop: normalize(40) }}
                    >
                        <Action width='20%' >
                            <Title>DDD:</Title>
                            <Input
                                value={ddd1}
                                onChangeText={onDDD1Change}
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
                                onChangeText={onPhone1Change}
                                placeholder='0000-0000'
                                keyboardType='phone-pad'
                                maxLength={maxLenPhone}
                                returnKeyType='next'
                                // editable={editable}
                                // onFocus={phone1Focus}
                                // onSubmitEditing={() => ref_input9.current.focus()}
                                // ref={ref_input8}
                                blurOnSubmit={false}
                                // onBlur={phone1Defocus}
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
                                onChangeText={onDDD2Change}
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
                                onChangeText={onPhone2Change}
                                placeholder='0000-0000'
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
                            onChangeText={onDlvFeeChange}
                            placeholder='R$ 0,00'
                            keyboardType='numeric'
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
                <ItemArea style={{ paddingBottom: 0, borderColor: '#999' }} >
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
                                <FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={20} color='#077a15' />
                            </Item>
                        ))}
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Definir horário de funcionamento</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0 }} >
                    <Action>
                        <Item
                            onPress={() => nav('CreateOpenHours')}
                            style={{ borderBottomWidth: 0, paddingVertical: 20 }}
                        >
                            <LeftItem>
                                <ItemText>Horário { schedulesP1.length > 0 ? 'definido' : 'indefinido'}</ItemText>
                            </LeftItem>
                            <FontIcon name='clock' size={20} color={schedulesP1.length > 0 ? '#077a15' : '#ff2626'} style={{ right: 10 }} />
                            <FontIcon name='chevron-right' size={15} color='#999' />
                        </Item>
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Definir senha</SectionText>
                </Section>
                <ItemArea>
                    <Action
                        style={{ marginTop: normalize(40) }}
                    >
                        <Title>Digite uma senha:</Title>
                        <Input
                            value={password}
                            onChangeText={(t) => setPassword(t)}
                            autoCapitalize='none'
                        />
                    </Action>

                    <Action
                        style={{ marginTop: normalize(40) }}
                    >
                        <Title>Confirme a senha:</Title>
                        <Input
                            value={confirmPass}
                            onChangeText={(t) => setConfirmPass(t)}
                            autoCapitalize='none'
                        />
                    </Action>
                </ItemArea>

                <ButtonArea>
                    <ButtonSignUp onPress={handleSignUp} >
                        <ButtonText>Cadastrar</ButtonText>
                    </ButtonSignUp>
                    <ButtonSignIn
                        onPress={navToLogin}
                        activeOpacity={.7}
                        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    >
                        <CaptionText>Local com conta existente? <CaptionText color='#000' >Login</CaptionText></CaptionText>
                    </ButtonSignIn>
                </ButtonArea>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Cadastro da cidade',
        headerTitleAlign: 'center',
        headerShown: true
    }
}

const mapStateToProps = (state) => {
    return {
        schedulesP1: state.registerReducer.schedulesP1,
        schedulesP2: state.registerReducer.schedulesP2,
    }
}

export default connect(mapStateToProps)(Screen);

// Local com conta existente?