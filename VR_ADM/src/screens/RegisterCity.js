import React, { useEffect, useState, useContext, useRef } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid, Keyboard, View } from 'react-native';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { normalize, insertImage } from '../functions';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage'
import ListOfCities from '../ListOfCities';
import firebase from '../../firebase';
import axios from 'axios';
import uuid from 'uuid/v4';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

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

const Item = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    align-items: center;
    padding-vertical: ${normalize(15)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
`

const ItemArea = styled.View`
    padding-horizontal: ${normalize(20)}px;
    padding-bottom: ${normalize(30)}px;
`
// padding-horizontal: ${normalize(50)}px;
// padding-horizontal: ${normalize(22.61)}px;

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
    margin-top: ${normalize(28)}px;
`
// margin-top: ${normalize(40)}px;
// margin-top: ${normalize(28.27)}px;

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '100%'};
`

const Title = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #000;
`

// const InputArea = styled.View`
//     margin-top: ${normalize(150)}px;
//     justify-content: center;
// `

const Input = styled.TextInput`
    margin-top: ${normalize(8)}px;
    padding-bottom: ${normalize(5)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
    font-size: ${normalize(16)}px;
`
// margin-top: ${normalize(150)}px
// margin-top: ${normalize(7.53)}px
// padding-bottom: ${normalize(230)}px;
// padding-bottom: ${normalize(5)}px;

const ButtonVisibility = styled.TouchableOpacity`
    height: ${normalize(40)}px;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    position: absolute;
`

const InputSelect = styled.View`
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
`

const ButtonArea = styled.View`
    justify-content: center;
    align-items: center;
    margin-top: ${normalize(38)}px;
`
// margin-top: ${normalize(30)}px;
// margin-top: ${normalize(37.69)}px;

const ButtonSignUp = styled.TouchableHighlight`
    width: 90%;
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    margin-bottom: ${normalize(75)}px;
    border-radius: ${normalize(3)}px;
`
// margin-bottom: ${normalize(15)}px;
// margin-bottom: ${normalize(75.39)}px;

const ButtonSignIn = styled.TouchableOpacity`
    height: ${normalize(38)}px;
    justify-content: center;
    align-items: center;
    margin: ${normalize(10)}px ${normalize(20)}px;
`

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
`

// const CaptionText = styled.Text`
//     font-size: ${normalize(72)}px;
//     color: ${props => props.color || '#999'};
// `

