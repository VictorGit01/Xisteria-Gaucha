import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { View, Dimensions } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../firebase';

// Components:
import ModalDelete from '../components/History/ModalDelete';
import ModalCancel from '../components/History/ModalCancel';
import Header from '../components/Header';

// Contexts:
import CallHistoryContext from '../contexts/CallHistoryContext';
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`;

const Scroll = styled.ScrollView`
    width: 100%;
`

const SubHeader = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: ${normalize(20)}px;
`

const Section = styled.View`
    width: 90%;
    padding-vertical: ${normalize(20)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #999;
`

// const SectionTitle = styled.Text`
//     font-size: 18px;
//     font-weight: bold;
// `

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

// const ItemTextArea = styled.View`
//     width: 100%;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
// `

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

const RespText = styled.Text`
    width: 40%;
    font-size: ${normalize(16)}px;
    font-weight: bold
    text-align: center;
    text-align-vertical: center;
    color: ${props => props.color || '#daa520'};
    border: ${normalize(2)}px solid ${props => props.bdColor || '#daa520'};
    border-radius: ${normalize(50)}px;
    padding-top: 0px;
    padding-horizontal: ${normalize(5)}px;
    margin-left: ${normalize(20)}px;
`
// margin-horizontal: 20px;
// padding-horizontal: ${normalize(230)}px;

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
    border-radius: 2;
