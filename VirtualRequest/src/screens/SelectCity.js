import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../../firebase';

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
`;

const Item = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding-horizontal: 15px;
    border-top-width: .5px;
    border-bottom-width: .5px;
    padding-vertical: 10px;
    margin-bottom: 30px;
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

const ItemText = styled.Text`
    font-size: ${props => props.size || 16}px;
    text-align: ${props => props.txtAlign || 'left'};
    color: ${props => props.color || '#555'};
`

const Footer = styled.View`
    height: 80px;
    width: 100%;
    justify-content: center;
    align-items: center;
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

const Input = styled.View`
    width: 90%;
    border-color: #077a15;
    background-color: transparent;
    border-width: 1px;
    border-radius: 5px;
    margin-top: 100px;
`

const SelectCity = (props) => {
    const [ selected, setSelected ] = useState({ value: null, index: 0 })
    const [ listCities, setListCities ] = useState([])

    const cities = firebase.database().ref('cities')

    const { navigation, cityId, setCityId, list_request, setListRequest } = props
    const nav = navigation.navigate

    // const list_cities = [
    //     {label: 'Tucumã', value: 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'},
    //     {label: 'Ourilândia', value: 'WKYkixbiH2SEzMe9SO2OCCZOXrA3'},
    // ]

    useEffect(() => {
        cities.on('value', snapshot => {
            let newList = []
            snapshot.forEach(childItem => {
                newList.push({
                    label: childItem.val().city,
                    value: childItem.val().id
                })
            })
            setListCities(newList)
        })
    }, [])

    function navToHome() {
        navigation.dispatch(StackActions.reset({
            index: 0,
            // key: 'HomeStack',
            actions: [
                NavigationActions.navigate({routeName: 'Home'})
            ]
        }))
    }

    const handleSend = () => {
        if (selected.index !== 0) {
            let listRequestCopy = Array.from(list_request)

            listRequestCopy.push({
                id: selected.value,
                data: []
            })
            
            setListRequest(listRequestCopy)
            setCityId(selected.value)
            navToHome()
        }
    }

    return (
        <Page>
            <Input>
                <RNPickerSelect
                    onValueChange={(value, index) => setSelected({ value, index })}
                    items={listCities}
                    placeholder={{ label: 'Selecione sua cidade', value: null, color: '#999' }}
                />
            </Input>
            {/* {list_cities.map((item, index) => (
                <Item key={index} onPress={() => setSelected(item.id)} >
                    <BoxExtra selected={selected == item.id} ></BoxExtra>
                    <ItemText>{item.city}</ItemText>
                </Item>
            ))} */}
            <Footer>
                <ButtonFinish onPress={handleSend} >
                    <ButtonText>Enviar pedido</ButtonText>
                </ButtonFinish>
            </Footer>
        </Page>
    );
}

const styles = StyleSheet.create({
    select_picker: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black'
    }
})

SelectCity.navigationOptions = () => {
    return {
        headerShown: false
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCityId: (cityId) => dispatch({type: 'SET_CITY_ID', payload: {cityId}}),
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity);