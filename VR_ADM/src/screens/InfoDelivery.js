import React, { useEffect, useState, useContext } from 'react';
import { View, Dimensions, ActivityIndicator, ToastAndroid, BackHandler } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Fi from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../../firebase';
import axios from 'axios';

// require('dotenv/config');
// require('dotenv').config()
// import config from '../../config'
// import { NOTIF_TOKEN } from 'react-native-dotenv'
import { NOTIF_TOKEN } from '@env'

// Components:
import LoadingPage from '../components/LoadingPage';
import ModalConfirm from '../components/ModalConfirm';
import ModalDelete from '../components/ModalDelete';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const InfoHeader = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: ${normalize(20)}px;
`

const Title = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #000;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px;
    border-color: #ccc;
    align-self: ${props => props.aSelf || 'flex-start'};
`
// width: 100%

const Item = styled.View`
    width: 90%;
    flex-direction: row;
    align-items: flex-start;
    padding-vertical: ${normalize(15)}px;
    border-color: #999;
    border-bottom-width: ${normalize(.5)}px;
`

const ItemTextArea = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const ItemText = styled.Text`
    font-size: ${normalize(16)}px;
    color: ${props => props.color || '#000'};
`

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    text-align: ${props => props.txtAlign || 'left'};
    color: ${props => props.color || '#000'};
    margin-vertical: ${normalize(5)}px;
`

// const RespText = styled.Text`
//     width: 40%;
//     font-size: 16px;
//     font-weight: bold
//     text-align: center;
//     text-align-vertical: center;
//     color: ${props => props.color || '#daa520'};
//     border: 2px solid ${props => props.bdColor || '#daa520'};
//     border-radius: 50px;
//     padding-top: 0px;
//     padding-horizontal: ${normalize(230)}px;
//     margin-horizontal: 20px;
// `

const ItemTopArea = styled.View`
    flex-direction: row;
    padding-vertical: ${normalize(10)}px;
`
// flex: 1;

const ItemAreaLeft = styled.View`
    flex: 1;
    justify-content: space-evenly;
`
//heigth: 100%

const ItemAreaRight = styled.View`
    width: 100px;
    align-items: flex-end;
    justify-content: center;
`

const ExtraArea = styled.View`
    flex-direction:row;
    width: 100%
    align-items: center
    justify-content: space-between;
`

const ExtraLeftArea = styled.View`
    flex-direction: row
    align-items: center;
`

const ItemExtraText = styled.Text`
    font-size: ${normalize(16)}px;
    color: ${props => props.color || '#888'};
    margin-left: ${normalize(5)}px;
`

const UlList = styled.View`
    height: ${normalize(4)}px;
    width: ${normalize(4)}px;
    background-color: #888;
    border-radius: ${normalize(2)}px;
`

const InputSelect = styled.View`
    width: 50%
    height: ${normalize(50)}px;
    justify-content: center;
    border-width: ${normalize(.5)}px;
    border-color: ${props => props.bdColor || '#999'};
    border-radius: ${normalize(5)}px;
`
// width: 100%;
// margin-top: 20px;