`

const Screen = (props) => {
    const [ deleteVisible, setDeleteVisible ] = useState(false);
    const [ cancelVisible, setCancelVisible ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    
    const [ callHistory, setCallHistory ] = useContext(CallHistoryContext);
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext);

    const { navigation, cityId, order_history, setOrderHistory } = props;
    const params = navigation.state.params;
    const { data, dataIdx, setLoading, callGetHistory } = params
    // const data = params.data;
    // const dataIdx = params.dataIdx;
    const { landmark, deviceId, pushId } = data;

    const requests = firebase.database().ref('requests');
    const canceled = firebase.database().ref('canceled');

    // useEffect(() => {
        
    //     // console.log(pushId)
    // }, [])

    useEffect(() => {
        requests.child(cityId).child(deviceId).child(pushId).on('value', snapshot => {
            if (!snapshot.val()) {
                setDeleted(true)
            }
        })
    }, [])

    useEffect(() => {
        let orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
        // console.log('------------ORDER_DETAILS------------')
        // alert(pushId)
        let listPushId = []
        let listCanceledIds = []
        
        requests.child(cityId).child(deviceId).on('value', snapshot => {
            snapshot.forEach(childItem => {
                listPushId.push(childItem.key)
            })
        })

        canceled.child(cityId).child(deviceId).on('value', snapshot => {
            snapshot.forEach(childItem => {
                if (childItem.val().id == data.id) {
                    canceled
                    .child(cityId)
                    .child(deviceId)
                    .child(childItem.key)
                    .child('count_user')
                    .set(0)

                    canceled
                    .child(cityId)
                    .child(deviceId)
                    .child(childItem.key)
                    .child('count_admin')
                    .set(0)
                }
            })
        })

        // console.log(listPushId)

        // if (pushId && deviceId) {
        if (listPushId.includes(pushId)) {
            requests.child(cityId).child(deviceId).child(pushId).child('count_user').set(0)
            requests.child(cityId).child(deviceId).child(pushId).child('count_admin').set(0)
        }

        // if (listCanceledIds.includes(dataIdx)) {
        //    canceled.child(cityId).child(device) 
        // }

        // orderHistoryCopy[dataIdx].count_user = 0
        // orderHistoryCopy[dataIdx].count_admin = 0

        console.log('-------------ORDER_DETAILS TELA DATA-------------')
        console.log(data)

        console.log('-------------BEFORE-------------')
        orderHistoryCopy.map(item => {
            console.log(item)
        })

        orderHistoryCopy.map((item, index) => {
            if (item.id == cityId && item.data.length) {
                orderHistoryCopy[index].data[dataIdx].count_admin = 0
                orderHistoryCopy[index].data[dataIdx].count_user = 0
            }
        })

        console.log('-------------AFTER-------------')
        orderHistoryCopy.map(item => {
            console.log(item)
        })

        // getHistory(cityId, orderHistoryCopy, setOrderHistory)

        // setOrderHistory(orderHistoryCopy)
        // setCallHistory(!callHistory)
        callGetHistory(orderHistoryCopy)
    }, [])

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
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

    function onlyNumbers(text) {
        let cleaned = ('' + text).replace(/\D/g, '');

        return cleaned;
    }

    return (
        <Page>
            <NavigationEvents onDidBlur={() => console.log('-------------SAINDO DE ORDER_DETAILS-------------')} />
            <Header title='Detalhes do pedido' navigation={navigation} />
            <Scroll
                contentContainerStyle={{ alignItems: 'center', paddingBottom: normalize(80) }}
            >
                {/* <Title>Pedido #9016</Title> */}
                {/* <Title>Pedido #{data.request_number}</Title> */}
                <SubHeader>
                    <Title>Pedido #{data.request_number}</Title>
                    {(data.response >= 3 && deleted) ?
                    <BorderlessButton
                        onPress={() => setDeleteVisible(true)}
                        style={{ padding: normalize(10) }}
                    >
                        <FontIcon name='trash-alt' size={normalize(20)} color='#999' />
                    </BorderlessButton>
                    :
                    <BorderlessButton
                        onPress={() => setCancelVisible(true)}
                        style={{ padding: normalize(10) }}
                    >
                        {/* <TextInfo style={{ marginRight: 10 }} color='#f00' >Cancelar</TextInfo> */}
                        <FontIcon name='ban' size={normalize(20)} color='#999' />
                    </BorderlessButton>}
                </SubHeader>
                <Item style={{ paddingBottom: normalize(40), justifyContent: 'center', alignItems: 'center' }} >
                    <TextInfo style={{ flex: 1 }} size={14} color='#999' >Pedido realizado em {data.date} às {data.time}</TextInfo>
                    {data.response == 0 && <RespText color='#964b00' bdColor='#964b00' >aguardando</RespText>}
                    {data.response == 1 && <RespText color='orange' bdColor='orange' >em preparo</RespText>}
                    {/* {data.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu para entrega</RespText>} */}
                    {data.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu p/entrega</RespText>}
                    {data.response == 3 && <RespText color='green' bdColor='green' >entregue</RespText>}
                    {data.response == 4 && <RespText color='red' bdColor='red' >recusado</RespText>}
                    {data.response == 5 && <RespText color='red' bdColor='red' >cancelado</RespText>}
                </Item>

                <Title>{data.dlvTypePos == 0 ? 'Endereço de retirada:' : 'Endereço de entrega:'}</Title>
                <Item style={{ flexWrap: 'wrap' }} >
                    <ItemText>{data.address.district}, </ItemText>
                    <ItemText>{data.address.street}, </ItemText>
                    <ItemText>{data.address.number}{landmark && landmark.length ? ', ' : ' - '}</ItemText>
                    {landmark && landmark.length && <ItemText>{landmark} - </ItemText>}
                    <ItemText>{data.address.city}</ItemText>
                </Item>

                <Title>Forma de pagamento:</Title>
                <Item style={{ justifyContent: 'space-between' }} >
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
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                setLoaderVisible={setLoaderVisible}
                order_history={order_history}
                setOrderHistory={setOrderHistory}
                cityId={cityId}
                data={data}
                dataIdx={dataIdx}
                navigation={navigation}
            />
            <ModalCancel
                modalVisible={cancelVisible}
                setModalVisible={setCancelVisible}
                setLoaderVisible={setLoaderVisible}
                order_history={order_history}
                setOrderHistory={setOrderHistory}
                cityId={cityId}
                data={data}
                dataIdx={dataIdx}
                navigation={navigation}
                setLoading={setLoading}
                callGetHistory={callGetHistory}
            />
        </Page>
    );
}

Screen.navigationOptions = () => {
    return {
        headerShown: false,
        headerTitle: 'Detalhes do pedido'
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        order_history: state.requestReducer.order_history,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setOrderHistory: (order_history) => dispatch({type: 'SET_ORDER_HISTORY', payload: { order_history }}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);