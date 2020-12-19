import React, { useEffect, useState, useContext } from 'react'
import { NavigationEvents } from 'react-navigation'
import { View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import '../fixtimerbug'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NetInfo from '@react-native-community/netinfo';
import ButtonNoConnection from '../components/ButtonNoConnection';

// Components:
import LoadingPage from '../components/LoadingPage';
import ModalAdd from '../components/Menu/ModalAdd_2'
import SectionHeaderMenu from '../components/Menu/SectionHeaderMenu'
import ListItemMenu from '../components/Menu/ListItemMenu'

// Contexts:
import DataDetailsContext from '../contexts/DataDetailsContext'
import ListAddOnsContext from '../contexts/ListAddOnsContext'
import LoaderContext from '../contexts/LoaderContext'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`
// padding-horizontal: 10px;

const ListMenu = styled.SectionList`
    flex: 1;
    width: 100%;
    padding-horizontal: ${normalize(10)}px;
    margin-top: 20px;
`
// border: 1px solid #999;
// border-radius: 3px

const HeaderArea = styled.View` 
    width: 95%;
    justify-content: center;
    border-top-width: ${normalize(.5)}px;
    padding-top: 20px;
`
// height: ${normalize(80)}px;

const ButtonAddCtg = styled.TouchableHighlight`
    height: ${normalize(40)}px;
    width: ${normalize(220)}px;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(2)}px;
`

const AreaTextAdd = styled.View`
    height: ${normalize(80)}px;
    width: 100%;
    justify-content: center;
    padding-right: ${normalize(20)}px;
    padding-horizontal: ${normalize(10)}px;
`

const TextAddCtg = styled.Text`
    font-size: ${normalize(18)}px;
    color: ${props => props.color ? props.color : '#fff'};
    text-align: justify;
`

const SectionFooterArea = styled.View`
    width: 100%;
    justify-content: center;
    border: ${normalize(1)}px solid #999;
    border-top-width: 0px;
    border-bottom-left-radius: ${normalize(3)}px;
    border-bottom-right-radius: ${normalize(3)}px;
    margin-bottom: ${normalize(20)}px;
`
//padding-left: 15px;

const ButtonSctFooter = styled.TouchableOpacity`
    width: ${normalize(160)}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${normalize(15)}px; 
`
//width: 130px;
// padding-horizontal: 15px;
// padding-vertical: 20px;

const TextSctFooter = styled.Text`
    font-size: ${normalize(16)}px;
    color: #ff2626;
    text-decoration: underline;
`

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const Screen = (props) => {
    // const [ loaderVisible, setLoaderVisible ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ focusedInput, setFocusedInput ] = useState(false)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ list, setList ] = useState([])
    const [ dataDetails, setDataDetails ] = useContext(DataDetailsContext)
    const [ listAddOns, setListAddOns ] = useContext(ListAddOnsContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const posts = firebase.database().ref('posts')
    const currentCity = firebase.auth().currentUser
    // const cityId = firebase.auth().currentUser.uid

    let nav = props.navigation.navigate
    let titleList = []
    let copyList = []

    useEffect(() => {
        
        
        // firebase.database().ref('titleCTG').on('value', (snapshot) => {
        //     copyList = []
        //     // titleList = []
            
        //     snapshot.forEach((childItem) => {
        //         /*
        //         titleList.push({
        //             key: childItem.key,
        //             title: childItem.val().title
        //         })
        //         */
        //         copyList.push({
        //             key: childItem.key,
        //             title: childItem.val().title,
        //             data: []
        //         })
        //     })
        //     setList(copyList) 
        //     console.log(copyList) 
        // })
    }, [])

    function onScreen() {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getMenu()
            }
        })
    }

    function getMenu() {
        if (currentCity) {
            const cityId = currentCity.uid

            posts.child(cityId).orderByChild('title').on('value', snapshot => {
                let newList = []
                snapshot.forEach((childItem) => {
                    // console.log(childItem.val())
                    let newChildItem = JSON.parse(JSON.stringify(childItem.val()))
                    // childItem ? posts.child(cityId).child(childItem.key).child('id').set(childItem.key) : null
                    newChildItem['id'] = childItem.key
                    newChildItem.data = childItem.val().data ? Object.values(childItem.val().data) : []
                    // newChildItem.data = []
                    // console.log(newChildItem)
    
                    newList.push(newChildItem)
                    // newList.push(childItem.val())
                    // console.log(newChildItem)
                })
                setList(newList)
                endOfLoading()
                // console.log(newList)
            })
        }
    }

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    const clearData = () => {
        // let newData = JSON.parse(JSON.stringify(dataDetails))
        // // newData.id = ''
        // newData.name = ''
        // newData.description = ''
        // newData.price = ''
        // newData.image = null
        // setDataDetails(newData)
        // setListAddOns(null)
        // // console.log('Chamou função de limpar')
    }

    if (loading) {
        return (
            <>
                <NavigationEvents onWillFocus={onScreen} />
                <LoadingPage />
            </>
        );
    } else if (noConnection && !loading) {
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
            <NavigationEvents
                // onWillFocus={clearData}
                onWillFocus={onScreen}
            />
            <AreaTextAdd>
                <TextAddCtg color='#999' >Aqui você pode criar categorias, inserir itens, complementos e opcionais, definir disponibilidade e alterar preços.</TextAddCtg>
            </AreaTextAdd>
            
            <HeaderArea>
            {/* <TextAddCtg color='#000' >{list[0].data[0].name}</TextAddCtg> */}
                <ButtonAddCtg
                    activeOpacity={.9}
                    onPress={() => {
                        setModalVisible(true)
                        setFocusedInput(true)
                    }}
                    underlayColor='#e5921a'
                >
                    <>
                        <TextAddCtg>+</TextAddCtg>
                        <TextAddCtg>Adicionar categoria</TextAddCtg>
                    </>
                </ButtonAddCtg>
            </HeaderArea>
            <ModalAdd
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                loaderVisible={loaderVisible}
                setLoaderVisible={setLoaderVisible}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
            />
            {list && list.length ?
            <ListMenu
                // sections={listDetails}
                sections={list}
                renderSectionHeader={({section}) => <SectionHeaderMenu section={section} />}
                renderItem={({item, index, section}) => <ListItemMenu section={section} data={item} index={index} nav={nav} />}
                renderSectionFooter={({section}) => (
                    <SectionFooterArea>
                        <ButtonSctFooter activeOpacity={.7} onPress={() => nav('InsItemsTab', { section })} >
                            <TextSctFooter>+</TextSctFooter>
                            <TextSctFooter>Adicionar itens</TextSctFooter>
                        </ButtonSctFooter>
                    </SectionFooterArea>
                )}
                keyExtractor={(item) => item.id}
            /> :
            (
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <TextInfo weight='bold' >Não existem itens no cardápio</TextInfo>
                </View>
            )}
        </Page>
    )
}

Screen.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    return {
        headerTitle: 'Cardápio', //'Modificar Cardápio'
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
                hitSlop={{ right: normalize(30), left: normalize(30) }}
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

export default Screen