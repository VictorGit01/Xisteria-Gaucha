import React, { useEffect, useState, useContext } from 'react'
import { SectionList } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import '../fixtimerbug'
import uuid from 'uuid/v4'

// Components:
import ModalAdd from '../components/Menu/ModalAdd'
import SectionHeaderMenu from '../components/Menu/SectionHeaderMenu'
import ListItemMenu from '../components/Menu/ListItemMenu'

// Contexts:
import MenuListContext from '../contexts/MenuListContext'

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
    // const [ menuList, setMenuList ] = useContext(MenuListContext)
    const [ menuList, setMenuList ] = useState([])
    const [ focusedInput, setFocusedInput ] = useState(false)
    const [ title, setTitle ] = useState('')
    // const [ idList, setIdList ] = useState([])
    const [ pos, setPos ] = useState(0)
    const [ list, setList ] = useState([])
    const [ copyList, setCopyList ] = useState([])
    

    let { navigation } = props
    let nav = navigation.navigate
    
    // let data = [{
    //     name: 'nome de teste',
    //     price: 'preço de teste'
    // }]
    let category = firebase.database().ref('category')
    // let id = title ? category.end : 'a'
    // let idList = []
    // let p = 0
    let objectList
    // let idList = list
    let idList = []
    let childList = []
    let listCopy = []
    let count = 0
    useEffect(() => {
        let listCTG = []
        // console.log(firebase.database().ref('category').key)

        firebase.database().ref('ctg').on('value', (snapshot) => {
            // console.log(snapshot.key)
            
            listCopy = []
            snapshot.forEach((childItem) => {
                let data = {}
                let dataCopy = { title: '', data: [] }
                let obj = childItem.val()
                let newObj = Object.values(obj)


                newObj.forEach((item, index, arr) => {
                    if (typeof item !== 'object') {
                        newObj.splice(index, 1)
                        // arr.pop()
                        /*
                        console.log('Itens que não são objetos')
                        console.log(item)
                        */
                    }
                })
                // console.log(newObj)
                let newDataVer = []
                let dataVer = []
                newObj.map((item, index) => {
                    dataVer.push(item)
                    if (item in dataVer) {
                        console.log(item)
                    } else {}
                })

                newObj.forEach((item) => {
                    let d = {
                        name: item.name,
                        description: item.description,
                        price: item.price
                    }
                    Object.assign(data, d)
                    // console.log(item)
                    /*
                    data.push({
                        name: item.name,
                        description: item.description,
                        price: item.price
                    })
                    */
                })
                console.log(data)
                dataCopy.data.push(data)
                if (dataCopy.title === childItem.val().title) {
                    // let data = []
                    // newObj.forEach((item) => {
                    //     data.push({
                    //         name: item.name,
                    //         description: item.description,
                    //         price: item.price
                    //     })
                    // })
                    // dataCopy.data.push(data)
                } else {
                    // let data_2 = []
                    // newObj.forEach((item) => {
                    //     data_2.push({
                    //         name: item.name,
                    //         description: item.description,
                    //         price: item.price
                    //     })
                    // })
                    // console.log(data_2)
                    /*
                    {
                        // name: newObj[0].name,
                        // description: newObj[0].description,
                        // price: newObj[0].price
                    }
                    */
                    
                    // dataCopy = { title: childItem.val().title, data: data_2, id: childItem.key }
                    // console.log(dataCopy)
                    
                }
                listCopy.push(dataCopy)
                // console.log(dataCopy.data)
                // console.log(newObj)
                /*
                newObj.forEach((item, index, arr) => {
                    data.push({
                        // name: newObj[index].name,
                        // description: newObj[index].description,
                        // price: newObj[index].price,
                        name: item.name,
                        description: item.description,
                        price: item.price
                    })
                })
                */


                // console.log(dataCopy)
                /*
                console.log(newObj.pop())
                console.log(newObj)
                */
                // console.log(dataCopy.title) 
            })
            
            
            // console.log(listCopy)
            setList(listCopy)
        })

        let category = firebase.database().ref().on('value', (snapshot) => {
            // console.log(snapshot.val())
            snapshot.forEach((childItem) => {
                // return childItem.key
            })
        })

        firebase.database().ref('category').on('value', (snapshot) => {
            // console.log(snapshot.val()) 
            snapshot.forEach((childItem) => {
                listCTG.push(childItem.key)
            })
            // console.log(listCTG)
        })

        // let dentro = firebase

        // console.log(title)

        // Ordenar pelo preço:
        firebase.database().ref(`category`).orderByChild('name').on('value', (snapshot) => {
            
            // console.log(snapshot.key)
            snapshot.forEach((childItem) => {
                // console.log(childItem.val().price)
                // console.log(childItem)
                /*
                console.log(snapshot.key)
                if (dataCopy.title === item) {
                    dataCopy.data.push({
                        name: childItem.val().name,
                        description: childItem.val().description,
                        price: childItem.val().price
                    })
                    // console.log(dataCopy.title)
                } else {
                    dataCopy = { title: item, data: [{
                        name: childItem.val().name,
                        description: childItem.val().description,
                        price: childItem.val().price
                    }] }
                    listCopy.push(dataCopy)   
                }
                */
            })
        })

        // console.log(listCopy)
        // setList(listCopy)

        firebase.database().ref('category').endAt().on('child_added', (snapshot) => {
            // console.log(snapshot.key)
        })
        idList = []
        // console.log(idList)
        let newData = []
        // console.log(firebase.database().ref())

        for (let p = 0; p < listCTG.length; p++) {
            firebase.database().ref(`category/${listCTG[p]}`).on('value', (snapshot) => {
                
                // data = []
                
                idList.push({
                    title: snapshot.key,
                    data: newData
                })
                
                // console.log(listCTG[p])
                snapshot.forEach((childItem) => {
                    // console.log(childItem.val())
                    // console.log(childItem.val())
                    childList.push({
                        id: childItem.key,
                        data: childItem.val()
                    })
                    /*
                    data.push({
                        name: childItem.val().name,
                        description: childItem.val().description,
                        price: childItem.val().price
                    })
                    */
                    /*
                    data.push({
                        name: childItem.val().name,
                        description: childItem.val().description,
                        price: childItem.val().price
                    })
                    */     
                })
                // console.log(childList)
                // console.log(data)
                // idList[p].data.push(data[p])
                // console.log(data)
            })
            // console.log(idList[p])
            // setList(idList)
            // console.log(data[p])
            // setCopyList(idList)
            
        }
        // console.log(copyList[2])
    }, [])
    
    /*
    useEffect(() => {
        console.log(title)
    }, [title])
    */
        
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
                        <ButtonSctFooter activeOpacity={.9} onPress={() => nav('InsertItems', { section: section })} >
                            <TextSctFooter>+</TextSctFooter>
                            <TextSctFooter>Adicionar itens</TextSctFooter>
                        </ButtonSctFooter>
                    </SectionFooterArea>
                )}
                keyExtractor={(item) => item.title}
            />
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Cardápio' //'Modificar Cardápio'
    }
}

export default Screen