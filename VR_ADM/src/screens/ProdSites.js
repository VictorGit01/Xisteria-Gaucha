import React, { useEffect, useState } from 'react';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import { RectButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../firebase';
import NetInfo from '@react-native-community/netinfo';

// Components:
import LoadingPage from '../components/LoadingPage';
import ModalSignOut from '../components/ProdSites/ModalSignOut';
import ButtonNoConnection from '../components/ButtonNoConnection';

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
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
    padding: ${normalize(10)}px;
    margin-top: ${normalize(10)}px;
`

const CenterItem = styled.View`
    flex: 1;
    padding-horizontal: ${normalize(10)}px;
`

const AreaInfo = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px ${normalize(10)}px 0px;
`

const LeftItem = styled.View`
    width: 6%;
    align-items: center;
`

const ItemText = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: ${props => props.color || '#000'};
    margin-bottom: ${props => props.mgBottom || 0}px;
    text-align: ${props => props.txtAlign || 'left'};
    flex: 1;
`

// const BoxExtra = styled.View`
//     height: 24px;
//     width: 24px;
//     justify-content: center;
//     align-items: center;
//     background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
//     border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
//     border-radius: ${props => props.radius || 12}px;
//     margin-right: 15px;
//     margin-left: 5px;
// `

// const ButtonSignUp = styled.TouchableHighlight`
//     width: 100%;
//     height: 40px;
//     justify-content: center;
//     align-items: center;
//     background-color: #fe9601;
//     margin-vertical: 80px;
//     border-radius: 3px;
// `

const ButtonAdd = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    align-items: center;
    border-top-width: ${normalize(.5)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #fe9601;
    padding: ${normalize(15)}px ${normalize(20)}px;
    margin-top: ${normalize(20)}px;
    margin-bottom: ${normalize(80)}px;
`

// const ButtonText = styled.Text`
//     font-size: 18px;
//     font-weight: bold;
//     color: ${props => props.color || '#fff'};
// `

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const ProductionSites = (props) => {
    const [ deviceId, setDeviceId ] = useState('')
    const [ list, setList ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ signOutVisible, setSignOutVisible ] = useState(false)
    const [ cityId, setCityId ] = useState('')
    
    let { navigation } = props
    let nav = navigation.navigate
    const cities = firebase.database().ref('cities')
    const currentCity = firebase.auth().currentUser
    // const cityId = currentCity.uid

    useEffect(() => {
        AsyncStorage.getItem('deviceId')
            .then(id => setDeviceId(id))
    }, [])

    useEffect(() => {
        if (currentCity) {
            setCityId(currentCity.uid)
        }
    }, [])

    function onScreen() {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getProductionSites()
            }
        })
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function getProductionSites() {
        cities.on('value', snapshot => {
            let listCopy = []
            snapshot.forEach(childItem => {
                let childCopy = JSON.parse(JSON.stringify(childItem.val()))

                // childCopy
                listCopy.push(childCopy)
            })
            setList(listCopy)
            endOfLoading()
            // console.log(listCopy)
        })
        // console.log(cityId)
    }

    function goToScreen() {
        if (currentCity) {
            // let cityId = currentCity.uid
            cities.child(cityId).child('devices').child(deviceId).child('logged').set(false)
            .then(() => {
                setTimeout(() => {
                    
                    navNow()
                }, 1500)
            })
            .catch(error => {
                setLoaderVisible(false)
                toastMsg(`${error.code} - ${error.message}`)
                console.log(error)
            })
    
            function navNow() {
                navigation.dispatch(StackActions.reset({
                    index: 0,
                    // key: 'RegisterCity',
                    actions: [
                        NavigationActions.navigate({routeName: 'RegisterCity'})
                    ]
                }))
            }
        }
        
    }

    if (loading) {
        return (
            <>
                <NavigationEvents onWillFocus={onScreen} />
                <LoadingPage />
            </>
        );
    } else if (noConnection) {
        return (
            <Page style={{ justifyContent: 'center' }} >
                <NavigationEvents onWillFocus={onScreen} />
                
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={onScreen} />
            </Page>
        )
    }

    return (
        <Page>
            <Scroll>
                {list && list.map((item, index) => {
                    // let cityId = currentCity ? currentCity.uid : ''

                    return (
                        <Item
                            key={index}
                        >
                            <LeftItem>
                                {/* {cityId == item.id && <FontIcon name='map-marker-alt' size={20} color='#077a15' />} */}
                                <Icon name={cityId == item.id ? 'location-on' : 'location-off'} size={normalize(20)} color='#077a15' />
                                {/* <Icon name={cityId == item.id ? 'location-on' : 'location-off'} size={20} color='#077a15' /> */}
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
                    )
                })}
                <ButtonAdd
                    // onPress={() => setSignOutVisible(true)}
                    onPress={() => nav('RegisterCity', { enableKey: true })}
                    underlayColor='#eee'
                >
                    <>
                    {/* <FontIcon name='plus' size={15} color='#fe9601' /> */}
                    <FontIcon name='plus' size={normalize(15)} color='#fe9601' />
                    {/* <ItemText color='#fe9601' style={{ left: 20 }} >Adicionar nova cidade</ItemText> */}
                    <ItemText color='#fe9601' style={{ left: normalize(20) }} >Adicionar nova cidade</ItemText>
                    </>
                </ButtonAdd>
            </Scroll>
            <ModalSignOut
                modalVisible={signOutVisible}
                setModalVisible={setSignOutVisible}
                goToScreen={goToScreen}
                cityId={cityId}
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
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         <Icon name='menu' size={25} color='#fff' />
        //     </ButtonIcon>
        // )
        headerLeft: () => (
            <RectButton
                onPress={() => navigation.openDrawer()}
                style={{ 
                    padding: normalize(8), 
                    marginHorizontal: normalize(10), 
                    borderRadius: normalize(50),
                }}
                hitSlop={{ right: 30, left: 30 }}
            >
                <Icon name='menu' size={normalize(25)} color='#fff' />
            </RectButton>
        ),

        headerTitleContainerStyle: {
            width: '63%',
            position: 'relative',
            justifyContent: 'center',
        },

        headerTitleAlign: 'center',
    }
}

export default ProductionSites;