import React, { useEffect, useState } from 'react';
import { NavigationEvents } from 'react-navigation';
import { Dimensions } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../firebase';
import NetInfo from '@react-native-community/netinfo';

// Components:
import LoadingPage from '../components/LoadingPage';
import ButtonNoConnection from '../components/ButtonNoConnection';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Listing = styled.FlatList`
    width: 100%;
`

const Item = styled.TouchableHighlight`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
    padding: ${normalize(20)}px ${normalize(10)}px;
`

const ItemText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
`

const ButtonNoNet = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #000;
    border-radius: ${normalize(3)}px;
    padding-horizontal: ${normalize(20)}px;
`
// height: ${normalize(24)}px;

const TextButton = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: ${props => props.color || '#000'};
`
// font-size: ${props => props.size || normalize(72)}px;

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`
// font-size: ${normalize(72)}px;

const ItemTextArea = styled.View`
    flex: 1;
`

const RespText = styled.Text`
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
// height: 30px;
// font-size: 16px;
// border: 2px solid ${props => props.bdColor || '#daa520'};
// border-radius: 50px;
// padding-horizontal: 10px;

const TabBarBadge = styled.View`
    border-radius: ${normalize(50)}px;
    background-color: rgba(255, 0, 0, .9);
    justify-content: center;
    align-items: center;
    padding: ${normalize(1)}px ${normalize(5)}px;
`
// width: 20px;
// height: 20px;
// border-radius: 50px;

const TabBarCount = styled.Text`
    font-size: ${normalize(12)}px;
    color: #fff;
    text-align-vertical: center;
`

const Screen = (props) => {
    const [ list, setList ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ noConnection, setNoConnection ] = useState(false)

    const { navigation } = props
    const nav = navigation.navigate

    const currentCity = firebase.auth().currentUser
    // const cityId = firebase.auth().currentUser.uid
    const users = firebase.database().ref('users')

    // useEffect(() => {
        
    // }, [])

    function onScreen() {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getClientsInformation()
            }
        })
    }

    function getClientsInformation() {
        if (currentCity) {
            const cityId = currentCity.uid
            
            users.child(cityId).on('value', async snapshot => {
                let newList = []
    
                await snapshot.forEach(childItem => {
                    newList.push(childItem.val())
                })
                
                endOfLoading()
                setList(newList)
            })
        }
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    // useEffect(() => {
    //     // alert(normalize(18))
    //     console.log('-----------------CLIENTS_INICIOU-----------------')
        
    // }, [])

    function renderItem({ item, index }) {
        let full_name = `${item.name} ${item.surname}`

        return (
            <Item
                onPress={() => nav('InfoClient', { data: item })}
            >
                <>
                {/* <ItemTextArea style={{ marginRight: 20 }} > */}
                <ItemTextArea style={{ marginRight: normalize(20) }} >
                    <ItemText>{full_name}</ItemText>
                </ItemTextArea>
                {/* {item.count > 0 &&
                <TabBarBadge>
                    <TabBarCount>novo</TabBarCount>    
                </TabBarBadge>} */}
                {item.count > 0 &&
                <RespText color='red' bdColor='red' >novo</RespText>}
                </>
            </Item>
        )
    }
    
    if (loading) {
        return (
            <>
                <NavigationEvents onWillFocus={onScreen} />
                <LoadingPage />
            </>
        )
    } else if (!list.length) {
        return (
            <Page style={{ justifyContent: 'center' }} >
                <NavigationEvents onWillFocus={onScreen} />
                <TextInfo weight='bold' >Não existem clientes cadastrados</TextInfo>
            </Page>
        )
    } else if (noConnection) {
        return (
            <Page style={{ justifyContent: 'center', backgroundColor: '#fff' }} >
                <NavigationEvents onWillFocus={onScreen} />
                
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={onScreen} />
            </Page>
        )
    }

    return (
        <Page>
            <NavigationEvents onWillFocus={onScreen} />
            <Listing
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </Page>
    )
}

Screen.navigationOptions = ({ navigation }) => {
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `
    // width: 60px;

    return {
        headerTitle: 'Clientes',
        // headerLeft: () => (
        //     <ButtonIcon
        //         onPress={() => navigation.openDrawer()}
        //         activeOpacity={.7}
        //         hitSlop={{ right: 30 }}
        //     >
        //         {/* <Icon name='menu' size={25} color='#fff' /> */}
        //         <Icon name='menu' size={normalize(25)} color='#fff' />
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

        headerTitleAlign: 'center'
    }
}

export default Screen;