const Screen = (props) => {
    const [ token, setToken ] = useState('')
    const [ deviceId, setDeviceId ] = useState('')
    const [ prevCityId, setPrevCityId ] = useState('')
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
    const [ visibility1, setVisibility1 ] = useState(true)
    const [ visibility2, setVisibility2 ] = useState(true)
    const [ maxLenDDD1, setMaxLenDDD1 ] = useState(2)
    const [ maxLenDDD2, setMaxLenDDD2 ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)
    const [ count, setCount ] = useState(false)
    const [ listCities, setListCities ] = useState([])
    const [ listSelectCities, setListSelectCities ] = useState([])
    const [ selectedPay, setSelectedPay ] = useState([])
    const [ selectedDlv, setSelectedDlv ] = useState([])
    const [ selectedCity, setSelectedCity ] = useState({})
    const [ startMin, setStartMin ] = useState('')
    const [ finalMin, setFinalMin ] = useState('')
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const { 
        navigation, 
        schedulesP1, 
        schedulesP2, 
        bannerImg, 
        setSchedulesP1,
        setSchedulesP2,
        setBannerImg,
    } = props
    const params = navigation.state.params
    const nav = navigation.navigate
    const goBack = navigation.goBack
    const payMethods = ['Dinheiro', 'Cartão de crédito']
    const dlvMethods = ['Delivery', 'Retirada no balcão']

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
    const ref_input14 = useRef()
    const ref_input15 = useRef()
    const ref_input16 = useRef()
    const ref_input17 = useRef()

    const cities = firebase.database().ref('cities')

    useEffect(() => {
        // cities.on('value', snapshot => {
        //     let listCopy = []
        //     snapshot.forEach(childItem => {
        //         listCopy.push(childItem.val().selectedCity.index)
        //     })
        //     console.log('UseEffect')
        //     console.log(listCopy)
        //     setListSelectCities(listCopy)
        // })
    }, [])

    function onScreen() {
        // firebase.auth().signOut()
        setLoaderVisible(false)
    }

    useEffect(() => {
        // alert(`NORMALIZE 30: ${normalize(30)}`)
        // firebase.auth().signOut()
        // setLoaderVisible(false)
        AsyncStorage.getItem('notifToken')
            .then(t => {
                if (t) { setToken(t) }
            })

        AsyncStorage.getItem('deviceId')
            .then(id => {
                if (id) { setDeviceId(id) }
            })

        // AsyncStorage.setItem('cityId', '')
        // .catch(error => {
        //     toastMsg(`${error.code} - ${error.message}`)
        //     console.log(error)
        // })

        AsyncStorage.getItem('cityId')
            .then(id => {
                if (id) { setPrevCityId(id) }

                if (id) { 
                    console.log('-----------------ID DA CIDADE-----------------')
                    console.log(id)
                } else {
                    console.log('-----------------SEM ID DA CIDADE-----------------')
                }
            })

        console.log('-----------------PARAMS-----------------')
        console.log(params)
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

        onDlvFeeChange('')

        setSchedulesP1([])
        setSchedulesP2([])
        
        setBannerImg(null)
    }, [])

    // useEffect(() => {
    //     console.log('Dlv:')
    //     console.log(selectedDlv)
    // }, [selectedDlv])

    // useEffect(() => {
    //     console.log('Pay:')
    //     console.log(selectedPay)
    // }, [selectedPay])

    const onNumberChange = (text, setText) => {
        let cleaned = ('' + text).replace(/\D/g, '')
        // setNumber(cleaned)
        setText(cleaned)
    }

    function onDDDChange(text, setText) {
        let cleaned = ('' + text).replace(/\D/g, '')
        setText(cleaned)
    }

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

    function onPhoneChange(text, setText) {
        let cleaned = ('' + text).replace(/\D/g, '')

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

    function handleSetUser(cityId, bannerId) {
        try {
            let newDDD1 = ddd1.trim().length > 0 ? ddd1.replace(/\D/g, '') : null
            let newPhone1 = phone1.trim().length > 0 ? phone1.replace(/\D/g, '') : null

            let newDDD2 = ddd2.trim().length > 0 ? ddd2.replace(/\D/g, '') : null
            let newPhone2 = phone2.trim().length > 0 ? phone2.replace(/\D/g, '') : null

            let newDlvFee = deliveryFee.split('R$ ').join('').split('.').join('').replace(',', '.')

            const scheduledMin = {
                startMin,
                finalMin,
            }

            const banner = {
                id: bannerId,
                image: bannerImg,
            }

            // let selectedDlvSorted = selectedDlv.sort()
            // let filteredDlv = selectedDlvSorted.map(item => { return dlvMethods[item] })

            // let selectedPaySorted = selectedPay.sort()
            // let filteredPay = selectedPaySorted.map(item => { return payMethods[item] })

            cities.child(cityId).set({
                id: cityId,
                email,
                city,
                district,
                address,
                number,
                ddd1: newDDD1,
                phone1: newPhone1,
                ddd2: newDDD2,
                phone2: newPhone2,
                deliveryFee: newDlvFee,
                selectedCity,
                selectedDlv,
                selectedPay,
                scheduledMin,
                schedulesP1,
                schedulesP2,
                banner,
                open: false,
            }).then((resp) => {
                if (prevCityId.length) {
                    logOutDevice()
                } else {
                    addDevice()
                }
            }).catch((error) => {
                handleLoadEd()
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
            })

            function logOutDevice() {
                cities.child(prevCityId).child('devices').child(deviceId).child('logged').set(false)
                .then(() => {
                    addDevice()
                }).catch((error) => {
                    handleLoadEd()
                    toastMsg(`${error.code} - ${error.message}`)
                    console.log(error)
                })
            }

            function addDevice() {
                let newDevice = cities.child(cityId).child('devices').child(deviceId)
                
                newDevice.set({
                    token,
                    logged: true,
                })
                .then(() => {
                    setTimeout(() => {
                        // navTo()
                        saveCityId()
                    }, 2000)
                })
            }

            function saveCityId() {
                AsyncStorage.setItem('cityId', cityId)
                    .then(() => {
                        navTo()        
                    })
                    .catch(error => {
                        toastMsg(`${error.code} - ${error.message}`)
                        console.log(error)
                    })
            }

            function navTo() {
                if (params && params.enableKey) {
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        key: 'HomeDrawer',
                        actions: [
                            NavigationActions.navigate({routeName: 'HomeDrawer'})
                        ]
                    }))
                } else {
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        // key: 'HomeDrawer',
                        actions: [
                            NavigationActions.navigate({routeName: 'HomeDrawer'})
                        ]
                    }))
                }

                // toastMsg('Cidade cadastrada com sucesso!')
            }
        } catch(e) {
            handleLoadEd()
            toastMsg(`${e.code} - ${e.message}`)
            console.log(e)
        }
    }

    function handleSaveImg(cityId) {
        try {
            const id = uuid()

            insertImage(cityId, id, bannerImg, setLoaderVisible)
            handleSetUser(cityId, id)
        } catch(error) {
            handleLoadEd()
            console.log(error)
            toastMsg(`${error.code} - ${error.message}`)
        }
    }

    const f_Base = () => {
        firebase.auth().createUserWithEmailAndPassword(
            email, password
        ).then((resp) => {
            const user = firebase.auth().currentUser

            if (user) {
                const cityId = user.uid
                setCount(true)
                Keyboard.dismiss()
                
                handleSaveImg(cityId)
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
        function registeredCity(index) {
            return listSelectCities.includes(index)
        }

        // console.log('Cidade Registrada:')
        console.log(registeredCity(selectedCity.index))
        // console.log(selectedCity.index)

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
        } else if (registeredCity(selectedCity.index)) {
            toastMsg('Cidade já cadastrada, escolha outra.')
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
        } else if (startMin.length == 0 || finalMin.length == 0) {
            toastMsg('Defina um tempo estimado de entrega.')
        } else if (selectedPay.length == 0) {
            toastMsg('Selecione as formas de pagamento.')
            // handleLoadEd()
        } else if (!schedulesP1 || schedulesP1.length < 1) {
            toastMsg('Defina os horários de funcionamento.')
        } else if (!bannerImg) {
            toastMsg('Insira uma imagem para o banner.')
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



                // id,
                // email,
                // city,
                // district,
                // address,
                // number,
                // ddd1: newDDD1,
                // phone1: newPhone1,
                // ddd2: newDDD2,
                // phone2: newPhone2,
                // deliveryFee,
                // selectedCity,
                // selectedDlv,
                // selectedPay,
                // schedulesP1,
                // schedulesP2,
                // logged: true,
                // open: false,

                let newDDD1 = ddd1.trim().length > 0 ? ddd1.replace(/\D/g, '') : null
                let newPhone1 = phone1.trim().length > 0 ? phone1.replace(/\D/g, '') : null

                let newDDD2 = ddd2.trim().length > 0 ? ddd2.replace(/\D/g, '') : null
                let newPhone2 = phone2.trim().length > 0 ? phone2.replace(/\D/g, '') : null


                console.log(`city: ${city}`)
                console.log(`email: ${email}`)
                console.log(`district: ${district}`)
                console.log(`address: ${number}`)
                console.log(`ddd1: ${newDDD1}`)
                console.log(`phone1: ${newPhone1}`)
                console.log(`ddd2: ${newDDD2}`)
                console.log(`newPhone2: ${newPhone2}`)
                console.log(`deliveryFee: ${deliveryFee}`)
                console.log(`selectedCity: ${selectedCity}`)
                console.log(`selectedDlv: ${selectedDlv}`)
                console.log(`selectedPay: ${selectedPay}`)
                console.log(`schedulesP1: ${schedulesP1}`)
                console.log(`schedulesP2: ${schedulesP2}`)
            }
        }
    }

    function navToLogin() {
        const fromLogin = params && params.fromLogin ? true : false
        if (fromLogin) {
            goBack()
            console.log('Chamando GoBack')
        } else {
            nav('Login')
        }
        // navigation.dispatch(StackActions.reset({
        //     index: 0,
        //     // key: 'Login',
        //     actions: [
        //         NavigationActions.navigate({routeName: 'Login'})
        //     ]
        // }))
    }

    function onValueChange(value, index) {
        // console.log(listCities[value])
        // console.log(index)
        if (listCities[value] == undefined) {
            setSelectedCity({ value: null, index: 0 })
            setCity(null)    
        } else {
            setSelectedCity({ value, index })
            setCity(listCities[value].label)
        }
        console.log(index)
    }

    return (
        <Page>
            <NavigationEvents
                // onWillFocus={() => setLoaderVisible(false)}
                onWillFocus={onScreen}
            />
            <Scroll
                // contentContainerStyle={{ paddingHorizontal: normalize(50) }}
                contentContainerStyle={{ paddingBottom: normalize(80) }}
                keyboardShouldPersistTaps='handled'
            >

                <Section>
                    <SectionText>Endereço</SectionText>
                </Section>
                <ItemArea>
                    <Action
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
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
                            onSubmitEditing={() => ref_input3.current.focus()}
                            ref={ref_input2}
                            blurOnSubmit={false}
                            placeholderTextColor='#999'
                        />
                    </Action>

                    <DoubleAction
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
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
                                            // paddingBottom: normalize(230),
                                            paddingBottom: normalize(5),
                                            // marginTop: normalize(150),
                                            marginTop: normalize(8),
                                            // fontSize: normalize(72)
                                            fontSize: normalize(16)
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
                                onSubmitEditing={() => ref_input4.current.focus()}
                                ref={ref_input3}
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
                                onSubmitEditing={() => ref_input5.current.focus()}
                                ref={ref_input4}
                                blurOnSubmit={false}
                                placeholderTextColor='#999'
                            />
                        </Action>
                        <Action width='20%' >
                            <Title>Nº:</Title>
                            <Input
                                value={number}
                                onChangeText={text => onNumberChange(text, setNumber)}
                                keyboardType='numeric'
                                returnKeyType='next'
                                // editable={editable}
                                onSubmitEditing={() => ref_input6.current.focus()}
                                ref={ref_input5}
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
                        style={{ marginTop: normalize(28) }}
                    >
                        <Action width='20%' >
                            <Title>DDD:</Title>
                            <Input
                                value={ddd1}
                                // onChangeText={onDDD1Change}
                                onChangeText={text => onDDDChange(text, setDDD1)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD1}
                                returnKeyType='next'
                                // editable={editable}
                                onFocus={() => dddFocus(ddd1, setDDD1, maxLenDDD1, setMaxLenDDD1)}
                                onSubmitEditing={() => ref_input7.current.focus()}
                                ref={ref_input6}
                                blurOnSubmit={false}
                                onBlur={() => dddDefocus(ddd1, setDDD1, maxLenDDD1, setMaxLenDDD1)}
                                placeholderTextColor='#999'
                            />
                        </Action>
                        <Action width='72%' >
                            <Title>Telefone:</Title>
                            <Input
                                value={phone1}
                                // onChangeText={onPhone1Change}
                                onChangeText={text => onPhoneChange(text, setPhone1)}
                                placeholder='0000-0000'
                                keyboardType='phone-pad'
                                // maxLength={maxLenPhone}
                                maxLength={10}
                                returnKeyType='next'
                                // editable={editable}
                                // onFocus={phone1Focus}
                                onSubmitEditing={() => ref_input8.current.focus()}
                                ref={ref_input7}
                                blurOnSubmit={false}
                                // onBlur={phone1Defocus}
                                placeholderTextColor='#999'
                            />
                        </Action>
                    </DoubleAction>

                    <DoubleAction
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
                    >
                        <Action width='20%' >
                            <Title>DDD:</Title>
                            <Input
                                value={ddd2}
                                // onChangeText={onDDD2Change}
                                onChangeText={text => onDDDChange(text, setDDD2)}
                                placeholder='(00)'
                                keyboardType='phone-pad'
                                maxLength={maxLenDDD2}
                                returnKeyType='next'
                                // editable={editable}
                                onFocus={() => dddFocus(ddd2, setDDD2, maxLenDDD2, setMaxLenDDD2)}
                                onSubmitEditing={() => ref_input9.current.focus()}
                                ref={ref_input8}
                                blurOnSubmit={false}
                                onBlur={() => dddDefocus(ddd2, setDDD2, maxLenDDD2, setMaxLenDDD2)}
                                placeholderTextColor='#999'
                            />
                        </Action>
                        <Action width='72%' >
                            <Title>Telefone:</Title>
                            <Input
                                value={phone2}
                                // onChangeText={onPhone2Change}
                                onChangeText={text => onPhoneChange(text, setPhone2)}
                                placeholder='0000-0000'
                                keyboardType='phone-pad'
                                // maxLength={maxLenPhone}
                                maxLength={10}
                                returnKeyType='next'
                                // editable={editable}
                                // onFocus={phoneFocus}
                                onSubmitEditing={() => ref_input10.current.focus()}
                                ref={ref_input9}
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
                        style={{ marginTop: normalize(20) }}
                    >
                        <Title>Valor da taxa:</Title>
                        <Input
                            value={deliveryFee}
                            onChangeText={onDlvFeeChange}
                            // placeholder='R$ 0,00'
                            keyboardType='numeric'
                            maxLength={13}
                            returnKeyType='next'
                            onSubmitEditing={() => ref_input11.current.focus()}
                            ref={ref_input10}
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
                                style={{ borderBottomWidth: index == 0 ? .5 : 0 }}
                            >
                                <LeftItem>
                                    <BoxExtra selected={selectedDlv.includes(index) ? true : false} ></BoxExtra>
                                    <ItemText>{item}</ItemText>
                                </LeftItem>
                                <FontIcon name={index === 0 ? 'motorcycle' : 'store'} size={normalize(20)} color='#077a15' />
                            </Item>
                        ))}
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Tempo de espera para entrega</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0 }} >
                    <DoubleAction style={{ marginTop: 0, marginBottom: normalize(20), alignItems: 'flex-end' }} >
                        <Action width='30%'>
                            <Input
                                value={startMin}
                                // onChangeText={t => setStartMin(t)}
                                onChangeText={text => onNumberChange(text, setStartMin)}
                                style={{ textAlign: 'center' }}
                                placeholder='00'
                                keyboardType='numeric'
                                returnKeyType='next'
                                onSubmitEditing={() => ref_input12.current.focus()}
                                ref={ref_input11}
                                blurOnSubmit={false}
                            />
                        </Action>

                        <ItemText>a</ItemText>

                        <Action width='30%'>
                            <Input
                                value={finalMin}
                                // onChangeText={t => setFinalMin(t)}
                                onChangeText={text => onNumberChange(text, setFinalMin)}
                                style={{ textAlign: 'center' }}
                                placeholder='00'
                                keyboardType='numeric'
                                // ref={ref_input11}
                                returnKeyType='next'
                                onSubmitEditing={() => ref_input13.current.focus()}
                                ref={ref_input12}
                                blurOnSubmit={false}
                            />
                        </Action>

                        <ItemText>min</ItemText>
                    </DoubleAction>
                </ItemArea>

                <Section>
                    <SectionText>Formas de pagamento</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0, borderColor: '#999' }} >
                    <Action
                        // style={{ marginTop: normalize(50) }}
                        // style={{ marginTop: normalize(20) }}
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
                                <FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={normalize(20)} color='#077a15' />
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
                            activeOpacity={.7}
                            onPress={() => nav('CreateOpenHours')}
                            style={{ borderBottomWidth: 0, paddingVertical: normalize(20) }}
                        >
                            <LeftItem>
                                <ItemText>Horário { schedulesP1.length > 0 ? 'definido' : 'indefinido'}</ItemText>
                            </LeftItem>
                            <FontIcon name='clock' size={normalize(20)} color={schedulesP1.length > 0 ? '#077a15' : '#ccc'} style={{ right: normalize(10) }} />
                            <FontIcon name='chevron-right' size={normalize(15)} color='#999' />
                        </Item>
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Inserir banner</SectionText>
                </Section>
                <ItemArea style={{ paddingBottom: 0 }} >
                    <Action>
                        <Item
                            activeOpacity={.7}
                            onPress={() => nav('CreateBanners')}
                            style={{ borderBottomWidth: 0, paddingVertical: normalize(20) }}
                        >
                            <LeftItem>
                                <ItemText>Banner { bannerImg ? 'inserido' : 'não inserido'}</ItemText>
                            </LeftItem>
                            <FontIcon name='image' size={normalize(20)} color={bannerImg ? '#077a15' : '#ccc'} style={{ right: normalize(10) }} />
                            <FontIcon name='chevron-right' size={normalize(15)} color='#999' />
                        </Item>
                    </Action>
                </ItemArea>

                <Section>
                    <SectionText>Definir senha</SectionText>
                </Section>
                <ItemArea>
                    <Action
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
                    >
                        <Title>Digite uma senha:</Title>
                        <View>
                            <Input
                                value={password}
                                onChangeText={(t) => setPassword(t)}
                                autoCapitalize='none'
                                returnKeyType='next'
                                secureTextEntry={visibility1}
                                onSubmitEditing={() => ref_input14.current.focus()}
                                ref={ref_input13}
                                blurOnSubmit={false}
                            />
                            <ButtonVisibility
                                activeOpacity={1}
                                onPress={() => setVisibility1(!visibility1)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name={visibility1 ? 'visibility' : 'visibility-off'} size={normalize(20)} color='#000' />
                            </ButtonVisibility>
                        </View>
                    </Action>

                    <Action
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
                    >
                        <Title>Confirme a senha:</Title>
                        <View>
                            <Input
                                value={confirmPass}
                                onChangeText={(t) => setConfirmPass(t)}
                                autoCapitalize='none'
                                returnKeyType='done'
                                secureTextEntry={visibility2}
                                ref={ref_input14}
                            />
                            <ButtonVisibility
                                activeOpacity={1}
                                onPress={() => setVisibility2(!visibility2)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name={visibility2 ? 'visibility' : 'visibility-off'} size={normalize(20)} color='#000' />
                            </ButtonVisibility>
                        </View>
                    </Action>
                </ItemArea>

                <ButtonArea>
                    <ButtonSignUp 
                        onPress={handleSignUp} 
                        underlayColor='#e5921a'
                    >
                        <ButtonText>Cadastrar</ButtonText>
                    </ButtonSignUp>
                    {/* <ButtonSignIn
                        onPress={navToLogin}
                        activeOpacity={.7}
                        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    >
                        <CaptionText>Local com conta existente? <CaptionText color='#000' >Login</CaptionText></CaptionText>
                    </ButtonSignIn> */}
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
        bannerImg: state.registerReducer.bannerImg,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSchedulesP1: (schedulesP1) => dispatch({type: 'SET_SCHEDULESP1', payload: {schedulesP1}}),
        setSchedulesP2: (schedulesP2) => dispatch({type: 'SET_SCHEDULESP2', payload: {schedulesP2}}),
        setBannerImg: (bannerImg) => dispatch({type: 'SET_BANNER_IMG', payload: {bannerImg}}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);

// Local com conta existente?