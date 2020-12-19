import React, { useEffect, useState, useContext, useRef } from 'react';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { Dimensions, ToastAndroid, Keyboard } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage'
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import ListOfCities from '../ListOfCities';
import firebase from '../../firebase';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

// Components:
import LoadingPage from '../components/LoadingPage';
import ModalSignOut from '../components/ModalSignOut'
import ButtonNoConnection from '../components/ButtonNoConnection'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
    align-items: center;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    padding-horizontal: ${normalize(20)}px;
`
// padding-horizontal: ${normalize(50)}px;

const Section = styled.View`
    width: 100%;
    justify-content: center;
    background-color: rgba(0, 0, 0, .08);
    padding: ${normalize(15)}px;
`

const SectionText = styled.Text`
    font-size: ${normalize(17)}px;
    font-weight: bold;
    color: #000;
`

const ItemArea = styled.View`
    padding-horizontal: ${normalize(22.61)}px;
    padding-bottom: ${normalize(30)}px;
`
// padding-horizontal: ${normalize(50)}px;

const Item = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    align-items: center;
    padding-vertical: ${normalize(15)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
`
// width: ${width - 30}px;

const LeftItem = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`

const ItemText = styled.Text`
    font-size: ${normalize(16)}px;
    color: #555;
`

const BoxExtra = styled.View`
    height: ${normalize(20)}px;
    width: ${normalize(20)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ccc'};
    border: ${normalize(5)}px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${normalize(.5)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const DoubleAction = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${normalize(22.61)}px;
`
// margin-top: ${normalize(50)}px;

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '100%'};
`

const Title = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #000;
`
// font-size: ${normalize(63)}px;

const SubTitle = styled.Text`
    font-size: ${normalize(16)}px;
    color: #999;
`
// font-size: ${normalize(72)}px;

// const InputArea = styled.View`
//     margin-top: ${normalize(150)}px;
//     justify-content: center;
// `

const Input = styled.TextInput`
    margin-top: ${normalize(7.53)}px;
    padding-bottom: ${normalize(4.91)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
    font-size: ${normalize(16)}px;
`
// font-size: ${normalize(72)}px;
// margin-top: ${normalize(150)}px
// padding-bottom: ${normalize(230)}px;

const InputSelect = styled.View`
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
`

const MyPass = styled.View`
    height: ${normalize(50)}px;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
`

const SafeCircle = styled.View`
    height: ${normalize(10)}px;
    width: ${normalize(10)}px;
    background-color: #ccc;
    border-radius: ${normalize(5)}px;
    margin-horizontal: ${normalize(2)}px;
`

const ButtonChangePass = styled.TouchableOpacity`
    height: 100%;
    justify-content: center;
    align-items: center;
`

const ButtonSave = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(30)}px;
`
// height: ${normalize(24)}px;

const ButtonSignOut = styled.TouchableHighlight`
    height: ${normalize(41.12)}px;
    width: ${normalize(141.36)}px;
    justify-content: center;
    align-items: center;
    border: ${normalize(1)}px solid #077a15;
    border-radius: ${normalize(5)}px;
    margin-top: ${normalize(28.27)}px;
    margin-left: ${normalize(22.61)}px;
`
// height: ${normalize(27.5)}px;
// margin-bottom: ${normalize(40)}px;
// width: ${normalize(8)}px;
// margin-top: ${normalize(40)}px;
// margin-left: ${normalize(50)}px;

const ButtonText = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
    border-bottom-width: ${props => props.bdBottom || 0}px;
    border-color: #fe9601;
`
// font-size: ${props => props.size || normalize(63)}px;

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const Screen = (props) => {
    const [ deviceId, setDeviceId ] = useState('')
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
    const [ maxLenDDD1, setMaxLenDDD1 ] = useState(2)
    const [ maxLenDDD2, setMaxLenDDD2 ] = useState(2)
    const [ maxLenPhone1, setMaxLenPhone1 ] = useState(9)
    const [ maxLenPhone2, setMaxLenPhone2 ] = useState(9)
    const [ count, setCount ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ signOutVisible, setSignOutVisible ] = useState(false)
    const [ listCities, setListCities ] = useState([])
    const [ selectedPay, setSelectedPay ] = useState([])
    const [ selectedDlv, setSelectedDlv ] = useState([])
    const [ selectedCity, setSelectedCity ] = useState({})
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ startMin, setStartMin ] = useState('')
    const [ finalMin, setFinalMin ] = useState('')

    const ref_input2 = useRef()
    const ref_input3 = useRef()
    const ref_input4 = useRef()
    const ref_input5 = useRef()
    const ref_input6 = useRef()
    const ref_input7 = useRef()
    const ref_input8 = useRef()
    const ref_input9 = useRef()
    const ref_input10 = useRef()
    const ref_input11 = useRef()
    const ref_input12 = useRef()
    const ref_input13 = useRef()

    const { navigation } = props
    const nav = navigation.navigate
    const cities = firebase.database().ref('cities')
    const currentUser = firebase.auth().currentUser

    const payMethods = ['Dinheiro', 'Cartão de crédito']
    const dlvMethods = ['Delivery', 'Retirada no balcão']
    const qtd_circle = [1, 2, 3, 4]

    // useEffect(() => {
    //     alert(`Normalize 10: ${normalize(10)}`)
    // }, [])

    function dddFocus(text, setDDD, maxLenDDD, setMaxLenDDD) {
        maxLenDDD == 4 ? setMaxLenDDD(2) : null;
        let newDDD = text.replace(/\D/g, '');
        setDDD(newDDD);
    }

    function dddDefocus(text, setDDD, maxLenDDD, setMaxLenDDD) {
        maxLenDDD == 2 ? setMaxLenDDD(4) : null;

        if (text.length == 2) {
            let ajustedDDD = `(${text})`;
            setDDD(ajustedDDD);
        }
    }

    function onDDDChange(text, setText) {
        let cleaned = ('' + text).replace(/[^\d]/g, '');

        setText(cleaned);

        // let newText;

        // if (cleaned.length == 1) {
        //     newText = `(${cleaned}`;
        // } else if (cleaned.length > 1) {
        //     newText = `(${cleaned})`;
        // }

        // setText(newText)

        // maxLenDDD == 2 ? setMaxLenDDD(4) : null
        // if (ddd.length == 2) {
        //     ajustedDDD = `(${ddd})`
        //     setDDD(ajustedDDD)
        // }
    }

    function onPhoneChange(text, setText) {
        let cleaned = ('' + text).replace(/\D/g, '')

        // setMaxLenPhone(10)

        let part1;
        let part2;
        let newText;

        if (cleaned.length <= 4) {
            setText(cleaned)
        } else if (cleaned.length > 4 && cleaned.length <= 8) {
            part1 = cleaned.slice(0, 4);
            part2 = cleaned.slice(4, 8);

            newText = part1 + '-' + part2;
            setText(newText)
        } else if (cleaned.length === 9) {
            part1 = cleaned.slice(0, 5);
            part2 = cleaned.slice(5, 9);

            newText = part1 + '-' + part2;
            setText(newText)
        }



        // if (phone.length === 9) {
        //     part1 = phone.slice(0, 5)
        //     part2 = phone.slice(5, 9)
        //     ajustedPhone = `${part1}-${part2}`
        //     setPhone(ajustedPhone)
        // } else if (phone.length === 8) {
        //     part1 = phone.slice(0, 4)
        //     part2 = phone.slice(4, 8)
        //     ajustedPhone = `${part1}-${part2}`
        //     setPhone(ajustedPhone)
        // }
    }

    function onDlvFeeChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        setDeliveryFee(num_format)
    }

    // useEffect(() => {
        
    // }, [])

    function onScreen() {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getCityInformation()
            }
        })
    }

    function getCityInformation() {
        if (currentUser) {
            const cityId = currentUser.uid

            AsyncStorage.getItem('deviceId')
                .then(id => setDeviceId(id))
    
            cities.child(cityId).on('value', snapshot => {
                let newDDD1 = snapshot.val().ddd1 ? snapshot.val().ddd1 : ''
                let newPhone1 = snapshot.val().phone1 ? snapshot.val().phone1 : ''
    
                let newDDD2 = snapshot.val().ddd2 ? snapshot.val().ddd2 : ''
                let newPhone2 = snapshot.val().phone2 ? snapshot.val().phone2 : ''
    
                // let newDlvFee = 'R$ ' + snapshot.val().deliveryFee
    
                console.log(`selectedCity ${snapshot.val().selectedCity}`)
                console.log(snapshot.val().selectedCity)
    
                setTimeout(() => {
                    setEmail(snapshot.val().email)
                    // setCity(snapshot.val().city)
                    setCity(snapshot.val().city)
                    setSelectedCity(snapshot.val().selectedCity)
                    setDistrict(snapshot.val().district)
                    setAddress(snapshot.val().address)
                    setNumber(snapshot.val().number)
                    // setDDD1(newDDD1)
                    dddDefocus(newDDD1, setDDD1, maxLenDDD1, setMaxLenDDD1)
                    // setPhone1(newPhone1)
                    onPhoneChange(newPhone1, setPhone1)
                    // setDDD2(newDDD2)
                    dddDefocus(newDDD2, setDDD2, maxLenDDD2, setMaxLenDDD2)
                    // setPhone2(newPhone2)
                    onPhoneChange(newPhone2, setPhone2)
                    // setDeliveryFee(newDlvFee)
                    onDlvFeeChange(snapshot.val().deliveryFee)
                    setSelectedDlv(snapshot.val().selectedDlv)
                    setSelectedPay(snapshot.val().selectedPay)
                    setStartMin(snapshot.val().scheduledMin.startMin)
                    setFinalMin(snapshot.val().scheduledMin.finalMin)

                    endOfLoading()
                }, 1000)
            })
    
            let newListCities = []
    
            ListOfCities.map((item, index) => {
                newListCities.push({
                    label: item.nome,
                    value: index,
                })
            })
    
            setListCities(newListCities)
    
            const fetchData = async () => {
                let newListCities = []
    
                // secondOption()
    
                function secondOption() {
                    ListOfCities.map((item, index) => {
                        newListCities.push({
                            label: item.nome,
                            value: index,
                        })
                    })
                }
    
                // await axios(
                //     'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios'
                // )
                // .then(resp => {
                //     resp.data.map((item, index) => {
                //         newListCities.push({
                //             label: item.nome,
                //             value: index,
                //         })
                //     })
                // })
                // .catch(error => {
                //     console.log(error)
                //     secondOption()
                // })
    
                // setListCities(newListCities)
                // setTimeout(() => {
                // }, 1500)
            }
    
            fetchData()
        }
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
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

    // const onPhone1Change = (text) => {
    //     let cleaned = ('' + text).replace(/\D/g, '')
    //     setPhone1(cleaned)
    //     // if (cleaned.length == 9) ref_input9.current.focus()
    // }

    // const onPhone2Change = (text) => {
    //     let cleaned = ('' + text).replace(/\D/g, '')
    //     setPhone2(cleaned)
    //     // if (cleaned.length == 9) ref_input9.current.focus()
    // }

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
        if (currentUser) {
            const cityId = currentUser.uid
            let snapCopy;
    
            cities.child(cityId).on('value', snapshot => {
                snapCopy = JSON.parse(JSON.stringify(snapshot.val()))
            })
    
            let newDDD1 = ddd1.trim().length > 0 ? ddd1.replace(/\D/g, '') : null
            let newPhone1 = phone1.trim().length > 0 ? phone1.replace(/\D/g, '') : null
    
            let newDDD2 = ddd2.trim().length > 0 ? ddd2.replace(/\D/g, '') : null
            let newPhone2 = phone2.trim().length > 0 ? phone2.replace(/\D/g, '') : null
    
            let newDlvFee = deliveryFee.split('R$ ').join('').split('.').join('').replace(',', '.')
            // let newNum = Number(newDlvFee)

            const scheduledMinutes = {
                startMin,
                finalMin,
            }
    
            snapCopy.city = city
            snapCopy.district = district
            snapCopy.address = address
            snapCopy.number = number
            snapCopy.ddd1 = newDDD1
            snapCopy.phone1 = newPhone1
            snapCopy.ddd2 = newDDD2
            snapCopy.phone2 = newPhone2
            snapCopy.deliveryFee = newDlvFee
            snapCopy.selectedCity = selectedCity
            snapCopy.selectedDlv = selectedDlv
            snapCopy.selectedPay = selectedPay
            snapCopy.scheduledMin = scheduledMinutes
    
            console.log(snapCopy)
    
            cities.child(cityId).set(snapCopy)
            .then(() => {
                Keyboard.dismiss()
                setTimeout(() => {
                    handleLoadEd()
                    toastMsg('Dados salvos com sucesso!')
                }, 2000)
            })
            .catch(error => {
                handleLoadEd()
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
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
    }

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

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                toastMsg('Verifique sua conexão com a internet.')
            } else if (email.trim().length <= 0) {
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
            } else if (startMin.length == 0 || finalMin.length == 0) {
                toastMsg('Defina um tempo estimado de entrega.')
            } else if (selectedPay.length == 0) {
                toastMsg('Selecione as formas de pagamento.')
            } else {
                if (!count) {
                    setLoaderVisible(true)
                    saveData()
                }
    
                
                // let newDlvFee = deliveryFee.split('R$ ').join('').replace(',', '.')
                // let newFormat = newDlvFee.split('.').join('').replace(',', '.')
    
                
                // let newDlvFee = deliveryFee.split('R$ ').join('').split('.').join('').replace(',', '.')
                // console.log(newDlvFee)
                // let newNum = Number(newDlvFee)
                // console.log(newNum.toFixed(2))
    
            }
        })
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
        if (listCities[value] == undefined) {
            setSelectedCity({ value: null, index: 0 })
            setCity(null)
        } else {
            setSelectedCity({ value, index })
            setCity(listCities[value].label)
        }
        // console.log(listCities[value])
        console.log('VALUE:')
        console.log(value)
        console.log('INDEX:')
        console.log(index)
    }

    function goToScreen() {
        if (currentUser) {
            const cityId = currentUser.uid

            cities.child(cityId).child('devices').child(deviceId).child('logged').set(false)
            .then(() => {
                setTimeout(() => {
                    // firebase.auth().signOut()
                    navNow()
                }, 1500)
            })
            .catch(error => {
                setLoaderVisible(false)
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
            })
    
            function navNow() {
                navigation.dispatch(StackActions.reset({
                    index: 0,
                    key: 'Login',
                    actions: [
                        NavigationActions.navigate({routeName: 'Login'})
                    ]
                }))
            }
    
            // function navTo() {
            //     navigation.dispatch(StackActions.reset({
            //         index: 0,
            //         // key: 'SignIn',
            //         actions: [
            //             NavigationActions.navigate({routeName: 'SignIn'})
            //         ]
            //     }))
            // }
    
            // const p = new Promise((resolve, reject) => {
            //     if (navTo)
            //     resolve('Foi')
            //     reject('Não foi')
            // })
    
            // p.then((response) => {
            //     setTimeout(() => {
            //         setName('')
            //         setEmail('')
            //         setCity('')
            //         setDistrict('')
            //         setAddress('')
            //         setNumber('')
            //         setDDD('')
            //         setPhone('')
            //     }, 2000)
            // }).catch(error => {
            //     console.log(error)
            // })
        }
    }

    let num = 3.2

    if (loading) {
        return (
            <>
                <NavigationEvents onWillFocus={onScreen} />
                <LoadingPage />
            </>
        );
    } else if (noConnection) {
        return (
            <Page style={{ justifyContent: 'center' }} >
                <NavigationEvents onWillFocus={onScreen} />
                
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={onScreen} />
            </Page>
        );
    }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={onScreen}
            />
            <Scroll
                // contentContainerStyle={{  paddingTop: normalize(50), paddingBottom: normalize(10) }}
                contentContainerStyle={{  paddingTop: normalize(22.61), paddingBottom: normalize(80) }}
                // paddingHorizontal: normalize(50),
                keyboardShouldPersistTaps='handled'
            >
                <Header>
                    {/* <Title style={{ marginBottom: 10, marginTop: 0 }} >Informações de cadastro</Title>    */}
                    <Title style={{ marginBottom: normalize(10), marginTop: 0 }} >Informações de cadastro</Title>
                    <SubTitle>E-mail cadastrado</SubTitle>
                    <SubTitle>{email}</SubTitle>
                </Header>

                {/* <Section style={{ marginTop: normalize(40) }} > */}
                <Section style={{ marginTop: normalize(28.27) }} >
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
                                            // paddingBottom: normalize(230),
                                            paddingBottom: normalize(4.91),
                                            // marginTop: normalize(150),
                                            marginTop: normalize(7.53),
                                            // fontSize: normalize(72),
                                            fontSize: normalize(16),
                                            color: '#000'
                                        },
                                        // placeholder: {
                                        //     color: selectedCity.value ? '#000' : '#999'
                                        // }
                                    }}
                                    value={selectedCity.value}
                                    key={selectedCity.value}
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
                                onSubmitEditing={() => ref_input3.current.focus()}
                                ref={ref_input2}
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
                                onSubmitEditing={() => ref_input4.current.focus()}
                                ref={ref_input3}
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
                                onSubmitEditing={() => ref_input5.current.focus()}
                                ref={ref_input4}
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
                                // onChangeText={(t) => onDDD1Change(t)}
                                onChangeText={(t) => onDDDChange(t, setDDD1)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD1}
                                returnKeyType='next'
                                // editable={editable}
                                onFocus={() => dddFocus(ddd1, setDDD1, maxLenDDD1, setMaxLenDDD1)}
                                onSubmitEditing={() => ref_input6.current.focus()}
                                ref={ref_input5}
                                blurOnSubmit={false}
                                onBlur={() => dddDefocus(ddd1, setDDD1, maxLenDDD1, setMaxLenDDD1)}
                                placeholderTextColor='#999'
                            />
                        </Action>
                        <Action width='72%' >
                            <Title>Telefone:</Title>
                            <Input
                                value={phone1}
                                // onChangeText={(t) => onPhone1Change(t)}
                                onChangeText={(t) => onPhoneChange(t, setPhone1)}
                                placeholder='00000-0000'
                                keyboardType='phone-pad'
                                maxLength={10}
                                returnKeyType='next'
                                // editable={editable}
                                onSubmitEditing={() => ref_input7.current.focus()}
                                ref={ref_input6}
                                blurOnSubmit={false}
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
                                // onChangeText={(t) => onDDD2Change(t)}
                                onChangeText={(t) => onDDDChange(t, setDDD2)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD2}
                                returnKeyType='next'
                                onFocus={() => dddFocus(ddd2, setDDD2, maxLenDDD2, setMaxLenDDD2)}
                                // editable={editable}
                                onSubmitEditing={() => ref_input8.current.focus()}
                                ref={ref_input7}
                                blurOnSubmit={false}
                                onBlur={() => dddDefocus(ddd2, setDDD2, maxLenDDD2, setMaxLenDDD2)}
                                placeholderTextColor='#999'
                            />
                        </Action>
                        <Action width='72%' >
                            <Title>Telefone:</Title>
                            <Input
                                value={phone2}
                                // onChangeText={(t) => onPhone2Change(t)}
                                onChangeText={(t) => onPhoneChange(t, setPhone2)}
                                placeholder='00000-0000'
                                keyboardType='phone-pad'
                                maxLength={10}
                                returnKeyType='next'
                                // editable={editable}
                                onSubmitEditing={() => ref_input9.current.focus()}
                                ref={ref_input8}
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
                        // style={{ marginTop: normalize(50) }}
                        style={{ marginTop: normalize(22.61) }}
                    >
                        <Title>Valor da taxa:</Title>
                        <Input
                            value={deliveryFee}
                            onChangeText={(t) => onDlvFeeChange(t)}
                            // placeholder='R$ 0,00'
                            maxLength={13}
                            keyboardType='numeric'
                            returnKeyType='next'
                            onSubmitEditing={() => ref_input10.current.focus()}
                            ref={ref_input9}
                            blurOnSubmit={false}
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
                                style={{ borderBottomWidth: index == 0 ? normalize(.5) : 0 }}
                            >
                                <LeftItem>
                                    <BoxExtra selected={selectedDlv.includes(index) ? true : false} ></BoxExtra>
                                    <ItemText>{item}</ItemText>
                                </LeftItem>
                                {/* <FontIcon name={index === 0 ? 'motorcycle' : 'store'} size={20} color='#077a15' /> */}
                                <FontIcon name={index === 0 ? 'motorcycle' : 'store'} size={normalize(20)} color='#077a15' />
                            </Item>
                        ))}
                    </Action>
                </ItemArea>
                
                <Section>
                    <SectionText>Tempo de espera para entrega</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0 }} >
                    {/* <DoubleAction style={{ marginTop: 0, marginBottom: 20, alignItems: 'flex-end' }} > */}
                    <DoubleAction style={{ marginTop: 0, marginBottom: normalize(20), alignItems: 'flex-end' }} >
                        <Action width='30%'>
                            <Input
                                value={startMin}
                                onChangeText={t => setStartMin(t)}
                                style={{ textAlign: 'center' }}
                                placeholder='00'
                                keyboardType='numeric'
                                returnKeyType='next'
                                onSubmitEditing={() => ref_input11.current.focus()}
                                ref={ref_input10}
                                blurOnSubmit={false}
                            />
                        </Action>

                        <ItemText>a</ItemText>

                        <Action width='30%'>
                            <Input
                                value={finalMin}
                                onChangeText={t => setFinalMin(t)}
                                style={{ textAlign: 'center' }}
                                placeholder='00'
                                keyboardType='numeric'
                                returnKeyType='done'
                                ref={ref_input11}
                            />
                        </Action>

                        <ItemText>min</ItemText>
                    </DoubleAction>
                </ItemArea>

                <Section>
                    <SectionText>Formas de pagamento</SectionText>
                </Section>
                {/* <ItemArea style={{ paddingBottom: 0, marginBottom: 30, borderBottomWidth: .5 , borderColor: '#999' }} > */}
                <ItemArea style={{ paddingBottom: 0, marginBottom: normalize(30), borderBottomWidth: normalize(.5), borderColor: '#999' }} >
                    <Action
                        // style={{ marginTop: normalize(50) }}
                    >
                        {payMethods.map((item, index) => (
                            <Item
                                key={index}
                                onPress={() => handleSelectedPay(index)}
                                activeOpacity={.7}
                                style={{ borderBottomWidth: index == 1 ? 0 : normalize(.5) }}
                            >
                                <LeftItem>
                                    <BoxExtra selected={selectedPay.includes(index) ? true : false} ></BoxExtra>
                                    <ItemText>{item}</ItemText>
                                </LeftItem>
                                {/* {<FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={20} color='#077a15' />} */}
                                {<FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={normalize(20)} color='#077a15' />}
                            </Item>
                        ))}
                    </Action>
                </ItemArea>

                <ItemArea>
                    <Action
                        style={{ marginTop: normalize(20) }}
                    >
                        <Title>Minha senha</Title>
                        <MyPass>
                            <LeftItem>
                                {/* <Icon name='lock' size={20} color='#ccc' /> */}
                                <Icon name='lock' size={normalize(20)} color='#ccc' />
                                {qtd_circle.map((item, index) => (
                                    <SafeCircle key={index}></SafeCircle>
                                ))}
                            </LeftItem>
                            <ButtonChangePass
                                onPress={() => nav('ChangePass')}
                                activeOpacity={1}
                                hitSlop={{ left: 30 }}
                            >
                                {/* <ButtonText size={normalize(72)} color='#fe9601' bdBottom={.6} >Mudar senha</ButtonText> */}
                                <ButtonText size={normalize(16)} color='#fe9601' bdBottom={normalize(.6)} >Mudar senha</ButtonText>
                            </ButtonChangePass>
                        </MyPass>
                    </Action>
                </ItemArea>

                <ButtonSave 
                    style={{ alignSelf: 'center' }} 
                    onPress={handleSave}
                    underlayColor='#e5921a'
                >
                    <ButtonText>Salvar</ButtonText>
                </ButtonSave>

                {/* <Title style={{ marginTop: 0, marginHorizontal: normalize(50) }} >Se deseja sair do seu perfil, clique no botão abaixo.</Title> */}
                <Title style={{ marginTop: 0, marginHorizontal: normalize(22.61) }} >Se deseja sair do seu perfil, clique no botão abaixo.</Title>
                <ButtonSignOut
                    onPress={() => setSignOutVisible(true)}
                    underlayColor='#eee'
                >
                    {/* <ButtonText size={normalize(72)} color='#077a15' >SAIR DA CONTA</ButtonText> */}
                    <ButtonText size={normalize(16)} color='#077a15' >SAIR DA CONTA</ButtonText>
                </ButtonSignOut>

                <ModalSignOut
                    modalVisible={signOutVisible}
                    setModalVisible={setSignOutVisible}
                    goToScreen={goToScreen}
                />
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
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         <Icon name='menu' size={25} color='#fff' />
        //     </ButtonIcon>
        // )
        headerLeft: () => (
            <RectButton
                onPress={() => navigation.openDrawer()}
                style={{ 
                    padding: normalize(8), 
                    marginHorizontal: normalize(10), 
                    borderRadius: normalize(50),
                }}
                hitSlop={{ right: 30, left: 30 }}
            >
                <Icon name='menu' size={normalize(25)} color='#fff' />
            </RectButton>
        ),

        headerTitleContainerStyle: {
            width: '63%',
            position: 'relative',
            justifyContent: 'center',
        },

        headerTitleAlign: 'center',
    }
}

export default Screen;