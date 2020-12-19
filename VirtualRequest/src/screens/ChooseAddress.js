import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import uuid from 'uuid/v4';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../firebase';
import AsyncStorage from '@react-native-community/async-storage';

// Components:
import ModalQuestion from '../components/ChooseAddress/ModalQuestion';
import ModalDelete from '../components/ChooseAddress/ModalDelete';
import ModalInfo from '../components/ModalInfo';
import Header from '../components/Header';

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Item = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: ${normalize(15)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
`

const CenterItem = styled.View`
    flex: 1;
`

const RightItem = styled.View`
    justify-content: space-between
`

const ItemText = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: ${props => props.color || '#000'};
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const BoxExtra = styled.View`
    height: ${normalize(24)}px;
    width: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
    border: ${normalize(5)}px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${props => props.radius || normalize(12)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const ButtonAdd = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    border-top-width: ${normalize(.5)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
    padding: ${normalize(15)}px ${normalize(20)}px;
    margin-top: ${normalize(20)}px;
`

const ButtonEdit = styled.TouchableOpacity`
    flex-direction: row;
`

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    text-align: center;
    color: #999;
    margin-top: ${normalize(50)}px;
    margin-bottom: ${normalize(30)}px;
`

const ChooseAddress = (props) => {
    const [ list, setList ] = useState([
        {
            id: uuid(),
            name: 'Nelson Victor',
            address: 'Bairro das flores / Rua Altamira / nº 3',
            city: 'Tucumã',
        },
    ]);
    const [ selected, setSelected ] = useState(props.selected);
    const [ questVisible, setQuestVisible ] = useState(false)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ infoVisible, setInfoVisible ] = useState(false)
    const [ confAdrss, setConfAdrss ] = useState(false)
    const [ itemChos, setItemChos ] = useState({})
    const [ idxChos, setIdxChos ] = useState(0)
    const [ emptyList, setEmptyList ] = useState([])

    const users = firebase.database().ref('users')

    const { list_address, setListAddress, address, setAddress, cityId, setCityId } = props
    
    // useEffect(() => {
    //     setListAddress([])
    // }, [])

    // useEffect(() => {
    //     console.log(list_address)
    // }, [list_address])

    const { navigation } = props;
    const params = navigation.state.params
    const nav = navigation.navigate
    const goBack = navigation.goBack
    const pop = navigation.pop

    useEffect(() => {
        console.log('-----------ENTRANDO EM CHOOSE_ADDRESS-----------')
        console.log('-----------BEFORE:-----------')
        console.log('-----------ADDRESS:-----------')
        console.log(address)
        console.log('-----------LIST_ADDRESS:-----------')
        console.log(list_address)
        console.log('-----------SELECTED:-----------')
        console.log(props.selected)

        // let genId;

        for (let pos = 0; pos < 3; pos++) {
            let genId = uuid();

            console.log(genId);
        }
        

        // setSelected('')
        // props.setSelected('')
        // setAddress({})
        // setListAddress([])
        if (list_address && list_address.length === 0) {
            AsyncStorage.getItem('deviceId').then(deviceId => {
                // console.log(deviceId)

                // users.child(cityId).child(deviceId).on('value', snapshot => {
                //     console.log('-----------DENTRO DE USERS-----------')
                //     // console.log(snapshot.val())
                //     let addressCopy = snapshot.val()
                //     let listAddressCopy = []
                //     // let idCopy = snapshot.val().id
                //     let idCopy = uuid()
                //     listAddressCopy.push(addressCopy)

                //     delete addressCopy.count
                //     delete addressCopy.orderQtt
                //     delete addressCopy.token

                //     addressCopy.idCity = cityId
                //     addressCopy.id = idCopy

                //     setAddress(addressCopy)
                //     setListAddress(listAddressCopy)
                //     setSelected(idCopy)
                //     props.setSelected(idCopy)

                //     console.log('-----------AFTER:-----------')
                //     console.log('-----------ADDRESS:-----------')
                //     console.log(addressCopy)
                //     console.log('-----------LIST_ADDRESS:-----------')
                //     console.log(listAddressCopy)
                //     console.log('-----------SELECTED:-----------')
                //     console.log(idCopy)
                // })



                users.on('value', snapshot => {
                    let addressCheckList = []
                    
                    snapshot.forEach(childItem => {
                        // Checagem de endereços que são correspondentes ao id do dispositivo (deviceId):
                        if (deviceId in childItem.val()) {
                            let newId = uuid()
                            // let childItemCopy = childItem.val()
                            let addressCopy = childItem.val()[deviceId]
                            // let listAddressCopy = []
                            // let idCopy = snapshot.val().id
                            // listAddressCopy.push(addressCopy)
                            delete addressCopy.count
                            delete addressCopy.orderQtt
                            delete addressCopy.token
    
                            addressCopy.id = newId
                            // addressCopy.idCity = childItem.key == cityId ? cityId : childItem.key
                            addressCopy.idCity = childItem.key
    
                            setAddress(addressCopy)
                            if (childItem.key === cityId) {
                                setSelected(newId)
                                props.setSelected(newId)
                            }
    
                            addressCheckList = [ ...addressCheckList, addressCopy ]
                        }
                    })
    
                    setListAddress(addressCheckList)
                    console.log(addressCheckList)
                })
            })
        }
    }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180)
        )  
    }

    // function handleAdd() {
    //     let listCopy = [ ...list, {
    //         id: uuid(),
    //         name: 'Nelson Victor',
    //         address: 'Bairro das flores / Rua Altamira / nº 3',
    //         city: 'Tucumã',
    //     } ]

    //     setList(listCopy)
    // }

    function handleDelete(index) {
        let listCopy = Array.from(list_address)
        if (selected == list_address[index].id) {
            setSelected('')
            props.setSelected('')
            setAddress({})
        }
        listCopy.splice(index, 1)
        setListAddress(listCopy)
        toastMsg('Endereço exluído.')
    }

    function selectAddress(item, index) {
        setSelected(item.id)
        props.setSelected(item.id)
        setAddress(list_address[index])
        setCityId(item.idCity)
    }

    function handleChoose(item, index) {
        setItemChos(item)
        setIdxChos(index)

        // console.log('itemChos')
        // console.log(itemChos)
        // console.log(`idxChos: ${idxChos}`)
        
        if (params.resume && item.idCity !== cityId) {
            // pop(3)
            setQuestVisible(true)
        } else {
            selectAddress(item, index)
            goBack()
        }
    }

    return (
        <Page>
            <Header title='Escolha um endereço' navigation={navigation} />
            <Scroll contentContainerStyle={{ alignItems: 'center', paddingBottom: normalize(80) }} >
                {list_address.length ? list_address.map((item, index) => (
                    <Item key={index} onPress={() => handleChoose(item, index)} activeOpacity={.6} >
                        <BoxExtra selected={item.id == selected} ></BoxExtra>
                        <CenterItem>
                            <ItemText mgBottom={normalize(3)} weight='bold' >{item.name + ' ' + item.surname}</ItemText>
                            <ItemText mgBottom={normalize(3)} >{item.city}</ItemText>
                            <ItemText mgBottom={normalize(3)} >{item.district}</ItemText>
                            <ItemText mgBottom={normalize(3)} >{item.street}</ItemText>
                            {(item.landmark && item.landmark.length) ? <ItemText mgBottom={normalize(3)} >{item.landmark}</ItemText> : null}
                            <ItemText mgBottom={normalize(3)} >{item.number}</ItemText>
                        </CenterItem>
                        <RightItem>
                            <ButtonEdit onPress={() => {
                                // setIdxChos(index)
                                // setDeleteVisible(true)
                                if (list_address.length > 1) {
                                    setIdxChos(index)
                                    setDeleteVisible(true)
                                } else {
                                    setInfoVisible(true)
                                }
                            }} 
                            style={{ alignSelf: 'flex-end' }}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} >
                                <>
                                <FontIcon name='trash-alt' color='#fe9601' size={normalize(20)} style={{ marginHorizontal: normalize(5) }} />
                                <ItemText color='#fe9601' >Excluir</ItemText>
                                </>
                            </ButtonEdit>

                            <ButtonEdit
                                onPress={() => nav('AddAddress', { editEnabled: true, item, index })}
                                style={{ alignSelf: 'flex-end' }}
                                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                            >
                                <>
                                <FontIcon name='edit' color='#fe9601' size={normalize(20)} style={{ marginHorizontal: normalize(5) }} />
                                <ItemText color='#fe9601' >Editar</ItemText>
                                </>
                            </ButtonEdit>
                        </RightItem>
                    </Item>
                )) 
                : 
                <TextInfo>
                    Você ainda não possui nenhum endereço cadastrado.
                </TextInfo>}
                <ButtonAdd onPress={() => nav('AddAddress', { editEnabled: false })} underlayColor='rgba(0, 0, 0, .03)' >
                    <>
                    <FontIcon name='plus' size={normalize(20)} color='#fe9601' />
                    <ItemText color='#fe9601' style={{ left: normalize(20) }} >Adicionar novo endereço</ItemText>
                    </>
                </ButtonAdd>
            </Scroll>
            <ModalQuestion
                modalVisible={questVisible}
                setModalVisible={setQuestVisible}
                itemChos={itemChos}
                selectAddress={selectAddress}
                idxChos={idxChos}
                pop={pop}
            />
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                handleDelete={handleDelete}
                idxChos={idxChos}
            />
            <ModalInfo
                modalVisible={infoVisible}
                setModalVisible={setInfoVisible}
                title='Excluir Endereço'
                text='Você não pode excluir o último endereço.'
            />
        </Page>
    );
}

ChooseAddress.navigationOptions = () => {
    return {
        headerShown: false,
        headerTitle: 'Escolha um endereço'
    }
}

const mapStateToProps = (state) => {
    return {
        list_address: state.userReducer.list_address,
        address: state.userReducer.address,
        selected: state.userReducer.selected,
        cityId: state.userReducer.cityId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListAddress: (list_address) => dispatch({type: 'SET_LIST_ADDRESS', payload: {list_address}}),
        setAddress: (address) => dispatch({type: 'SET_ADDRESS', payload: {address}}),
        setSelected: (selected) => dispatch({type: 'SET_SELECTED', payload: {selected}}),
        setCityId: (cityId) => dispatch({type: 'SET_CITY_ID', payload: {cityId}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseAddress);