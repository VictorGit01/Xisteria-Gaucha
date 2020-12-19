import React, { useEffect, useState, useContext } from 'react';
import { Dimensions, View } from 'react-native';
import { normalize } from '../../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Fi from 'react-native-vector-icons/Feather';

// Components:
import ModalItemQues from './ModalItemQues';
import ModalCancel from './ModalCancel';
import ModalDelete from './ModalDelete';

// Contexts:
import LoaderContext from '../../contexts/LoaderContext';

const { height, width } = Dimensions.get('window');

// function normalize(size) {
//     return (width + height) / size;
// }

const Item = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-bottom-width: .5px;
    padding: ${normalize(20)}px ${normalize(10)}px;
`

const ItemText = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    color: ${props => props.color || '#000'};
`

const RightItem = styled.View`
    flex: 1;
    justify-content: center;
`

const CircleDlvType = styled.View`
    justify-content: center;
    align-items: center;
    height: ${normalize(70)}px;
    width: ${normalize(70)}px;
    border-radius: ${normalize(100)}px;
    background-color: #ff2626;
    margin-right: ${normalize(10)}px;
`

const DlvTypeText = styled.Text`
    font-size: ${normalize(30)}px;
    font-weight: bold
    color: #fff;
`

const RespText = styled.Text`
    width: 42%;
    font-size: ${normalize(16)}px;
    font-weight: bold
    text-align: center;
    text-align-vertical: center;
    color: ${props => props.color || '#daa520'};
    border: ${normalize(2)}px solid ${props => props.bdColor || '#daa520'};
    border-radius: ${normalize(50)}px;
    padding-top: 0px;
    padding-horizontal: ${normalize(5)}px;
    margin-left: ${normalize(10)}px;
`
// margin-vertical: 5px;
// height: ${normalize(37)}px;
// margin-horizontal: 20px;
// padding-horizontal: ${normalize(230)}px;
// width: 42%;
// max-width: 48%;
// padding-horizontal: ${normalize(13)}px;

const ButtonEdit = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    margin-left: ${normalize(5)}px;
`
// padding: ${normalize(10)}px;

const TabBarBadge = styled.View`
    width: ${normalize(20)}px;
    height: ${normalize(20)}px;
    border-radius: ${normalize(10)}px;
    background-color: rgba(255, 0, 0, .9);
    justify-content: center;
    align-items: center;
`
// margin-horizontal: 10px;

const TabBarCount = styled.Text`
    font-size: ${normalize(12)}px;
    color: #fff;
`

export default (props) => {
    const { 
        item, 
        setItemHistory, 
        index, 
        setIndexHistory, 
        cityId, 
        order_history, 
        setOrderHistory, 
        snapList, 
        nav, 
        getHistory, 
        setItemQuesVisible,
        setLoading,
        callGetHistory
    } = props
    // const [ ItemQuesVisible, setItemQuesVisible ] = useState(false)
    // const [ cancelVisible, setCancelVisible ] = useState(false)
    // const [ deleteVisible, setDeleteVisible ] = useState(false)
    // const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    useEffect(() => {
        console.log('----------LIST_ITEM DE HISTORY----------')
        console.log(item)
    }, [])

    let conv_num = num => isNaN(num) ? 0 : Number(num)

    let count = conv_num(item.count_user) + conv_num(item.count_admin)

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

    return (
        <Item
            onPress={() => nav('OrderDetails', { data: item, dataIdx: index, setLoading, callGetHistory })}
            // onPress={() => alert(item.pushId)}
            activeOpacity={.6}
        >
            <CircleDlvType>
                <DlvTypeText>{item.dlvTypePos == 0 ? 'R' : 'D'}</DlvTypeText>
            </CircleDlvType>
            <RightItem>
                <View style={{ flexDirection: 'row' }}>
                    <ItemText color='#ff2626' style={{ flex: 1 }} >Pedido realizado em {item.date} às {item.time}</ItemText>
                    <ButtonEdit
                        onPress={() => {
                            setItemHistory(item)
                            setIndexHistory(index)
                            setItemQuesVisible(true)
                        }}
                        // onPress={() => console.log(item)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        {/* <FontIcon name='ellipsis-v' size={normalize(20)} color='#444' /> */}
                        <Fi name='more-vertical' size={30} color='#444' />
                    </ButtonEdit>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 5 }} >
                    <ItemText >Preço: {onPriceChange(item.totalOrder)}</ItemText>
                    {item.response == 0 && <RespText color='#964b00' bdColor='#964b00' >aguardando</RespText>}
                    {item.response == 1 && <RespText color='orange' bdColor='orange' >em preparo</RespText>}
                    {/* {item.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu para entrega</RespText>} */}
                    {item.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu p/entrega</RespText>}
                    {item.response == 3 && <RespText color='green' bdColor='green' >entregue</RespText>}
                    {item.response == 4 && <RespText color='red' bdColor='red' >recusado</RespText>}
                    {item.response == 5 && <RespText color='red' bdColor='red' >cancelado</RespText> }
                    {count > 0 &&
                    <TabBarBadge>
                        <TabBarCount>{count > 9 ? 9 + '+' : count}</TabBarCount>
                    </TabBarBadge>}
                </View>
            </RightItem>
            
            {/* <ModalItemQues
                modalVisible={ItemQuesVisible}
                setModalVisible={setItemQuesVisible}
                setCancelVisible={setCancelVisible}
                setDeleteVisible={setDeleteVisible}
                cityId={cityId}
                nav={nav}
                data={item}
                dataIdx={index}
                order_history={order_history}
                setOrderHistory={setOrderHistory}
            />
            <ModalCancel
                modalVisible={cancelVisible}
                setModalVisible={setCancelVisible}
                loaderVisible={loaderVisible}
                setLoaderVisible={setLoaderVisible}
                order_history={order_history}
                setOrderHistory={setOrderHistory}
                // snapList={snapList}
                cityId={cityId}
                data={item}
                dataIdx={index}
                getHistory={getHistory}
            />
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                loaderVisible={loaderVisible}
                setLoaderVisible={setLoaderVisible}
                order_history={order_history}
                setOrderHistory={setOrderHistory}
                cityId={cityId}
                dataIdx={index}
                // getHistory={getHistory}
            /> */}
        </Item>
    )
}