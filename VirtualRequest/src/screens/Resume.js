import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dimensions, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../firebase';
import uuid from 'uuid/v4';

// Components:
import ModalOptions from '../components/Resume/ModalOptions';
import ModalChangeFor from '../components/Resume/ModalChangeFor';

const { width } = Dimensions.get('window');

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`;

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
    font-size: 16px;
    font-weight: bold;
    color: #000;
`

const Item = styled.TouchableOpacity`
    width: ${width - 30}px;
    flex-direction: row;
    justify-content: ${props => props.justCont || 'flex-start'};
    padding-vertical: 15px;
    border-bottom-width: .5px;
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
    font-size: ${props => props.size || 16}px;
    text-align: ${props => props.txtAlign || 'left'};
    color: ${props => props.color || '#555'};
`

const BoxExtra = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
    border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${props => props.radius || 12}px;
    margin-right: 15px;
    margin-left: 5px;
`

const AreaInfo = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
`

const TextInfo = styled.Text`
    font-size: 18px;
    text-align: ${props => props.txtAlign || 'left'};
`

const Footer = styled.View`
    height: 80px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-top-width: .5px;
    border-color: #999;
`

const ButtonFinish = styled.TouchableHighlight`
    height: 40px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 3px;
    elevation: 2;
`

const ButtonText = styled.Text`
    font-size: 18px;
    font-weight: bold
    color: #fff;
    text-align: center;
`

