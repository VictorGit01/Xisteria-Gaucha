import React, { useState } from 'react';
import { Dimensions, View, ToastAndroid } from 'react-native';
import { normalize } from '../../functions';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../../firebase';

// Components:
import ModalBox from '../ModalBox';
import ModalDelete from '../ModalDelete';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Item = styled.TouchableHighlight`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
    padding: ${normalize(16)}px ${normalize(10)}px;
`
// padding: 20px 10px;

const ItemText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
`

const ItemTextArea = styled.View`
    flex: 1;
`

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const RespText = styled.Text`
    height: ${normalize(30)}px;
    font-size: ${normalize(16)}px;
    font-weight: bold;
    text-align: center;
    text-align-vertical: center;
    color: ${props => props.color || '#daa520'};
    border: ${normalize(2)}px solid ${props => props.bdColor || '#daa520'};
    border-radius: ${normalize(50)}px;
    padding-top: 0px;
    padding-horizontal: ${normalize(10)}px;
`

const ButtonEdit = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    padding: ${normalize(10)}px;
    margin-left: ${normalize(5)}px;
`

const TabBarBadge = styled.View`
    width: ${normalize(20)}px;
    height: ${normalize(20)}px;
    border-radius: ${normalize(10)}px;
    background-color: rgba(255, 0, 0, .9);
    justify-content: center;
    align-items: center;
`

const TabBarCount = styled.Text`
    font-size: ${normalize(12)}px;
    color: #fff;
`

export default ({ item, nav }) => {
    const [ boxVisible, setBoxVisible ] = useState(false);
    const [ deleteVisible, setDeleteVisible ] = useState(false);

    const { userId, pushId, remove_enabled } = item;

    const currentCity = firebase.auth().currentUser;
    const canceled = firebase.database().ref('canceled');

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    function navToInfoCanceled() {
        nav('InfoCanceled', { data: item });
    }

    function openSecondModal() {
        setBoxVisible(false);
        setDeleteVisible(true);
    }

    function handleDelete() {
        if (currentCity) {
            const cityId = currentCity.uid;

            // setDeleteVisible(false);

            canceled.child(cityId).child(userId).child(pushId).remove()
                .then(() => {
                    toastMsg('Pedido cancelado, excluído.')
                })
        }
    }

    return (
        <Item
            // style={{  }}
            onPress={navToInfoCanceled}
            underlayColor='#eee'
        >
            <>
            {/* <ItemTextArea style={{ justifyContent: 'center' }} >
                <ItemText>{item.full_name}</ItemText>
                <ItemTextArea style={{ flexDirection: 'row', marginTop: 5 }} >
                    <TextInfo style={{ marginRight: 5 }} >Às</TextInfo>
                    <TextInfo>{item.time}</TextInfo>
                    <TextInfo style={{ marginHorizontal: 5 }} >em</TextInfo>
                    <TextInfo>{item.date}</TextInfo>
                </ItemTextArea>
            </ItemTextArea>
            {item.count > 0 &&
            <TabBarBadge>
                <TabBarCount>{item.count > 9 ? 9 + '+' : item.count}</TabBarCount>    
            </TabBarBadge>} */}



            <ItemTextArea style={{ justifyContent: 'center' }} >
                <ItemTextArea style={{ flexDirection: 'row', justifyContent: 'flex-start' }} >
                    <ItemText style={{ flex: 1, marginRight: normalize(5) }} >Nelson Victor</ItemText>
                    {item.response == 0 && <RespText color='#964b00' bdColor='#964b00' >aguardando</RespText>}
                    {item.response == 1 && <RespText color='orange' bdColor='orange' >em preparo</RespText>}
                    {item.response == 2 && <RespText color='#9400d3' bdColor='#9400d3' >saiu para entrega</RespText>}
                    {item.response == 3 && <RespText color='green' bdColor='green' >entregue</RespText>}
                    {item.response == 4 && <RespText color='#708090' bdColor='#708090' >anulado</RespText>}
                </ItemTextArea>

                <ItemTextArea style={{ 
                    flexDirection: 'row', 
                    marginTop: normalize(10), 
                    justifyContent: 'space-between' 
                }} >
                    <View style={{ flexDirection: 'row' }} >
                        <TextInfo>{item.date}</TextInfo>
                        <TextInfo style={{ marginHorizontal: normalize(5) }} >às</TextInfo>
                        <TextInfo>{item.time}</TextInfo>
                    </View>

                    <View style={{  
                        width: '10%', 
                        height: '100%', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        alignSelf: 'flex-start' 
                    }} >
                        {item.count > 0 &&
                        <TabBarBadge>
                            <TabBarCount>{item.count > 9 ? 9 + '+' : item.count}</TabBarCount>    
                        </TabBarBadge>}
                    </View>
                </ItemTextArea>
            </ItemTextArea>
            <ButtonEdit
                onPress={() => setBoxVisible(true)}
                hitSlop={{ top: normalize(20), bottom: normalize(20), left: normalize(20), right: normalize(20) }}
            >
                <FontIcon name='ellipsis-v' size={normalize(20)} color='#444' />
            </ButtonEdit>
            <ModalBox
                modalVisible={boxVisible}
                setModalVisible={setBoxVisible}
                handleNavigate={navToInfoCanceled}
                remove_enabled={remove_enabled}
                openSecondModal={openSecondModal}
                canceled_enabled={true}
            />
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                handleDelete={handleDelete}
            />
            </>
        </Item>
    )
}