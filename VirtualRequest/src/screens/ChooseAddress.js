import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import uuid from 'uuid/v4';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

// Components:
import ModalQuestion from '../components/ChooseAddress/ModalQuestion';
import ModalDelete from '../components/ChooseAddress/ModalDelete';

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
    padding: 15px;
    border-bottom-width: .5px;
    border-color: #999;
`

const CenterItem = styled.View`
    flex: 1;
`

const RightItem = styled.View`
    justify-content: space-between
`

const ItemText = styled.Text`
    font-size: 16px;
    font-weight: ${props => props.weight || 'normal'};
    color: ${props => props.color || '#000'};
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const BoxExtra = styled.View`
    height: 24px;
    width: 24px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
    border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
    border-radius: ${props => props.radius || 12}px;
    margin-right: 15px;
    margin-left: 5px;
`

const ButtonAdd = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    border-top-width: .5px;
    border-bottom-width: .5px;
    border-color: #999;
    padding: 15px 20px;
    margin-top: 20px;
`

const ButtonEdit = styled.TouchableOpacity`
    flex-direction: row;
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
    const [ confAdrss, setConfAdrss ] = useState(false)
    const [ itemChos, setItemChos ] = useState({})
    const [ idxChos, setIdxChos ] = useState(0)

    let { list_address, setListAddress, address, setAddress, cityId, setCityId } = props
    
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

    // useEffect(() => {
    //     console.log(address)
    // }, [address])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
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
            <Scroll contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }} >
                {list_address.map((item, index) => (
                    <Item key={index} onPress={() => handleChoose(item, index)} activeOpacity={.6} >
                        <BoxExtra selected={item.id == selected} ></BoxExtra>
                        <CenterItem>
                            <ItemText mgBottom={3} weight='bold' >{item.name} {item.surname}</ItemText>
                            <ItemText mgBottom={3} >{item.city}</ItemText>
                            <ItemText mgBottom={3} >{item.district}</ItemText>
                            <ItemText mgBottom={3} >{item.street}</ItemText>
                            <ItemText mgBottom={3} >{item.number}</ItemText>
                        </CenterItem>
                        <RightItem>
                            <ButtonEdit onPress={() => {
                                setIdxChos(index)
                                setDeleteVisible(true)
                            }} style={{ alignSelf: 'flex-end' }} >
                                <>
                                <FontIcon name='trash-alt' color='#fe9601' size={20} style={{ marginHorizontal: 5 }} />
                                <ItemText color='#fe9601' >Excluir</ItemText>
                                </>
                            </ButtonEdit>

                            <ButtonEdit
                                onPress={() => nav('AddAddress', { editEnabled: true, item, index })}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                <>
                                <FontIcon name='edit' color='#fe9601' size={20} style={{ marginHorizontal: 5 }} />
                                <ItemText color='#fe9601' >Editar</ItemText>
                                </>
                            </ButtonEdit>
                        </RightItem>
                    </Item>
                ))}
                <ButtonAdd onPress={() => nav('AddAddress', { editEnabled: false })} underlayColor='#eee' >
                    <>
                    <FontIcon name='plus' size={20} color='#fe9601' />
                    <ItemText color='#fe9601' style={{ left: 20 }} >Adicionar novo endereço</ItemText>
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
        </Page>
    );
}

ChooseAddress.navigationOptions = () => {
    return {
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