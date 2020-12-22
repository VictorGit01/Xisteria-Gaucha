import React, { useEffect, useState, useContext } from 'react'
import { ToastAndroid } from 'react-native'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from '../../firebase'
import uuid from 'uuid/v4'

// Contexts:
import DataDetailsContext from '../contexts/DataDetailsContext'
import ListAddOnsContext from '../contexts/ListAddOnsContext'
import LoaderContext from '../contexts/LoaderContext'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    height: ${normalize(50)}px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
    padding-left: ${normalize(20)}px;
`

const HeaderTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #999;
`

const TopMiddleArea = styled.View`
    min-height: ${normalize(450)}px;
    width: 100%;
    align-items: center;
`

const Title = styled.Text`
    width: 100%
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #333;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
`

const Item = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    align-items: center;
    padding: ${normalize(15)}px ${normalize(10)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
`

const BoxSquare = styled.View`
    height: ${normalize(24)}px;
    width: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ddd'};
    border: ${normalize(5)}px solid ${props => props.selected ? '#fe9601' : '#ddd'};
    border-radius: ${normalize(3)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const ItemText = styled.Text`
    font-size: ${normalize(18)}px;
`

const ButtonArea = styled.View`
    height: ${normalize(80)}px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top-width: ${normalize(.5)}px;
    padding: ${normalize(20)}px;
`
// height: ${normalize(40)}px;
// width: 90%;
// flex-direction: row;
// justify-content: space-between;
// align-items: center;
// margin-top: ${normalize(20)}px;

const ButtonChoose = styled.TouchableHighlight`
    height: 100%;
    width: 45%;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor || '#fe9601'};
    border: ${normalize(1)}px solid #fe9601;
    border-radius: ${normalize(3)}px;
`

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    color: ${props => props.color || '#fff'};
`

const Screen = (props) => {
    const [ dataDetails, setDataDetails ] = useContext(DataDetailsContext)
    const [ listAddOns, setListAddOns ] = useContext(ListAddOnsContext)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    // const [ days, setDays ] = useState([
    //     {id: 0, name: 'Domingo', active: true},
    //     {id: 1, name: 'Segunda', active: true},
    //     {id: 2, name: 'Terça', active: true},
    //     {id: 3, name: 'Quarta', active: true},
    //     {id: 4, name: 'Quinta', active: true},
    //     {id: 5, name: 'Sexta', active: true},
    //     {id: 6, name: 'Sábado', active: true},
    // ])
    const [ days, setDays ] = useState([ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ])
    const [ selectedDays, setSelectedDays ] = useState([])

    const posts = firebase.database().ref('posts')
    const img_posts = firebase.storage().ref().child('posts')
    const cityId = firebase.auth().currentUser.uid

    let { navigation } = props
    let params = navigation.state.params
    let editEnabled = params.editEnabled
    let dataId = params.dataId
    let dataImg = params.dataImg
    // let dataSame = params.data.same
    let data = params.data
    let goBack = navigation.goBack
    let nav = navigation.navigate

    let daysCopy = JSON.parse(JSON.stringify(days))
    let post_id = params.section.id

    useEffect(() => {
        // console.log(navigation.pop(1))
        // if (editEnabled) {
        //     setDays(dataDetails.days)
        // }
    }, [dataDetails])

    // useEffect(() => {
    //     console.log(selectedDays)
    // }, [selectedDays])

    useEffect(() => {
        console.log(dataDetails)
        if (editEnabled) {
            // setDays(dataDetails.days)
            let filteredDaysIndex = dataDetails.days.map((x, y, a) => { return days.indexOf(x) })
            setSelectedDays(filteredDaysIndex)
            // console.log(selectedDays)
        } else {
            let allDayIndxs = days.map((item, index) => {return index})
            setSelectedDays(allDayIndxs)
        }
    }, [dataDetails])

    // useEffect(() => {
    //     if (editEnabled) {
    //         // console.log(data)
    //         firebase.storage().ref().child('posts').listAll().then(snapshot => {
    //             snapshot.items.forEach((childItem) => {
    //                 console.log(childItem.name)
    //             })
    //         })
    //     }
    // }, [])
    
    function voltar() {
        // let newPost = JSON.parse(JSON.stringify(params.section))
        // // let id = dataDetails.id
        // let newData = Object.assign({}, newPost.data)
        // // let otherNewData = {...newData}

        // // console.log(otherNewData)
        // newPost.data = newData
        // // console.log(newPost)
        // let old_id = ''
        // posts.child(post_id).child('data').child(dataId).on('value', snapshot => {
        //     old_id = snapshot.val().image.uri
        // })
        // console.log(listAddOns)
        

        let listImg = []

        // firebase.storage().ref().child('posts').listAll().then(snapshot => {
        //     snapshot.items.forEach((childItem) => {
        //         // listImg.push(childItem.name)
        //         console.log(childItem.storage.ref())
        //     })
        //     // console.log(listImg.includes(`${dataId}.jpg`))
        // })
    }

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    const saveAddOns = () => {
        let addOns = firebase.database().ref('add-ons')
        let data_id = dataDetails.id
        
        listAddOns.map((itemMap, indexMap) => {
            if (itemMap.must == false) {
                delete listAddOns[indexMap].must
            } else if (itemMap.minQtt > 0 && itemMap.must == false) {
                listAddOns[indexMap].must = true
            }
            if (itemMap.multItem == false || itemMap.maxQtt == 1) {
                delete listAddOns[indexMap].multItem
            }
        })

        addOns.child(cityId).child(data_id).set(listAddOns)
        .then((resp) => {
            setLoaderVisible(false)
            navigation.pop(1)
            toastMsg('Item salvo com sucesso!')
            // dataDetailsCopy.id = uuid()
            // setDataDetails(dataDetailsCopy)
            // console.log('Finalizado, id:')
            // console.log(dataDetails.id)
        })
        .catch((error) => {
            setLoaderVisible(false)
            console.log(error)
        })
    }

    // const saveData = () => {
    //     dataDetails.image = dataDetails.image ? true : false
    //     dataDetails.add_ons = listAddOns ? true : false
    //     setDataDetails(dataDetails)
    //     let id = dataDetails.id
        
    //     posts.child(post_id).child('data').child(id).set(dataDetails)
    //     .then(() => {
    //         if (listAddOns) {
    //             saveAddOns()
    //         } else {
    //             setLoaderVisible(false)
    //             toastMsg('Item salvo com sucesso!')
    //         }
    //     })
    //     .catch((error) => {
    //         setLoaderVisible(false)
    //         console.log(error)
    //     })
    //     // newPost.data.push(dataDetails)
    // }

    const savePost = () => {
        // let newPost = JSON.parse(JSON.stringify(params.section))
        // let newData = Object.assign({}, newPost.data)
        let id = dataDetails.id
        let selectedDaysSorted = selectedDays.sort()
        let filteredDays = selectedDaysSorted.map((item) => { return days[item] })

        // newPost.data = newData
        // dataDetails.image = dataDetails.image ? true : false
        dataDetails.add_ons = listAddOns && listAddOns.length > 0 ? true : false
        // dataDetails.days = days
        dataDetails.days = filteredDays
        setDataDetails(dataDetails)
        
        posts.child(cityId).child(post_id).child('data').child(id).set(dataDetails)
        .then((resp) => {
            // alert('Item criado com sucesso!')
            // saveData()
            if (listAddOns) {
                saveAddOns()
            } else {
                setLoaderVisible(false)
                navigation.pop(1)
                toastMsg('Item salvo com sucesso!')
            }
            // console.log(newPost)
        })
        .catch((error) => {
            setLoaderVisible(false)
            console.log(error)
        })
    }

    const saveImage = () => {
        setLoaderVisible(true)
        if (dataDetails.image) {
            let data_id = dataDetails.id
            let listImg = []
            // firebase.storage().ref().child('posts').listAll().then(snapshot => {
            //     snapshot.items.forEach((childItem) => {
            //         listImg.push(childItem.name)
            //     })

            let old_uri = ''
            posts.child(cityId).child(post_id).child('data').child(data_id).on('value', snapshot => {
                let dataCopy = snapshot.val() ? JSON.parse(JSON.stringify(snapshot.val())) : {}
                if (dataCopy.image) {
                    old_uri = snapshot.val().image.uri
                }
                // if (!listImg.includes(`${data_id}.jpg`)) {
                    
            })

            console.log('Antiga URI')
            console.log(old_uri)

            console.log('Nova URI')
            console.log(dataDetails.image.uri)

            if (old_uri !== dataDetails.image.uri) {
                let uri = dataDetails.image.uri.replace('file://', '')
                let image = img_posts.child(cityId).child('items').child(`${data_id}.jpg`)
                let mime = 'image/jpeg'
    
                // dataDetails.uri = uri
                // setDataDetails(dataDetails)
                console.log('Nova foto')
            
        
                RNFetchBlob.fs.readFile(uri, 'base64')
                .then((data) => {
                    return RNFetchBlob.polyfill.Blob.build(data, {type: mime+';BASE64'})
                })
                .then((blob) => {
        
                    image.put(blob, {contentType: mime})
                    .then(() => {
                        blob.close()
                        
                        // posts.child(post_id).child('data').child(dataId).child('same').set(true)
                        // dataDetails.same = true
                        // setDataDetails(dataDetails)
                        
                        savePost()
                    })
                    .catch((error) => {
                        setLoaderVisible(false)
                        console.log(error)
                    })
        
                })
                .catch((error) => {
                    setLoaderVisible(false)
                    console.log(error)
                })
            } else {
                console.log('Já tem')
                savePost()
            }
            

            // })



        } else {
            savePost()
        }
    }

    function handleSelectedDays(index) {
        const alreadySelected = selectedDays.findIndex(item => item === index);

        if (alreadySelected >= 0) {
            const filteredDays = selectedDays.filter(item => item !== index)

            setSelectedDays(filteredDays)
        } else {
            setSelectedDays([ ...selectedDays, index ])
        }
    }

    // function handleSend() {
    //     let selectedDaysSorted = selectedDays.sort()
    //     let filteredDays = selectedDaysSorted.map((item) => { return days[item] })

    //     console.log(filteredDays)
    // }

    return (
        <Page>
            <Scroll
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <Header>
                    <HeaderTitle>Disponibilidade</HeaderTitle>
                </Header>
                <TopMiddleArea>
                    <Title>Dias em que o item está disponível</Title>
                    {days.map((item, index) => (
                        <Item
                            key={index}
                            // onPress={() => {
                            //     daysCopy = JSON.parse(JSON.stringify(days))
                            //     daysCopy[index].active = !daysCopy[index].active
                            //     setDays(daysCopy)
                            // }}
                            onPress={() => handleSelectedDays(index)}
                            underlayColor='#eee'
                        >
                            <>
                            {/* <BoxSquare selected={item.active} ></BoxSquare>
                            <ItemText>{item.name}</ItemText> */}
                            <BoxSquare selected={selectedDays.includes(index) ? true : false} ></BoxSquare>
                            <ItemText>{item}</ItemText>
                            </>
                        </Item>
                    ))}
                </TopMiddleArea>
            </Scroll>
            <ButtonArea>
                <ButtonChoose
                    onPress={() => nav('AddOns')}
                    bgColor='#fff'
                    underlayColor='#eee'
                >
                    <ButtonText color='#fe9601' >Voltar</ButtonText>
                </ButtonChoose>

                <ButtonChoose
                    onPress={saveImage}
                    // underlayColor='#eee'
                    underlayColor='#e5921a'
                >
                    <ButtonText>Salvar</ButtonText>
                </ButtonChoose>
            </ButtonArea>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        tabBarLabel: 'Disponibilidade'
    }
}

export default Screen