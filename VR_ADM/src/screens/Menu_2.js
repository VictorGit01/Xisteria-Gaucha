import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components/native'
// import RNFetchBlob from 'react-native-fetch-blob'
// const firebase = require('firebase')
// require('firebase/firestore')
import firebase from '../../firebase'

// Components:
import ModalAdd from '../components/Menu/ModalAdd_2'
import SectionHeaderMenu from '../components/Menu/SectionHeaderMenu'
import ListItemMenu from '../components/Menu/ListItemMenu'

// const Blob = RNFetchBlob.polyfill.Blob
// window.Blob = Blob
// const tempWindowXMLHttpRequest = window.XMLHttpRequest
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest



const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    padding-horizontal: 10px;
`

const ListMenu = styled.SectionList`
    flex: 1
    width: 100%;
`
// border: 1px solid #999;
// border-radius: 3px

const HeaderArea = styled.View`
    height: 80px;
    width: 100%;
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
`

const TextAddCtg = styled.Text`
    font-size: 18px;
    color: ${props => props.color ? props.color : '#fff'};
    text-align: justify
`

const SectionFooterArea = styled.View`
    height: 40px;
    width: 100%;
    justify-content: center;
    border: 1px solid #999;
    border-top-width: 0px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    
    margin-bottom: 10px;
`
//padding-left: 15px;

const ButtonSctFooter = styled.TouchableOpacity`
    height: 100%
    width: 160px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: 15px;
`
//width: 130px;

const TextSctFooter = styled.Text`
    font-size: 16px;
    color: #ff2626;
    text-decoration: underline;
`

const Screen = (props) => {
    const [ visibleModal, setVisibleModal ] = useState(false)
    const [ focusedInput, setFocusedInput ] = useState(false)
    const [ list, setList ] = useState(null)

    let nav = props.navigation.navigate
    let titleList = []
    let copyList = []

    
    // window.XMLHttpRequest = tempWindowXMLHttpRequest
    const getPosts = async () => {
        let posts = await firebase.database().ref('posts')

        posts.on('value', snapshot => {
            console.log(snapshot.val())
        })

        // const posts = await firebase.firestore().collection('posts')
        // let newList = []
        // posts
        // .get()
        // .then((querySnapshot) => {
        //     querySnapshot.docs.map(doc => {
        //         let post = doc.data()
        //         newList.push(post)
        //     })
        //     setList(newList)
        // }).catch((error) => {
        //     console.log('error', JSON.parse(JSON.stringify(error)))
        // })
    }

    useEffect(() => {
        getPosts()
        
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
        //     // console.log(copyList) 
        // })
    }, [])


    return (
        <Page>
            <AreaTextAdd>
                <TextAddCtg color='#999' >Aqui você pode criar categorias, inserir itens, complementos e opcionais, definir disponibilidade e alterar preços.</TextAddCtg>
            </AreaTextAdd>
            
            <HeaderArea>
            {/* <TextAddCtg color='#000' >{list[0].data[0].name}</TextAddCtg> */}
                <ButtonAddCtg
                    activeOpacity={.9}
                    onPress={() => {
                        setVisibleModal(true)
                        setFocusedInput(true)
                    }}
                >
                    <TextAddCtg>+</TextAddCtg>
                    <TextAddCtg>Adicionar categoria</TextAddCtg>
                </ButtonAddCtg>
            </HeaderArea>
            <ModalAdd
                visibleModal={visibleModal}
                setVisibleModal={setVisibleModal}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
            />
            {list &&
            <ListMenu
                // sections={listDetails}
                sections={list}
                renderSectionHeader={({section}) => <SectionHeaderMenu section={section} />}
                renderItem={({item}) => (
                    <>
                    {item.name && item.price &&
                    <ListItemMenu data={item} />}

                    </>
                )}
                renderSectionFooter={({section}) => (
                    <SectionFooterArea>
                        <ButtonSctFooter activeOpacity={.9} onPress={() => nav('InsItemsTab', { section: section })} >
                            <TextSctFooter>+</TextSctFooter>
                            <TextSctFooter>Adicionar itens</TextSctFooter>
                        </ButtonSctFooter>
                    </SectionFooterArea>
                )}
                keyExtractor={(item) => item.title}
            />}
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Cardápio' //'Modificar Cardápio'
    }
}

export default Screen