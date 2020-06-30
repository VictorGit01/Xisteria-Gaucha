import React, { useEffect, useState } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../firebase';

// Components:
import ModalSignOut from '../components/ProdSites/ModalSignOut';

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    flex: 1;
    width: 100%;
`

const Item = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: .5px;
    border-color: #999;
    padding: 10px;
    margin-top: 10px;
`

const CenterItem = styled.View`
    flex: 1;
    padding-horizontal: 10px;
`

const AreaInfo = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px 10px 0px;
`

const LeftItem = styled.View`
    width: 6%;
    align-items: center;
`

const ItemText = styled.Text`
    font-size: 16px;
    font-weight: ${props => props.weight || 'normal'};
    color: ${props => props.color || '#000'};
    margin-bottom: ${props => props.mgBottom || 0}px;
    text-align: ${props => props.txtAlign || 'left'};
    flex: 1;
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

const ButtonSignUp = styled.TouchableHighlight`
    width: 100%;
    height: 40px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    margin-vertical: 80px;
    border-radius: 3px;
`

const ButtonAdd = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    align-items: center;
    border-top-width: .5px;
    border-bottom-width: .5px;
    border-color: #fe9601;
    padding: 15px 20px;
    margin-top: 20px;
    margin-bottom: 80px;
`

const ButtonText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
`

const ProductionSites = (props) => {
    const [ list, setList ] = useState(null)
    const [ signOutVisible, setSignOutVisible ] = useState(false)
    
    let { navigation } = props
    let nav = navigation.navigate
    const cities = firebase.database().ref('cities')
    const cityId = firebase.auth().currentUser.uid

    useEffect(() => {
        cities.on('value', snapshot => {
            let listCopy = []
            snapshot.forEach(childItem => {
                let childCopy = JSON.parse(JSON.stringify(childItem.val()))

                // childCopy
                listCopy.push(childCopy)
            })
            setList(listCopy)
            // console.log(listCopy)
        })
        // console.log(cityId)
    }, [])

    function goToScreen() {
        navigation.dispatch(StackActions.reset({
            index: 0,
            // key: 'RegisterCity',
            actions: [
                NavigationActions.navigate({routeName: 'RegisterCity'})
            ]
        }))
    }

    return (
        <Page>
            <Scroll>
                {list && list.map((item, index) => (
                    <Item
                        key={index}
                    >
                        <LeftItem>
                            {/* {cityId == item.id && <FontIcon name='map-marker-alt' size={20} color='#077a15' />} */}
                            <Icon name={cityId == item.id ? 'location-on' : 'location-off'} size={20} color='#077a15' />
                        </LeftItem>
                        <CenterItem>
                            <AreaInfo>
                                <ItemText weight='bold' >Cidade</ItemText>
                                <ItemText txtAlign='right' >{item.city}</ItemText>
                            </AreaInfo>
                            <AreaInfo>
                                <ItemText weight='bold' >Bairro</ItemText>
                                <ItemText txtAlign='right' >{item.district}</ItemText>
                            </AreaInfo>
                            <AreaInfo>
                                <ItemText weight='bold' >Endereço</ItemText>
                                <ItemText txtAlign='right' >{item.address}</ItemText>
                            </AreaInfo>
                            <AreaInfo>
                                <ItemText weight='bold' >Número</ItemText>
                                <ItemText txtAlign='right' >{item.number}</ItemText>
                            </AreaInfo>
                            <AreaInfo>
                                <ItemText weight='bold' >Telefones</ItemText>
                                
                                {item.phone1 && !item.phone2 && <ItemText txtAlign='right' >({item.ddd1}) {item.phone1}</ItemText>}
                                {item.phone2 && !item.phone1 && <ItemText txtAlign='right' >({item.ddd2}) {item.phone2}</ItemText>}
                                {item.phone1 && item.phone2 && <ItemText txtAlign='right' >({item.ddd1}) {item.phone1} /{'\n'} ({item.ddd2}) {item.phone2}</ItemText>}
                            </AreaInfo>
                            <AreaInfo>
                                <ItemText weight='bold' >E-mail</ItemText>
                                <ItemText txtAlign='right' >{item.email}</ItemText>
                            </AreaInfo>
                        </CenterItem>
                    </Item>
                ))}
                <ButtonAdd onPress={() => setSignOutVisible(true)} underlayColor='#eee' >
                    <>
                    <FontIcon name='plus' size={15} color='#fe9601' />
                    <ItemText color='#fe9601' style={{ left: 20 }} >Adicionar nova cidade</ItemText>
                    </>
                </ButtonAdd>
            </Scroll>
            <ModalSignOut
                modalVisible={signOutVisible}
                setModalVisible={setSignOutVisible}
                goToScreen={goToScreen}
            />
        </Page>
    )
}

ProductionSites.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    return {
        headerTitle: 'Locais de produção',
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

export default ProductionSites;