const Resume = (props) => {
    const [ userId, setUserId ] = useState('')
    const [ name, setName ] = useState('')
    const [ surname, setSurname ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ changeVisible, setChangeVisible ] = useState(false)
    const [ optionSelect, setOptionSelect ] = useState('Entrega padrão')
    // const [ options, setOptions ] = useState(['Retirada no local', 'Entrega padrão'])
    const [ activePay, setActivePay ] = useState(null)
    const [ changeFor, setChangeFor ] = useState('')
    const [ noChange, setNoChange ] = useState(false)
    const [ disabled, setDisabled ] = useState(false)

    const { navigation, list_address, selected, cityId, total } = props
    const nav = navigation.navigate
    const cities = firebase.database().ref('cities')
    const requests = firebase.database().ref('requests')
    const users = firebase.database().ref('users')

    let change_num = isNaN(changeFor) ? 0 : Number(changeFor)
    let dlv_fee = 2
    let total_order = total + dlv_fee

    const options = ['Retirada no local', 'Entrega padrão']
    const formPay = ['Dinheiro', 'Trazer maquininha']

    useEffect(() => {
        // console.log(selected)
        if (optionSelect == options[1]) {
            setDisabled(false)
            list_address.map(item => {
                if (item.id == selected) {
                    setUserId(item.id)
                    setName(item.name)
                    setSurname(item.surname)
                    setDistrict(item.district)
                    setStreet(item.street)
                    setNumber(item.number)
                    setDDD(item.ddd)
                    setPhone(item.phone)
                }
            })
        } else {
            setDisabled(true)
            cities.child(cityId).on('value', snapshot => {
                setDistrict(snapshot.val().district)
                setStreet(snapshot.val().address)
                setNumber(snapshot.val().number)
                // console.log(snapshot.val())
            })
        }
    }, [selected, list_address, optionSelect])

    useEffect(() => {
        if (activePay == 0) {
            setChangeVisible(true)
        }
    }, [activePay])

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    // useEffect(() => {
    //     if (!modalVisible) {
    //         setActivePay(1)
    //     }
    //     console.log(modalVisible)
    // }, [modalVisible])

    function postReq() {
        let id = uuid()

        requests.child(userId).child(id).set({
            id,
            dlv_type: optionSelect,
            form_pay: formPay[activePay],
            total,
            dlv_fee,
            total_order,
        }).then(() => {
            toastMsg('Pedido enviado com sucesso!')
        }).catch(error => {
            toastMsg(`${error.code} - ${error.message}`)
            console.log(error)
        })
    }

    function postUser() {
        let id = userId
        
        users.child(id).set({
            id,
            name,
            surname,
            district,
            street,
            number,
            ddd,
            phone
        }).then(() => {
            postReq()
        }).catch(error => {
            toastMsg(error)
            console.log(error)
        })
    }

    function handleSend() {
        if (list_address.length == 0 || selected.length == 0) {
            toastMsg('Selecione um endereço')
        } else if (activePay == null) {
            toastMsg('Selecione uma forma de pagamento')
        } else {
            postUser()
        }
    }

    return (
        <Page>
            <Scroll contentContainerStyle={{ alignItems: 'center', }} >
                <Section>
                    <SectionText>Endereço</SectionText>
                </Section>
                <Item
                    justCont='space-between'
                    activeOpacity={1}
                    onPress={() => nav('ChooseAddress', { resume: true })}
                    disabled={disabled}
                >
                    <ItemText style={{ marginRight: 40 }} >{optionSelect == options[1] ? 'Entregar em' : 'Retirar em'}</ItemText>
                    {optionSelect == options[1] ?
                    <RightItem>
                        {selected.length > 0 ? <ItemText txtAlign='right' color='#077a15' >{district} / {street} / {number}</ItemText> : <ItemText color='#077a15' >Selecione um enderço</ItemText>}
                        <Icon name='keyboard-arrow-right' size={20} color='#077a15' style={{ alignSelf: 'center', left: 5 }} />
                    </RightItem> :
                    <RightItem>
                        <ItemText color='#077a15' >{district} / {street} / {number}</ItemText>
                    </RightItem>}
                </Item>
                <Item
                    justCont='space-between'
                    onPress={() => setModalVisible(true)}
                    style={{ borderBottomWidth: 0 }}
                >
                    <ItemText color='#000' >{optionSelect}</ItemText>
                    <RightItem>
                        <ItemText color='#077a15' >Trocar opção</ItemText>
                        <Icon name='keyboard-arrow-right' size={20} color='#077a15' style={{ alignSelf: 'center', left: 5 }} />
                    </RightItem>
                </Item>
                <Section>
                    <SectionText>Formas de pagamento</SectionText>
                </Section>
                {formPay.map((item, index) => (
                    <Item
                    key={index}
                    style={{ borderBottomWidth: index == 1 ? 0 : .5 }}
                    onPress={() => {
                        if (index == 0) {
                            setChangeVisible(true)
                        }
                        setActivePay(index)
                    }} >
                        <LeftItem>
                            <BoxExtra selected={activePay == index} ></BoxExtra>
                            <ItemText>{item}</ItemText>
                        </LeftItem>
                        {index == 0 && change_num != 0 && <ItemText color='#077a15' >Troco para: R$ {change_num.toFixed(2).replace('.', ',')}</ItemText>}
                        {index == 0 && noChange && <ItemText color='#077a15' >Sem troco</ItemText>}
                        {/* {index == 0 && <Icon name='keyboard-arrow-right' size={20} color='#077a15' style={{ alignSelf: 'center', left: 5 }} />} */}
                    </Item>
                ))}
                <Section>
                    <SectionText>Resumo do pedido</SectionText>
                </Section>
                <AreaInfo>
                    <TextInfo>SubTotal</TextInfo>
                    <TextInfo txtAlign='right' >R$ {total.toFixed(2).replace('.', ',')}</TextInfo>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo>Taxa de entrega</TextInfo>
                    <TextInfo>R$ {dlv_fee.toFixed(2).replace('.', ',')}</TextInfo>
                </AreaInfo>
                <AreaInfo style={{ borderBottomWidth: .5, borderColor: '#999' }} >
                    <TextInfo>Total</TextInfo>
                    <TextInfo>R$ {total_order.toFixed(2).replace('.', ',')}</TextInfo>
                </AreaInfo>
            </Scroll>
            <Footer>
                <ButtonFinish onPress={handleSend} >
                    <ButtonText>Enviar pedido</ButtonText>
                </ButtonFinish>
            </Footer>
            <ModalOptions
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                options={options}
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
            />
        </Page>
    );
}

Resume.navigationOptions = () => {
    return {
        headerTitle: 'Finalização'
    }
}

const mapStateToProps = (state) => {
    return {
        list_address: state.userReducer.list_address,
        selected: state.userReducer.selected,
        cityId: state.userReducer.cityId,
        total: state.requestReducer.total,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);