const Screen = (props) => {
    const [ loading, setLoading ] = useState(true)
    const [ pageVisible, setPageVisible ] = useState(false)
    // const [ listProcess, setListProcess ] = useState([{label: 'aguardando', value: 0}])
    const [ selectedProcess, setSelectedProcess ] = useState({ label: 'Definir processo', value: null, color: '#999' })
    const [ count, setCount ] = useState(false)
    const [ smallLoading, setSmallLoading ] = useState(false)
    const [ confirmVisible, setConfirmVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ valueProcess, setValueProcess ] = useState(null)
    const [ indexProcess, setIndexProcess ] = useState(0)
    const [ disabled, setDisabled ] = useState(false)
    const [ userToken, setUserToken ] = useState('')

    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    
    const currentCity = firebase.auth().currentUser
    const cityId = firebase.auth().currentUser.uid
    const requests = firebase.database().ref('requests')
    const users = firebase.database().ref('users')

    const { navigation } = props
    const goBack = navigation.goBack

    const params = navigation.state.params
    // const { landmark: data.landmark } = params
    const data = params.data
    const { landmark, userId, pushId, request_number } = data

    const listProcess = [
        {label: 'aguardando', value: 0, color: '#964b00'},
        {label: 'em preparo', value: 1, color: 'orange'},
        {label: 'saiu p/entrega', value: 2, color: '#9400d3'},
        // {label: 'chegando', value: 3, color: '#9400d3'},
        {label: 'entregue', value: 3, color: 'green'},
        // {label: 'cancelado', value: 4, color: 'red'},
        // {label: 'anulado', value: 4, color: '#708090'},
        {label: 'recusado', value: 4, color: '#f00'},
    ]    

    useEffect(() => {
        console.log('---------------TOKEN INFO_DELIVERY---------------')
        // console.log(process.env.NOTIF_TOKEN)
        // console.log(config.NOTIF_TOKEN)
        // alert(NOTIF_TOKEN)
        // alert(JSON.stringify(FIREBASE_CONFIG))
        // console.log(JSON.stringify(FIREBASE_CONFIG))
        // console.log(request_number)
        users.child(cityId).child(userId).on('value', snapshot => {
            let token = snapshot.val().token
            setUserToken(token)
            // console.log(token)
        })

        try {
            requests.child(cityId).child(userId).child(pushId).child('count').set(0)
            
            requests.child(cityId).child(userId).child(pushId).on('value', snapshot => {
                if (snapshot.val()) {
                    let process = listProcess[snapshot.val().response]
                    let snap_disabled = snapshot.val().disabled
        
                    setSelectedProcess(process)
                    setDisabled(snap_disabled)

                    setTimeout(() => {
                        setLoading(false)
                    }, 2000)
                }
            })
        } catch(e) {
            console.log(e)
            toastMsg(`${e.code} - ${e.message}`)
        }
    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [confirmVisible, deleteVisible])

    function onBack() {
        if (confirmVisible, deleteVisible) {
            setConfirmVisible(false)
            setDeleteVisible(false)
            finishLoad()
            return true
        }

        return false
    }

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    function onlyNumbers(text) {
        let cleaned = ('' + text).replace(/\D/g, '');

        return cleaned;
    }

    function onPriceChange(text) {
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

        return num_format
    }

    function espera() {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
                reject(false)
            }, 1000)
        })

        let result = promise
        return result
    }

    function valueCondition(value) {
        if (value === 1) {
            return 'Seu pedido já está sendo preparado.'
        } else if (value === 2) {
            return 'Seu pedido saiu para entrega.'
        } else if (value === 3) {
            return 'Pedido entregue.'
        } else if (value === 4) {
            return 'Desculpe, mas seu pedido foi recusado por algum motivo.'
        }
    }

    function sendNotification(value) {
        const notifiIcon = require('../assets/images/logo.png')
        axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': NOTIF_TOKEN
            },
            data: {
                'to': userToken,
                'notification': {
                    'title': `Pedido #${request_number}`,
                    'body': valueCondition(value),
                    'vibrate': 1,
                    'priority': 'high',
                    'content_available': true,
                    'color': '#fe9601',
                    // 'icon': () => <Fi name='menu' size={20} color='#077a15' />
                }
            }
        }).catch(e => {
            console.log(e)
            // toastMsg(`${e.code} - ${e.message}`)
        })
    }

    function finishLoad() {
        setCount(false)
        setSmallLoading(false)
    }

    function callChange(value, index, choose) {
        let previous = selectedProcess;

        if (listProcess[value] == undefined) {
            // setSelectedProcess({ value: null, index: 0, color: '#999' })
            setSelectedProcess(previous)
            finishLoad()
        } else if (value >= 3 && !choose) {
            setConfirmVisible(true)
        } else {
            try {
                let color = listProcess[value].color
                setSelectedProcess({ value, index, color })

                requests.child(cityId).child(userId).child(pushId).child('count_admin').set(1)
                requests.child(cityId).child(userId).child(pushId).child('response').set(value)
                
                if (value > 0) {
                    sendNotification(value)
                }

                finishLoad()
            } catch(e) {
                finishLoad()
                console.log(e)
                toastMsg(`${e.code} - ${e.message}`)
            }
        }
        
    }

    function onValueChange(value, index) {
        setSmallLoading(true)

        if (!count) {
            setValueProcess(value)
            setIndexProcess(index)

            setTimeout(() => {
                callChange(value, index)
                // setSmallLoading(false)
                // setCount(false)
            }, 1000)
            setCount(true)
        }
        
        // console.log(listProcess[index - 1])
        // console.log(listProcess[value])
    }

    function handleDelete() {
        // setPageVisible(true)
        setDeleteVisible(false)

        requests.child(cityId).child(userId).child(pushId).remove()
            .then(() => {
                setTimeout(async () => {
                    await goBack()
                    toastMsg('Pedido excluído.')
                    setLoaderVisible(false)
                }, 2000)
            })
    }

    if (!loading) {
        return (
            <Page>
                <Scroll
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: normalize(80) }}
                >
                    {/* <Title>Pedido #9016</Title> */}
                    <InfoHeader>
                        <Title>Pedido #{data.request_number}</Title>
                        {data.remove_enabled && 
                        <BorderlessButton
                            onPress={() => setDeleteVisible(true)}
                            style={{ padding: normalize(10) }}
                        >
                            <FontIcon name='trash-alt' size={normalize(20)} color='#999' />
                        </BorderlessButton>}
                    </InfoHeader>
                    {/* <Item style={{ paddingBottom: 40, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0 }} > */}
                    <Item style={{ paddingBottom: normalize(40), justifyContent: 'center', alignItems: 'center' }} >
                        <TextInfo style={{ flex: 1 }} size={normalize(14)} color='#999' >Pedido realizado em {data.date} às {data.time}</TextInfo>
                        {/* {data.response == 0 && <RespText color='#964b00' bdColor='#964b00' >aguardando</RespText>} */}
                        {/* {data.response == 1 && <RespText color='orange' bdColor='orange' >em preparo</RespText>} */}
                        {/* {data.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu para entrega</RespText>} */}
                        {/* {data.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >chegando</RespText>} */}
                        {/* {data.response == 3 && <RespText color='green' bdColor='green' >entregue</RespText>} */}
                        {/* {data.response == 4 && <RespText color='red' bdColor='red' >cancelado</RespText>} */}
                        {smallLoading ?
                        <View style={{ width: '50%', height: normalize(50), justifyContent: 'center', alignItems: 'center' }} >
                            <ActivityIndicator size='small' color='#077a15' />
                        </View>
                        :
                        <InputSelect bdColor={selectedProcess.color} >
                            <RNPickerSelect
                                items={listProcess}
                                onValueChange={onValueChange}
                                style={{
                                    inputAndroid: {
                                        // fontSize: normalize(72),
                                        fontSize: normalize(12),
                                        color: selectedProcess.color
                                    },
                                    // placeholder: {
                                    //     color: selectedProcess.color
                                    // },
                                }}
                                value={selectedProcess.value}
                                key={selectedProcess.value}
                                // itemKey={selectedProcess.value}
                                // useNativeAndroidPickerStyle={false}
                                placeholder={{ label: 'Definir processo', value: null, color: '#999' }}
                                disabled={disabled}
                            />
                        </InputSelect>}
                    </Item>
    
                    {/* <Button title='Aperte para trocar de valor' style={{ height: 40 }} onPress={() => setSelectedProcess({ value: 1, index: 2, color: 'orange' })} /> */}
                    {/* <Item>
                        
                    </Item> */}
    
                    <Title>Cliente:</Title>
                    <Item>
                        <ItemText>{data.full_name}</ItemText>
                    </Item>
    
                    <Title>{data.dlvTypePos == 0 ? 'Endereço de retirada:' : 'Endereço de entrega'}</Title>
                    <Item style={{ flexWrap: 'wrap' }} >
                        <ItemText>{data.address.district}, </ItemText>
                        <ItemText>{data.address.street}, </ItemText>
                        <ItemText>{data.address.number}{landmark && landmark.length ? ', ' : ' - '}</ItemText>
                        {landmark && landmark.length && <ItemText>{landmark} - </ItemText>}
                        <ItemText>{data.address.city}</ItemText>
                    </Item>
    
                    <Title>Forma de pagamento:</Title>
                    <Item style={{ justifyContent: 'space-between' }} >
                        {/* <ItemText>{data.formPay}</ItemText> */}
                        <ItemText>{data.formPayPos == 0 ? 'Dinheiro' : 'Cartão de crédito'}</ItemText>
                        
                        {data.formPayPos == 0 && 
                        <ItemText color='#999' >
                            {data.changeFor && onlyNumbers(data.changeFor) > 0 ? onPriceChange(data.changeFor) : 'Sem troco'}
                        </ItemText>}
                    </Item>
    
                    <Title>Items:</Title>
                    <Item style={{ flexDirection: 'column' }} >
                    {data.request.map((item, index) => (
                        <View key={index} style={{ width: '100%', borderTopWidth: normalize(.5), borderColor: '#999', paddingBottom: normalize(10) }} >
                            <ItemTopArea >
                                <ItemAreaLeft>
                                    <ItemText>{item.amount}x  {item.name}</ItemText>
                                    {/* <ItemText color='#ff2626' >Quantidade: {item.amount}</ItemText> */}
                                </ItemAreaLeft>
                                <ItemAreaRight>
                                    <ItemText>{onPriceChange(item.price)}</ItemText>
                                    {/* <ItemText>{item.price}</ItemText> */}
                                </ItemAreaRight>
                            </ItemTopArea>
                            {item.data && item.data.map((extraItem, extraIndex) => {
                                let conv_num = num => isNaN(num) ? 0 : Number(num)
                                let priceAmount = conv_num(extraItem.price) * conv_num(extraItem.amount)
                                
                                return (
                                    <ExtraArea key={extraIndex} >
                                        <ExtraLeftArea>
                                            <UlList></UlList>
                                            <ItemExtraText>{extraItem.amount}x {extraItem.name}</ItemExtraText>
                                        </ExtraLeftArea>
                                        {/* {extraItem.price > 0 && <ItemExtraText>R$ {priceAmount.toFixed(2).replace('.', ',') }</ItemExtraText>} */}
                                        {extraItem.price > 0 && <ItemExtraText>{onPriceChange(priceAmount.toFixed(2))}</ItemExtraText>}
                                        {/* {extraItem.price > 0 && <ItemExtraText>{onPriceChange(extraItem.price)}</ItemExtraText>} */}
                                    </ExtraArea>
                                )
                            })}
                            {item.note.length > 0 &&
                            <ExtraArea style={{ marginTop: normalize(5), alignItems: 'flex-start' }} >
                                <ItemExtraText style={{ marginLeft: 0, marginRight: normalize(10) }} >Observação</ItemExtraText>
                                <ItemExtraText style={{ textAlign: 'right', alignSelf: 'flex-end', flex: .8 }} >{item.note}</ItemExtraText>
                            </ExtraArea>}
                        </View>
                    ))}
                    <ExtraArea style={{ borderTopWidth: normalize(.5), paddingTop: normalize(10), borderColor: '#999' }} >
                        <TextInfo>SubTotal</TextInfo>
                        {/* <TextInfo txtAlign='right' >R$ {total.toFixed(2).replace('.', ',')}</TextInfo> */}
                        {/* <TextInfo txtAlign='right' >{onPriceChange(total.toFixed(2))}</TextInfo> */}
                        <TextInfo txtAlign='right' >{onPriceChange(data.subTotal)}</TextInfo>
                    </ExtraArea>
                    <ExtraArea>
                        <TextInfo>Taxa de entrega</TextInfo>
                        {/* <TextInfo>R$ {dlv_fee.toFixed(2).replace('.', ',')}</TextInfo> */}
                        <TextInfo>{onPriceChange(data.dlvFee)}</TextInfo>
                    </ExtraArea>
                    <ExtraArea >
                        <TextInfo>Total</TextInfo>
                        {/* <TextInfo>R$ {total_order.toFixed(2).replace('.', ',')}</TextInfo> */}
                        <TextInfo>{onPriceChange(data.totalOrder)}</TextInfo>
                    </ExtraArea>
                    </Item>
                </Scroll>
                <ModalConfirm
                    modalVisible={confirmVisible}
                    setModalVisible={setConfirmVisible}
                    finishLoad={finishLoad}
                    valueProcess={valueProcess}
                    indexProcess={indexProcess}
                    callChange={callChange}
                    setDisabled={setDisabled}
                    cityId={cityId}
                    userId={userId}
                    pushId={pushId}
                />
                <ModalDelete
                    modalVisible={deleteVisible}
                    setModalVisible={setDeleteVisible}
                    handleDelete={handleDelete}
                />
                {/* {pageVisible ? <LoadingPage position='absolute' /> : null} */}
            </Page>
        )
    } else {
        return <LoadingPage />
    }

}

Screen.navigationOptions = () => {
    return {
        // headerShown: false,
        headerTitle: 'Informações'
    }
}

export default Screen;