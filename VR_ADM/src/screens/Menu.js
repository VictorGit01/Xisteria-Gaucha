import React, { useEffect, useState, useContext } from 'react'
import { NavigationEvents } from 'react-navigation'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import '../fixtimerbug'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Components:
import ModalAdd from '../components/Menu/ModalAdd_2'
import SectionHeaderMenu from '../components/Menu/SectionHeaderMenu'
import ListItemMenu from '../components/Menu/ListItemMenu'

// Contexts:
import DataDetailsContext from '../contexts/DataDetailsContext'
import ListAddOnsContext from '../contexts/ListAddOnsContext'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    
`
// padding-horizontal: 10px;

const ListMenu = styled.SectionList`
    flex: 1
    width: 100%;
    padding-horizontal: 10px;
`
// border: 1px solid #999;
// border-radius: 3px

const HeaderArea = styled.View`
    height: 80px;
    width: 95%;
    justify-content: center;
    border-top-width: .5px;
`

const ButtonAddCtg = styled.TouchableOpacity`
    height: 40px;
    width: 220px;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fe9601;
    border-radius: 2px;
`

const AreaTextAdd = styled.View`
    height: 80px;
    width: 100%;
    justify-content: center;
    padding-right: 20px
    padding-horizontal: 10px;
`

const TextAddCtg = styled.Text`
    font-size: 18px;
    color: ${props => props.color ? props.color : '#fff'};
    text-align: justify
`

const SectionFooterArea = styled.View`
    width: 100%;
    justify-content: center;
    border: 1px solid #999;
    border-top-width: 0px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    
    margin-bottom: 20px;
`
//padding-left: 15px;

const ButtonSctFooter = styled.TouchableOpacity`
    width: 160px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px; 
`
//width: 130px;
// padding-horizontal: 15px;
// padding-vertical: 20px;

const TextSctFooter = styled.Text`
    font-size: 16px;
    color: #ff2626;
    text-decoration: underline;
`

const Screen = (props) => {
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ focusedInput, setFocusedInput ] = useState(false)
    const [ list, setList ] = useState(null)
    const [ dataDetails, setDataDetails ] = useContext(DataDetailsContext)
    const [ listAddOns, setListAddOns ] = useContext(ListAddOnsContext)

    const posts = firebase.database().ref('posts')
    const cityId = firebase.auth().currentUser.uid

    let nav = props.navigation.navigate
    let titleList = []
    let copyList = []

    useEffect(() => {
        posts.child(cityId).on('value', snapshot => {
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
            // console.log(newList)
        })
        
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

    const clear = () => {
        let newData = JSON.parse(JSON.stringify(dataDetails))
        // newData.id = ''
        newData.name = ''
        newData.description = ''
        newData.price = ''
        newData.image = null
        setDataDetails(newData)
        setListAddOns(null)
        // console.log('Chamou função de limpar')
    }


    return (
        <Page>
            <NavigationEvents
                onWillFocus={clear}
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
                >
                    <TextAddCtg>+</TextAddCtg>
                    <TextAddCtg>Adicionar categoria</TextAddCtg>
                </ButtonAddCtg>
            </HeaderArea>
            <ModalAdd
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
            />
            {list &&
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
            />}
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

export default Screen