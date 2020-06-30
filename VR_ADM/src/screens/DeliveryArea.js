import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uuid from 'uuid/v4';

import ModalAddCity from '../components/DeliveryArea/ModalAddCity';

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Listing = styled.FlatList`
    width: 100%;
`

const HeaderArea = styled.View`
    height: 80px;
    width: 100%;
    justify-content: center;
    border-bottom-width: .5px;
    padding-horizontal: 15px;
`

const ButtonAdd = styled.TouchableOpacity`
    height: 40px;
    width: 50%
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #fe9601;
    border-radius: 2px;
`
// width: 200px;

const ButtonText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`

const Item = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    align-items: center;
    padding: 15px 10px;
    border-bottom-width: 1px;
    border-color: #ccc;
`

const LeftItem = styled.View`
    flex: 1;
    flex-direction: row;
`

const BoxSquare = styled.View`
    height: 24px;
    width: 24px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ddd'};
    border: 5px solid ${props => props.selected ? '#fe9601' : '#ddd'};
    border-radius: 3px;
    margin-right: 15px;
    margin-left: 5px;
`

const ItemText = styled.Text`
    font-size: 18px;
`

const DeliveryArea = () => {
    const [ list, setList ] = useState(null)
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ city, setCity ] = useState('');
    const [ dlvFee, setDlvFee ] = useState('');
    const objCity = {
        id: uuid(),
        city,
        dlvFee        
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

    function handleSave() {
        let listCopy = list ? [ ...list, objCity ] : [ objCity ]

        setList(listCopy)
        setModalVisible(false)
        setCity('')
        setDlvFee('')
        toastMsg('Cidade inserida')
    }

    function renderItem({ item }) {
        return (
            <Item
                underlayColor='#eee'
            >
                <>
                <LeftItem>
                    <BoxSquare></BoxSquare>
                    <ItemText>{item.city}</ItemText>
                </LeftItem>
                <ItemText>R$ {Number(item.dlvFee).toFixed(2).replace('.', ',')}</ItemText>
                </>
            </Item>
        )
    }

    return (
        <Page>
            <HeaderArea>
                <ButtonAdd onPress={() => setModalVisible(true)} >
                    <FontIcon name='plus' size={15} color='#fff' />
                    <ButtonText>Nova cidade</ButtonText>
                </ButtonAdd>
            </HeaderArea>
            <Listing
                data={list}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <ModalAddCity
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                city={city}
                setCity={setCity}
                dlvFee={dlvFee}
                setDlvFee={setDlvFee}
                handleSave={handleSave}
            />
        </Page>
    )
}

DeliveryArea.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    return {
        headerTitle: 'Área de entrega',
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

export default DeliveryArea;