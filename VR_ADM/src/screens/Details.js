import React, { useEffect, useState, useContext } from 'react'
import { ToastAndroid, Keyboard } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import uuid from 'uuid/v4'
import firebase from '../../firebase'
import NetInfo from '@react-native-community/netinfo'

// Contexts:
import DataDetailsContext from '../contexts/DataDetailsContext'

// Components:
import LoadingPage from '../components/LoadingPage'
import ButtonNoConnection from '../components/ButtonNoConnection'

// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest


// const tempWindowXMLHttpRequest = window.XMLHttpRequest
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob

// window.XMLHttpRequest = tempWindowXMLHttpRequest

const Page = styled.SafeAreaView`
    flex: 1;
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

const TopAndMiddleArea = styled.View`
    min-height: ${normalize(450)}px;
    width: 100%;
    align-items: center;
`

const AddPhotoArea = styled.TouchableOpacity`
    height: ${normalize(200)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    border: ${normalize(1)}px dashed #ccc;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`

const ButtonAddPhoto = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    position: absolute;
    right: ${normalize(28)}px;
    bottom: ${normalize(8)}px;
    padding: ${normalize(6)}px;
`

const ImageArea = styled.View`
    height: ${normalize(200)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-vertical: ${normalize(20)}px;
`

const Image = styled.Image`
    height: ${normalize(200)}px;
    width: 90%;
    resize-mode: cover;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`

const Input = styled.TextInput`
    height: ${props => props.height || normalize(40)}px;
    width: 90%;
    border: ${normalize(1)}px solid #999;
    border-radius: ${normalize(3)}px;
    padding: 0px;
    padding-left: ${normalize(10)}px;
    font-size: ${normalize(18)}px;
    margin-bottom: ${normalize(20)}px;
    color: ${props => props.color || '#000'}
`
// height: ${props => props.height || '40px'};

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
// margin-vertical: ${normalize(20)}px;

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
    const [ loading, setLoading ] = useState(false)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ image, setImage ] = useState(null)
    const [ name, setName ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ priceColor, setPriceColor ] = useState('')
    const [ dataDetails, setDataDetails ] = useContext(DataDetailsContext)

    let { navigation } = props
    // let { name, description, price } = dataDetails

    let nav = navigation.navigate
    let goBack = navigation.goBack
    let params = navigation.state.params
    let sectionId = params.section.id
    let editEnabled = params.editEnabled
    let dataId = params.dataId
    let dataImg = params.dataImg
    let data = params.data

    const posts = firebase.database().ref('posts')
    const posts_img = firebase.storage().ref().child('posts')
    const cityId = firebase.auth().currentUser.uid

    let newData = JSON.parse(JSON.stringify(dataDetails))

    // let dataDetailsCopy = JSON.parse(JSON.stringify(dataDetails))
    let data_id = uuid()

    useEffect(() => {
        // setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
                getDetails()
            }
        })
    }, [])

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function getDetails() {
        setPriceColor('#999')
        // console.log(data)
        if (editEnabled) {
            setLoading(true)

            async function getSection() {
                // posts.child(cityId).child(sectionId).child('data').on('value', snapshot => {
                //     // console.log('Aqui!!!!!!!!!!!!')
                //     // console.log(snapshot.val())
                // })
                // console.log('DATA ID:')
                // console.log(params.dataIndex)
                await posts.child(cityId).child(sectionId).child('data').child(dataId).on('value', snapshot => {
                    if (snapshot.val()) {
                        setName(snapshot.val().name)
                        setDescription(snapshot.val().description)
                        // setPrice(snapshot.val().price)
                        onChangePrice(snapshot.val().price)
                        setDataDetails(snapshot.val())
                        // console.log(snapshot.val())
                    }
                })

                endOfLoading()
            }

            if (dataImg) {
                posts_img.child(cityId).child('items').child(`${dataId}.jpg`).getDownloadURL().then((url) => {
                    const source = { uri: url }
                    setImage(source)
                    // console.log(source)
                    getSection()
                })
            } else {
                getSection()
            }
        } else {
            newData.id = data_id
            setDataDetails(newData)
        }
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

    function cleaned(text) {
        let cleaned = ('' + text).replace(/\D/g, '');

        return cleaned;
    }

    function onChangePrice(text) {
        // setPriceColor('#000')

        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        

        if (conv_num(Number(cleaned(text))) == 0) {
            setPriceColor('#999')
        } else {
            setPriceColor('#000')
        }
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned(text)))
            console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned(text)))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned(text)))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        setPrice(num_format)
    }

    useEffect(() => {
        console.log('Preço é:')
        console.log(cleaned(price))
    }, [price])

    // const postImage = () => {
    //     let uri = response.uri.replace('file://', '')
    //     let imagem = firebase.storage().ref().child('images').child('imagem2.jpg')
    //     let mime = 'image/jpeg'

    //     RNFetchBlob.fs.readFile(uri, 'base64')
    //     .then((data) => {
    //         return RNFetchBlob.polyfill.Blob.build(data, {type:mime+';BASE64'})
    //     })
    //     .then((blob) => {

    //         imagem.put(blob, {contentType:mime})
    //         .then(() => {
    //             blob.close()
                
    //             // let url = imagem.getDownloadURL()

    //             imagem.getDownloadURL().then((url) => {

    //                 setImage({ uri: url })
                    
    //             })

    //             alert('Terminou o processo!')
    //         })
    //         .catch((error) => {
    //             alert(error.code)
    //         })

    //     })
    // }
    
    // ImagePicker.launchImageLibrary({
    //     mediaType
    // })
    const selectImage = () => {
        const options = {
            noData: true
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {
                const source = { uri: response.uri }
                setImage(source)
                newData.image = source
                setDataDetails(newData)
                // console.log(source)
            }
        })
    }

    const handleAdvance = () => {
        if (name.trim().length < 1) {
            toastMsg('Digite o nome do item.')
        } else if (price.trim().length < 1 || cleaned(price) === 0) {
            toastMsg('Digite o preço do item.')
        } else {
            let newPrice = price.split('R$ ').join('').split('.').join('').replace(',', '.')
            // console.log(dataDetails.image)
            newData.name = name
            newData.description = description
            newData.price = newPrice
            setDataDetails(newData)
            Keyboard.dismiss()
            nav('AddOns')
        }

        // if ((name && price).trim().length > 0) {
        //     let posts = firebase.database().ref('posts')
        //     let post_id = params.section.id
        //     let newPost = JSON.parse(JSON.stringify(params.section))
        //     let id = uuid()

        //     newPost.data.push({
        //         id,
        //         name,
        //         price,
        //         description
        //     })
        //     // console.log(newPost)
        //     posts.child(post_id).set(newPost)
        //     .then((resp) => {
        //         setName('')
        //         setDescription('')
        //         setPrice('')
        //         alert('Item inserido com sucesso!')
        //         // console.log(resp)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        //     // posts.child(post_id).on('value', snapshot => {
        //     //     let newSnapshot = JSON.parse(JSON.stringify(snapshot.val))
        //     //     newSnapshot['data'] = 
        //     // })
        // } else {
        //     alert('Preencha os campos')
        // }
    }

    // useEffect(() => {
    //     console.log(dataDetails)
    // }, [dataDetails])

    const clear = () => {
        // newData.name = ''
        // newData.description = ''
        // newData.price = ''
        // setDataDetails(newData)
    }

    if (loading) {
        return (
            <LoadingPage />
        )
    }

    return (
        <Page>
            <Scroll
                contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps='handled'
            >
                <NavigationEvents
                    // onWillFocus={payload => console.log('will focus', payload)}
                    // onDidFocus={payload => console.log('did focus', payload)}
                    // onWillBlur={payload => console.log('will blur', payload)}
                    // onDidBlur={payload => console.log('did blur', payload)}
                    onWillBlur={clear}
                />
                <Header>
                    <HeaderTitle>Detalhes</HeaderTitle>
                </Header>
                <TopAndMiddleArea>
                    {image !== null ? 
                    <ImageArea>
                        <Image source={image} />
                        <ButtonAddPhoto
                            onPress={selectImage}
                            activeOpacity={.7}
                        >
                            <ButtonText style={{ fontSize: normalize(12), fontWeight: 'bold' }} color='#fff' >ALTERAR IMAGEM</ButtonText>
                        </ButtonAddPhoto>
                    </ImageArea>:
                    <AddPhotoArea
                        onPress={selectImage}
                        activeOpacity={.7}
                    >
                        {/* <ButtonAddPhoto
                            onPress={selectImage}
                            activeOpacity={.7}
                        > */}
                            <Icon name='image-plus' size={normalize(35)} color='#ccc' />
                        {/* </ButtonAddPhoto> */}
                    </AddPhotoArea>}
                    <Input
                        // value={name}
                        onChangeText={(t) => setName(t)}
                        value={name}
                        // onChangeText={text => {
                        //     newData.name = text
                        //     setDataDetails(newData)
                        // }}
                        placeholder='Nome'
                    />
                    <Input
                        // value={description}
                        onChangeText={(t) => setDescription(t)}
                        value={description}
                        // onChangeText={text => {
                        //     newData.description = text
                        //     setDataDetails(newData)
                        // }}
                        placeholder='Descrição (opcional)'
                        height={normalize(60)}
                        // numberOfLines={3}
                        multiline={true}
                        // maxLength={10}
                    />
                    <Input
                        // value={price}
                        // onChangeText={(t) => setPrice(t)}
                        value={price}
                        onChangeText={text => onChangePrice(text)}
                        placeholder='Preço'
                        keyboardType='numeric'
                        color={priceColor}
                        maxLength={13}
                    />
                </TopAndMiddleArea>
            </Scroll>
            <ButtonArea>
                <ButtonChoose
                    onPress={() => nav('Menu')}
                    bgColor='#fff'
                    underlayColor='#eee'
                >
                    <ButtonText color='#fe9601' >Cancelar</ButtonText>
                </ButtonChoose>

                <ButtonChoose
                    onPress={handleAdvance}
                    // underlayColor='#f18b00'
                    underlayColor='#e5921a'
                >
                    <ButtonText>Próximo</ButtonText>
                </ButtonChoose>
            </ButtonArea>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        tabBarLabel: 'Detalhes',
    }
}

export default Screen