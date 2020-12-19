import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid, BackHandler } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { getHistory, normalize } from '../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../firebase';
import uuid from 'uuid/v4';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { NOTIF_TOKEN } from '@env';

// Components:
import ModalOptions from '../components/Resume/ModalOptions';
import ModalChangeFor from '../components/Resume/ModalChangeFor';
import Header from '../components/Header';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';
import CallHistoryContext from '../contexts/CallHistoryContext';

const { width } = Dimensions.get('window');

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`;

// const Header = styled.View`
//     width: 100%;
//     height: ${normalize(56.5)}px;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     background-color: #077a15;   
// `

const Title = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: 700;
    color: #fff;
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
    font-size: ${normalize(16)}px;
    font-weight: bold;
    color: #000;
`

const Item = styled.TouchableOpacity`
    width: ${width - normalize(30)}px;
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    padding-vertical: ${normalize(15)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999
`
// padding: 15px 15px;

const LeftItem = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`

const RightItem = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
`

const ItemText = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    text-align: ${props => props.txtAlign || 'left'};
    color: ${props => props.color || '#555'};
`

const BoxExtra = styled.View`
    height: ${normalize(20)}px;
    width: ${normalize(20)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
    border: ${normalize(5)}px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${props => props.radius || normalize(12)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const AreaInfo = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${normalize(10)}px ${normalize(15)}px;
`

const TextInfo = styled.Text`
    font-size: ${normalize(18)}px;
    text-align: ${props => props.txtAlign || 'left'};
`

const Footer = styled.View`
    height: ${normalize(90)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-top-width: ${normalize(.5)}px;
    border-color: #999;
`
// height: ${normalize(80)}px;

const ButtonFinish = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    elevation: 2;
`

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    color: #fff;
    text-align: center;
`
// font-weight: bold

const Resume = (props) => {
    const [ deviceToken, setDeviceToken ] = useState('')
    const [ deviceId, setDeviceId ] = useState('')
    const [ userId, setUserId ] = useState('')
    const [ name, setName ] = useState('')
    const [ surname, setSurname ] = useState('')
    const [ city, setCity ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ landmark, setLandmark ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ citiesTokenList, setCitiesTokenList ] = useState([])
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ changeVisible, setChangeVisible ] = useState(false)
    const [ optionSelect, setOptionSelect ] = useState('Entrega padrão')
    // const [ options, setOptions ] = useState(['Retirada no local', 'Entrega padrão'])
    const [ payMethods, setPayMethods ] = useState([])
    const [ dlvOptions, setDlvOptions ] = useState([])
    const [ activePay, setActivePay ] = useState(null)
    const [ changeFor, setChangeFor ] = useState('')
    const [ noChange, setNoChange ] = useState(false)
    const [ disabled, setDisabled ] = useState(false)
    const [ dlvFee, setDlvFee ] = useState(props.dlvFee)
    const [ totalOrder, setTotalOrder ] = useState(0)
    const [ code, setCode ] = useState('')
    const [ addressCity, setAddressCity ] = useState({})
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext)

    const {
        navigation, list_address, 
        total,
        // total, dlvFee, 
        selected, cityId, 
        list_request, setListRequest,
        current_requests, setCurrentRequests,
        order_history, setOrderHistory,
    } = props
    const nav = navigation.navigate
    const goBack = navigation.goBack

    const cities = firebase.database().ref('cities')
    const requests = firebase.database().ref('requests')
    const users = firebase.database().ref('users')

    const options = ['Retirar no local', 'Entrega padrão']
    const formPay = ['Dinheiro', 'Trazer maquininha']

    let change_num = isNaN(changeFor.split('R$ ').join('')) ? 0 : Number(changeFor.split('R$ ').join(''))
    // let dlv_fee = 2
    // let total_order = total + dlv_fee

    function onBack() {
        if (modalVisible) {
            setModalVisible(false)
            return true
        }
        return false
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [modalVisible])

    useEffect(() => {
        AsyncStorage.getItem('deviceId')
            .then(id => {
                if (id) {
                    setDeviceId(id)
                }
            })

        AsyncStorage.getItem('notifToken')
            .then(token => {
                if (token) {
                    setDeviceToken(token)
                }
            })
    }, [])

    useEffect(() => {
        let total_order = Number(total) + Number(dlvFee)
        setTotalOrder(total_order.toFixed(2))
        // setTotalOrder(total_order)

        // AsyncStorage.getItem('deliveryFee')
        //     .then(dF => {
        //         setDlvFee(dF)
        //         let total_order = total + Number(dF)
        //         setTotalOrder(total_order.toFixed(2))
        //     })


        console.log('-----------RESUME - TOTAL-----------')
        // console.log(Number(total))


        // cities.child(cityId).on('value', snapshot => {
        //     // setDlvFee(snapshot.val().deliveryFee)
        //     let total_order = total + Number(snapshot.val().deliveryFee)
        //     // setTotalOrder(Number.isInteger(total_order) ? total_order.toFixed(2) : total_order)
        //     setTotalOrder(total_order.toFixed(2))
        //     // let newTotal = Number.isInteger(total_order) ? total_order.toFixed(2) : total_order
        //     // console.log(Number.isInteger(total_order) ? total_order.toFixed(2) : total_order)
        //     // alert(Number.isInteger(newTotal))
        // })
    }, [dlvFee])

    useEffect(() => {
        cities.child(cityId).child('devices').on('value', snapshot => {
            let newCitiesTokenList = []
            snapshot.forEach(childItem => {
                // console.log(childItem.val())
                if (childItem.val().logged) {
                    newCitiesTokenList.push(childItem.val().token)
                }
            })
            setCitiesTokenList(newCitiesTokenList)

            console.log('-------------TODOS OS TOKENS DESTA CIDADE-------------')
            console.log(newCitiesTokenList)
        })
    }, [])

    // useEffect(() => {
    //     setOptionSelect('Retirada no local')
    // }, [])

    function valueSelOption() {
        // return new Promise((resolve, reject) => {
            let selectedDlvCopy = []

            cities.child(cityId).on('value', snapshot => {
                snapshot.val().selectedDlv.sort().map(item => {
                    selectedDlvCopy.push(item)
                })
            })

            if (selectedDlvCopy.includes(1)) {
                setOptionSelect(options[1])
            } else {
                setOptionSelect(options[0])
            }
            // resolve(selectedDlvCopy)
            return selectedDlvCopy
            // console.log(selectedDlvCopy)
        // })
    }

    useEffect(() => {
        valueSelOption()
    }, [])

    useEffect(() => {
        // console.log(selected)
        
        console.log('-----------SELECTED_DLV-----------')
        // let condOptions = valueSelOption().includes(1)
        // console.log(condOptions)

        if (optionSelect == options[1]) {
        // if (condOptions || optionSelect == options[1]) {
            setDisabled(false)
            setDlvFee(props.dlvFee)

            list_address.map(item => {
                if (item.id == selected) {
                    setUserId(item.id)
                    setName(item.name)
                    setSurname(item.surname)
                    setCity(item.city)
                    setDistrict(item.district)
                    setStreet(item.street)
                    setNumber(item.number)
                    setLandmark(item.landmark ? item.landmark : '')
                    setDDD(item.ddd)
                    setPhone(item.phone)
                }
            })
        } else {
            setDisabled(true)
            setDlvFee('0.00')

            list_address.map(item => {
                if (item.id == selected) {
                    setUserId(item.id)
                    setName(item.name)
                    setSurname(item.surname)
                    setDDD(item.ddd)
                    setPhone(item.phone)
                }
            })

            cities.child(cityId).on('value', snapshot => {
                // setCity(snapshot.val().city)
                // setDistrict(snapshot.val().district)
                // setStreet(snapshot.val().address)
                // setNumber(snapshot.val().number)

                setAddressCity({
                    city: snapshot.val().city,
                    district: snapshot.val().district,
                    street: snapshot.val().address,
                    number: snapshot.val().number,
                })
            })
        }
    }, [selected, list_address, optionSelect])

    useEffect(() => {
        console.log('------------DLV_FEE------------')
        console.log(dlvFee)
    }, [dlvFee])

    useEffect(() => {
        if (activePay == 0) {
            setChangeVisible(true)
        }
    }, [activePay])

    useEffect(() => {
        let newPayMethods = []

        cities.child(cityId).on('value', snapshot => {
            snapshot.val().selectedPay.sort().map(item => {
                newPayMethods.push(formPay[item])
            })
        })

        let seen = {}
        let newListNotDup = newPayMethods.filter(function(entry) {
            let previous;
            if (seen.hasOwnProperty(entry)) {

                previous = seen[entry]
                
                return false
            }

            seen[entry] = entry

            return true
        })

        setPayMethods(newListNotDup)
    }, [])

    useEffect(() => {
        let newDlvOptions = []
        
        cities.child(cityId).on('value', snapshot => {
            snapshot.val().selectedDlv.map(item => {
                newDlvOptions.push(options[item])
            })
        })

        let seen = {}
        let newListNotDup = newDlvOptions.filter(function(entry) {
            let previous;
            if (seen.hasOwnProperty(entry)) {

                previous = seen[entry]
                
                return false
            }

            seen[entry] = entry

            return true
        })

        setDlvOptions(newListNotDup)
    }, [])

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180),
        )
    }

    function remSpecChar(text) {
        return ('' + text).replace(/\D/g, '')
    }

    function convToFloat(text) {
        return text.split('R$ ').join('').split('.').join('').replace(',', '.')
    }

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()

        // console.log('----------ONPRICE_CHANGE----------')
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            // console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            // console.log(intCleaned)
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

        return num_format
    }

    // useEffect(() => {
    //     if (!modalVisible) {
    //         setActivePay(1)
    //     }
    //     console.log(modalVisible)
    // }, [modalVisible])

    function sendNotification() {
        let order_list = []
        current_requests.map(item => {
            order_list.push(`${item.amount} ${item.name}`)
        })

        axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': NOTIF_TOKEN
            },
            data: {
                // 'to': `${token2}`,
                'registration_ids': citiesTokenList,
                'notification': {
                    'title': `${name}  -  ${options.indexOf(optionSelect) == 0 ? 'Retirada' : 'Entrega'}`,
                    'body': order_list.join(', '),
                    'vibrate': 1,
                    'priority': 'high',
                    'content_available': true,
                    'color': '#fe9601',
                    // 'icon': require('../assets/images/logo.png')
                    // 'obj': 'Olá'
                },
                // 'data': {
                //     'custom_notification': {
                //         'body': 'test body',
                //         'title': 'test title',
                //         'color': '#00ACD4',
                //         'priority': 'high',
                //         'sound': 'default',
                //         'show_in_foreground': true,
                //     }
                // }
            }
        }).then(response => {
            console.log('Menssagem enviada!', response)
            // alert('Menssagem enviada!')
            // console.log('--------------LIST_REQUEST--------------')
            // list_request.map(item => {
            //     item.data.map(childItem => {
            //         console.log(childItem)
            //     })
            // })
            // console.log(order_list.join(', '))
        }).catch(error => {
            console.log('Error: ', error)
            // alert('Error: ', error.toString())
        })
    }

    function navToScreen() {
        navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'ThankYou'})
            ]
        }))
    }

    function clearReqLocal() {
        let newListRequest = JSON.parse(JSON.stringify(list_request))
        let newCurrentRequests = JSON.parse(JSON.stringify(current_requests))
        let len_curr_req = newCurrentRequests.length
        let pop = navigation.pop
        let popToTop = navigation.popToTop

        newListRequest.map((item, index) => {
            if (item.id == cityId) {
                let len_data = item.data.length
                newListRequest[index].data.splice(0, len_data)
            }
        })

        newCurrentRequests.splice(0, len_curr_req)

        setListRequest(newListRequest)
        setCurrentRequests(newCurrentRequests)

        console.log('--------------CURRENT_REQUESTS--------------')
        console.log(newCurrentRequests)

        sendNotification()

        setTimeout(() => {
            setLoaderVisible(false)
            // toastMsg('Pedido enviado com sucesso!')
            // pop(2)
            // popToTop()
            // navToScreen()
            nav('ThankYou')
        }, 2000)
    }

    // function checkRepeatedOrderNumber() {
    //     const requests = firebase.database().ref('requests')
    //     // console.log('-----------CHECAGEM DE NÚMEROS REPETIDOS-----------')
    //     requests.child(cityId).on('value', snapshot => {
    //         // let newList = []
    //         snapshot.forEach(childItem => {
    //             let propertyValues = Object.values(childItem.val())
    //             return propertyValues
    //             // propertyValues.map(item => {
    //             //     console.log(item)
    //             // })
    //         })
    //         // console.log(newList)
    //     })
    // }

    function checkRepeatedOrderNumber() {
        const requests = firebase.database().ref('requests')
        return new Promise((resolve, reject) => {
            requests.child(cityId).on('value', snapshot => {
                if (snapshot.val()) {
                    snapshot.forEach(childItem => {
                        let propertyValues = Object.values(childItem.val())
                        resolve(propertyValues)
                    })
                } else {
                    resolve(null)
                }
            })
        })
    }

    function postReq(code_req) {
        let condDlvType = options.indexOf(optionSelect) == 0 ? 'Retirada' : 'Entrega'
        let condChangeFor = activePay == 0 ? convToFloat(changeFor) : null
        // DATE:
        let cur_day = new Date().getDate()
        let cur_month = new Date().getMonth() + 1
        let cur_year = new Date().getFullYear()
        // TIME:
        let cur_hour = new Date().getHours()
        let cur_minute = new Date().getMinutes()

        cur_day = cur_day.toString().length < 2 ? '0' + cur_day : cur_day
        cur_month = cur_month.toString().length < 2 ? '0' + cur_month : cur_month

        cur_hour = cur_hour.toString().length < 2 ? '0' + cur_hour : cur_hour
        cur_minute = cur_minute.toString().length < 2 ? '0' + cur_minute : cur_minute

        let cur_date = `${cur_day}/${cur_month}/${cur_year}`
        let cur_time = `${cur_hour}:${cur_minute} ${cur_hour < 12 ? 'AM' : 'PM'}`

        let address;

        if (optionSelect == options[1]) {
            address = {
                city,
                district,
                street,
                number,
                landmark,
            }
        } else {
            address = {
                city: addressCity.city,
                district: addressCity.district,
                street: addressCity.street,
                number: addressCity.number
            }
        }

        let full_name = `${name} ${surname}`

        let requests_data = {
            // dlvType: optionSelect,
            // dlv_fee,
            // total_order,
            // subTotal: total.toFixed(2),
            id: uuid(),
            request_number: code_req,
            request: current_requests,
            unformattedDate: new Date().toISOString(),
            date: cur_date,
            time: cur_time,
            dlvType: condDlvType,
            dlvTypePos: options.indexOf(optionSelect),
            full_name: full_name,
            address: address,
            formPay: formPay[activePay],
            formPayPos: activePay,
            // formPay: payMethods[activePay],
            changeFor: condChangeFor,
            dlvFee: dlvFee,
            subTotal: total,
            totalOrder: totalOrder,
            count: 1,
            count_admin: 1,
            count_user: 0,
            response: 0,
            disabled: false,
            remove_enabled: false,
        }

        function saveReqLocal() {
            let orderHistoryCopy;

            if (order_history && order_history !== undefined) {
                orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
            } else {
                orderHistoryCopy = []
            }

            let posId = orderHistoryCopy.findIndex(filItem => {
                return filItem.id == cityId
            })

            if (posId >= 0) {
                // let before_data = JSON.parse(JSON.stringify(orderHistoryCopy[posId].data))
                // let new_data = before_data.push(requests_data)

                orderHistoryCopy[posId].data.push(requests_data)
                orderHistoryCopy[posId].id = cityId

                // orderHistoryCopy[posId] = {
                //     id: cityId,
                //     // data: requests_data,
                //     data: new_data,
                // }
            } else {
                orderHistoryCopy.push({
                    id: cityId,
                    data: [requests_data],
                })
            }
            console.log('------------HISTORY SENDO CHAMADO EM RESUME------------')
            // setOrderHistory(orderHistoryCopy)
            getHistory(cityId, orderHistoryCopy, setOrderHistory)
        }

        // let condAddress = options.indexOf(optionSelect) == 0 ? null : address

        // requests.child(userId).child(id).set({
        requests.child(cityId).child(deviceId).push(requests_data).then(() => {
            clearReqLocal()
            saveReqLocal()
            // setTimeout(() => {
            //     setLoaderVisible(false)
            // }, 2000)

        }).catch(error => {
            setLoaderVisible(false)
            toastMsg(`${error.code} - ${error.message}`)
            console.log(error)
        })
    }

    async function postUser() {
        setLoaderVisible(true)

        // COMENTÁRIO TEMPORÁRIO:


            // let id = userId
           
            function saveUser(code_req, count, orderQtt) {

                
                // list_address




                // users.child(id).set({
                users.child(cityId).child(deviceId).set({
                    id: deviceId,
                    token: deviceToken,
                    name,
                    surname,
                    city,
                    district,
                    street,
                    number,
                    landmark,
                    ddd,
                    phone,
                    count,
                    orderQtt,
                }).then(() => {
                    postReq(code_req)
                }).catch(error => {
                    setLoaderVisible(false)
                    toastMsg(error)
                    console.log(error)
                })
            }

        //

        // setLoaderVisible(false)
        
        // console.log('--------------LIST_REQUEST--------------')
        // let cur_hour = new Date().getHours()
        // let cur_minute = new Date().getMinutes()

        // cur_hour = cur_hour.toString().length < 2 ? '0' + cur_hour : cur_hour
        // cur_minute = cur_minute.toString().length < 2 ? '0' + cur_minute : cur_minute

        // // let cur_date = jhb
        // console.log(cur_hour)
        // console.log(cur_minute)

        






        // alert(citiesTokenList.toString())





        // function checkQuantityOfOrderPlaced() {
        //     return new Promise((resolve, reject) => {
        //         users.child(cityId).child(deviceId).on('value', snapshot => {
        //             if (snapshot.val()) {
        //                 let orderQtt = snapshot.val().orderQtt
        //                 resolve(orderQtt)
        //             } else {
        //                 resolve(null)
        //             }
        //         })
        //     })
        // }

        // let orderQtt = 0;
        // let orderQtt;
        // let count = 0;
        let newOrderQtt = 0;
        let condCount = 0;
        

        users.child(cityId).child(deviceId).on('value', snapshot => {
            if (snapshot.val()) {
                let orderQtt = snapshot.val().orderQtt
                let count = snapshot.val().count

                newOrderQtt = Number(orderQtt) + 1;
                // condCount = orderQtt > 1 ? count : 1;
                condCount = orderQtt >= 1 ? count : 1;
            } else {
                newOrderQtt = 1;
                condCount = 1;
            }
        })

        
        // let condOrderQtt = checkQuantityOfOrderPlaced() ? Number(checkQuantityOfOrderPlaced()) + 1 : 0
        // let condCount = checkQuantityOfOrderPlaced() && checkQuantityOfOrderPlaced() > 1 ? 0 : 1


        // Aqui:
        // let newOrderQtt = orderQtt ? Number(orderQtt) + 1 : 0
        // let condCount = orderQtt > 1 ? count : 1
        // ---



        // setLoaderVisible(false)
        // seqNumLetter()
        // findUndef()

        // console.log('---------------SEQUÊNCIA DE NÚMEROS:---------------')
        // // console.log(seqNum().sort())
        // // console.log('---------------SEQUÊNCIA DE LETRAS:---------------')
        // // console.log(seqLetter().sort())

        let req_num = () => seqNum().sort().map((item, index) => {
            return item + seqLetter().sort()[index]
        })

        // let part1 = newArr.join('').slice(0, 3)
        // let part2 = newArr.join('').slice(3, 6)

        // // console.log('#' + newArr.join(''))
        // console.log(`#${newArr.join('')}`)

        checkRepeatedOrderNumber().then(resp => {
            let newList = []
            let newReqNum;
            // while (newList.includes(req_num().join(''))) {
            //     newReqNum = req_num().join('')
            //     console.log(newReqNum)
            // }


            // console.log(newList.includes(req_num().join('')))
            // console.log(resp)
            if (resp) {
                let newReq = req_num();
                let seq_check;
                resp.map(item => {
                    // if (item.request_number) {
                    //     newList.push(item.request_number)
                    // }

                    try {
                        if (item.request_number === req_num().join('')) {
                            throw new Error('Código existente')
                        }
                    } catch(e) {
                        console.log(`ERROR: ${e.message}`)
                        // seq[index] = letter_num[genNumAndLetter(letter_num.length)]
                        newReq = req_num()
                    } finally {
                        seq_check = newReq.join('')
                    }
                })
                // setCode(seq_check)
                saveUser(seq_check, condCount, newOrderQtt)
                console.log('--------------SEQ_CHECK--------------')
                console.log(seq_check)
                // console.log(req_num.join(''))
                // console.log(newList.includes(req_num.join('')))

            } else {
                console.log('PROSSEGUIR, NÃO EXISTE NUNHUMA REQUISIÇÃO')
                // setCode(req_num().join(''))
                saveUser(req_num().join(''), condCount, newOrderQtt)
            }
        })
    }


    // COPIADO DE OUTRO ARQUIVO

    var letter_num = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    var list_numbers = ['0','1','2','3','4','5','6','7','8','9']
    var list_letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    let randomNum;
    
    let seq_check;
    
    
    function genNumAndLetter(cont) {
        randomNum = Math.round(Math.random() * Number(cont))
        return Number(randomNum)
    }

    function seqNumLetter() {
        let seq = [];
        for (let p = 0; p < 10; p++) {
            seq.push(letter_num[genNumAndLetter(Number(letter_num.length - 1))])
        }

        // console.log('---------------SEQUÊNCIA DE CÓDIGOS---------------')
        // console.log(seq)
        // console.log(code)
    }

    function seqNum() {
        let seq = [];
        let seen = {}
        // for (let p = 0; p < 3; p++) {
        //     seq.push(list_numbers[genNumAndLetter(Number(list_numbers.length - 1))])
        // }
        
        let pos = 0

        while (pos < 3) {
            let previous;
            let gen_num = list_numbers[genNumAndLetter(Number(list_numbers.length - 1))]

            if (seen.hasOwnProperty(gen_num)) {
                previous = seen[gen_num]
            } else {
                seen[gen_num] = pos
                seq.push(gen_num)
                pos++
            }
            // console.log('SEEN:')
            // console.log(seen)
            // console.log('PREVIOUS:')
            // console.log(previous)
        }

        // console.log('---------------SEQUÊNCIA DE NÚMEROS---------------')
        // console.log(seq)
        // console.log(code)
        return seq
    }

    function seqLetter() {
        let seq = [];
        let seen = {}
        // for (let p = 0; p < 3; p++) {
        //     seq.push(list_numbers[genNumAndLetter(Number(list_numbers.length - 1))])
        // }
        
        let pos = 0

        while (pos < 3) {
            let previous;
            let gen_letter = list_letters[genNumAndLetter(Number(list_letters.length - 1))]

            if (seen.hasOwnProperty(gen_letter)) {
                previous = seen[gen_letter]
            } else {
                seen[gen_letter] = gen_letter
                seq.push(gen_letter)
                pos++
            }
            // console.log('SEEN:')
            // console.log(seen)
            // console.log('PREVIOUS:')
            // console.log(previous)
        }

        return seq
    }

    function findUndef() {
        // seq.map((item, index) => {
        //     try {
        //         if (item === undefined) {
        //             throw new Error('Variável indefinada')
        //         }
        //     } catch(e) {
        //         console.log(`ERROR: ${e.message}`)
        //         seq[index] = letter_num[genNumAndLetter(letter_num.length)]
        //     } finally {
        //         seq_check = seq.join('')
        //     }
        // })
        // setCode(seq_check)
        // console.log(seq_check)
    }

    // COPIADO DE OUTRO ARQUIVO

    function handleSend() {
        NetInfo.fetch().then(state => {
            if (list_address.length == 0 || selected.length == 0) {
                toastMsg('Selecione um endereço')
            } else if (activePay == null) {
                toastMsg('Selecione uma forma de pagamento')
            } else if (!state.isConnected) {
                toastMsg('Verifique sua conexão com a internet.')
            } else {
                postUser()
    
    
                // let condDlvType = options.indexOf(optionSelect) == 0 ? 'Retirada' : 'Entrega'
                // let condChangeFor = activePay == 0 ? convToFloat(changeFor) : null
                // // DATE:
                // let cur_day = new Date().getDate()
                // let cur_month = new Date().getMonth() + 1
                // let cur_year = new Date().getFullYear()
                // // TIME:
                // let cur_hour = new Date().getHours()
                // let cur_minute = new Date().getMinutes()
        
                // cur_day = cur_day.toString().length < 2 ? '0' + cur_day : cur_day
                // cur_month = cur_month.toString().length < 2 ? '0' + cur_month : cur_month
        
                // cur_hour = cur_hour.toString().length < 2 ? '0' + cur_hour : cur_hour
                // cur_minute = cur_minute.toString().length < 2 ? '0' + cur_minute : cur_minute
        
                // let cur_date = `${cur_day}/${cur_month}/${cur_year}`
                // let cur_time = `${cur_hour}:${cur_minute} ${cur_hour < 12 ? 'AM' : 'PM'}`
        
                // let address = {
                //     city,
                //     district,
                //     street,
                //     number,
                //     landmark,
                // }
        
                // let full_name = `${name} ${surname}`
        
                // let requests_data = {
                //     // dlvType: optionSelect,
                //     // dlv_fee,
                //     // total_order,
                //     // subTotal: total.toFixed(2),
                //     id: uuid(),
                //     // request_number: code_req,
                //     request: current_requests,
                //     date: cur_date,
                //     time: cur_time,
                //     dlvType: condDlvType,
                //     dlvTypePos: options.indexOf(optionSelect),
                //     full_name: full_name,
                //     address: address,
                //     formPay: formPay[activePay],
                //     // formPay: payMethods[activePay],
                //     changeFor: condChangeFor,
                //     dlvFee: dlvFee,
                //     subTotal: total,
                //     totalOrder: totalOrder,
                //     count: 1,
                //     count_admin: 1,
                //     count_user: 0,
                //     response: 0,
                // }
    
    
    
    
            //     let orderHistoryCopy;
            //     if (order_history && order_history !== undefined) {
            //         orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
            //     } else {
            //         orderHistoryCopy = []
            //     }
    
            //     let posId = orderHistoryCopy.findIndex(filItem => {
            //         return filItem.id == cityId
            //     })
    
            //     if (posId >= 0) {
            //         orderHistoryCopy[posId] = {
            //             id: cityId,
            //             data: requests_data,
            //         }
            //     } else {
            //         orderHistoryCopy.push({
            //             id: cityId,
            //             data: requests_data,
            //         })
            }
    
                // console.log('-----------------ORDER_HISTORY_COPY-----------------')
                // console.log(orderHistoryCopy)
            // }
    
            // postUser()

        })
    }

    // function header() {
    //     return (
    //         <Header>
    //             <NavigationEvents onWillFocus={() => setLoaderVisible(false)} />
    //             <BorderlessButton 
    //                 onPress={goBack}
    //                 style={{ marginHorizontal: 12, padding: 2 }} 
    //                 rippleColor='rgba(0, 0, 0, .4)' 
    //                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    //             >
    //                 <Icon name='arrow-back' size={26} color='#fff' />
    //             </BorderlessButton>

    //                 <Title>Finalização</Title>

    //             <BorderlessButton
    //                 onPress={() => nav('Resume')}
    //                 style={{ marginHorizontal: 24, padding: 2 }} 
    //                 rippleColor='rgba(0, 0, 0, .4)' 
    //                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    //             >
    //             </BorderlessButton>
    //         </Header>
    //     )
    // }

    return (
        <Page>
            {/* {header()} */}
            <Header title='Finalização' navigation={navigation} />
            <Scroll contentContainerStyle={{ alignItems: 'center', paddingBottom: normalize(60) }} >
                <Section>
                    <SectionText>Endereço</SectionText>
                </Section>
                <Item
                    justCont='space-between'
                    activeOpacity={.6}
                    onPress={() => nav('ChooseAddress', { resume: true })}
                    disabled={disabled}
                >
                    <ItemText style={{ marginRight: normalize(40) }} >{optionSelect == options[1] ? 'Entregar em' : 'Retirar em'}</ItemText>
                    {optionSelect == options[1] ?
                    <RightItem>
                        {selected.length > 0 ? <ItemText txtAlign='right' color='#077a15' >{district} / {street} / {number}</ItemText> : <ItemText color='#077a15' >Selecione um enderço</ItemText>}
                        <Icon name='keyboard-arrow-right' size={normalize(20)} color='#077a15' style={{ alignSelf: 'center', left: normalize(5) }} />
                    </RightItem> :
                    <RightItem>
                        <ItemText txtAlign='right' color='#077a15' >{addressCity.district} / {addressCity.street} / {addressCity.number}</ItemText>
                    </RightItem>}
                </Item>
                <Item
                    justCont='space-between'
                    onPress={() => setModalVisible(true)}
                    style={{ borderBottomWidth: 0 }}
                    disabled={dlvOptions.length == 1}
                    activeOpacity={.6}
                >
                    <ItemText color='#000' >{optionSelect}</ItemText>
                    {dlvOptions.length > 1 &&
                    <RightItem>
                        <ItemText color='#077a15' >Trocar opção</ItemText>
                        <Icon name='keyboard-arrow-right' size={normalize(20)} color='#077a15' style={{ alignSelf: 'center', left: normalize(5) }} />
                    </RightItem>}
                </Item>
                <Section>
                    <SectionText>Formas de pagamento</SectionText>
                </Section>
                {/* {formPay.map((item, index) => ( */}
                {payMethods.map((item, index) => (
                    <Item
                        key={index}
                        style={{ borderBottomWidth: index == 1 ? 0 : normalize(.5) }}
                        onPress={() => {
                            if (index == 0) {
                                setChangeVisible(true)
                            }
                            setActivePay(index)
                        }} 
                        activeOpacity={.6}
                    >
                        <LeftItem>
                            <BoxExtra selected={activePay == index} ></BoxExtra>
                            {optionSelect == options[0] && index == 1 ? <ItemText>Vou passar o cartão</ItemText> : <ItemText>{item}</ItemText>}
                        </LeftItem>
                        {/* {index == 0 && change_num != 0 && <ItemText color='#077a15' style={{ right: 10 }} >Troco para: R$ {change_num.toFixed(2).replace('.', ',')}</ItemText>} */}
                        {index == 0 && remSpecChar(changeFor) != 0 && <ItemText color='#077a15' style={{ right: normalize(10) }} >Troco para: {changeFor}</ItemText>}
                        {index == 0 && noChange && <ItemText color='#077a15' style={{ right: normalize(10) }} >Sem troco</ItemText>}
                        {/* {index == 0 && <Icon name='keyboard-arrow-right' size={20} color='#077a15' style={{ alignSelf: 'center', left: 5 }} />} */}
                        <FontIcon name={index === 0 ? 'money-bill-wave' : 'credit-card'} size={normalize(20)} color='#077a15' />
                    </Item>
                ))}
                <Section>
                    <SectionText>Resumo do pedido</SectionText>
                </Section>
                <AreaInfo>
                    <TextInfo>SubTotal</TextInfo>
                    {/* <TextInfo txtAlign='right' >R$ {total.toFixed(2).replace('.', ',')}</TextInfo> */}
                    {/* <TextInfo txtAlign='right' >{onPriceChange(total.toFixed(2))}</TextInfo> */}
                    <TextInfo txtAlign='right' >{onPriceChange(total)}</TextInfo>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo>Taxa de entrega</TextInfo>
                    {/* <TextInfo>R$ {dlv_fee.toFixed(2).replace('.', ',')}</TextInfo> */}
                    <TextInfo>{onPriceChange(dlvFee)}</TextInfo>
                </AreaInfo>
                <AreaInfo style={{ borderBottomWidth: normalize(.5), borderColor: '#999' }} >
                    <TextInfo>Total</TextInfo>
                    {/* <TextInfo>R$ {total_order.toFixed(2).replace('.', ',')}</TextInfo> */}
                    <TextInfo>{onPriceChange(totalOrder)}</TextInfo>
                </AreaInfo>
            </Scroll>
            <Footer>
                <ButtonFinish 
                    onPress={handleSend} 
                    underlayColor='#e5921a'
                >
                    <ButtonText>Enviar pedido</ButtonText>
                </ButtonFinish>
            </Footer>
            <ModalOptions
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                options={dlvOptions}
                optionSelect={optionSelect}
                setOptionSelect={setOptionSelect}
            />
            <ModalChangeFor
                modalVisible={changeVisible}
                setModalVisible={setChangeVisible}
                changeFor={changeFor}
                setChangeFor={setChangeFor}
                setActivePay={setActivePay}
                noChange={noChange}
                setNoChange={setNoChange}
                totalOrder={totalOrder}
            />
        </Page>
    );
}

Resume.navigationOptions = () => {
    return {
        headerShown: false,
        headerTitle: 'Finalização'
    }
}

const mapStateToProps = (state) => {
    return {
        list_address: state.userReducer.list_address,
        selected: state.userReducer.selected,
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests,
        order_history: state.requestReducer.order_history,
        total: state.requestReducer.total,
        dlvFee: state.requestReducer.dlvFee,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: { list_request }}),
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: { current_requests }}),
        setOrderHistory: (order_history) => dispatch({type: 'SET_ORDER_HISTORY', payload: { order_history }}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);