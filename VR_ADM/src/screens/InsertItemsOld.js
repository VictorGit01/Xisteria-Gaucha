// import React, { useEffect, useState, useContext } from 'react'
// import { View } from 'react-native'
// import styled from 'styled-components/native'
// import ImagePicker from 'react-native-image-picker'
// import RNFetchBlob from 'react-native-fetch-blob'
// import firebase from '../../firebase'
// import '../fixtimerbug'

// // Contexts:
// import MenuListContext from '../contexts/MenuListContext'

// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = RNFetchBlob.polyfill.Blob;

// const Page = styled.SafeAreaView`
//     flex: 1;
//     align-items: center;
// `

// const Scroll = styled.ScrollView`
//     width: 100%;
// `

// const ImageArea = styled.View`
//     width: 100%;
//     height: 300px;
//     background-color: #CCC;
//     margin-bottom: 20px;
// `

// const Image = styled.Image`
//     width: 100%;
//     height: 300px;
// `

// const BoxAdd = styled.View`
//     height: 200px;
//     width: 100%;
//     justify-content: space-around;
// `

// const Input = styled.TextInput`
//     height: 40px;
//     width: 90%;
//     border: 1px solid #ccc;
//     align-self: center;
// `
// // width: 200px;

// const ButtonSend = styled.TouchableOpacity`
//     height: 40px;
//     width: 90%;
//     justify-content: center;
//     align-items: center;
//     background-color: #077a15;
//     margin-top: 20px;
// `
// // width: 200px;

// const ButtonChooseImg = styled.TouchableHighlight`
//     height: 40px;
//     width: 80%;
//     justify-content: center;
//     align-items: center;
//     background-color: ${props => props.bgColor || '#00ff00'};
//     border-radius: 5px;
//     margin-bottom: 20px;
// `

// const TextButton = styled.Text`
//     font-size: 18px;
//     color: #fff;
// `

// const Text = styled.Text`
//     font-size: 16px;
//     margin-bottom: 20px
// `

// const Screen = (props) => {
//     const [ name, setName ] = useState('')
//     const [ desc, setDesc ] = useState('')
//     const [ price, setPrice ] = useState('')
//     const [ image, setImage ] = useState(null)
//     const [ pct, setPct ] = useState(0)
//     const [ menuList, setMenuList ] = useContext(MenuListContext)

//     let { navigation } = props
//     let nav = navigation.navigate
//     let params = navigation.state.params
//     let section = params.section
//     let index = menuList.indexOf(section)
//     let newList = [...menuList]
//     let idSection = section.id
//     // let typeCTG = newList[index].title
//     // let typeCTG = section.title
//     // let category = firebase.database().ref(`category/${typeCTG}`)
//     // let category = firebase.database().ref('category')
//     let ctg = firebase.database().ref(`ctg/${idSection}`)
//     let ctgData = firebase
//     // let Id_CTG = category.push().key

//     function carregarAvatar(img) {
//         firebase.storage().ref().child(img).getDownloadURL().then((url) => {
//             setImage({ uri: url })
//         }).catch((error) => {
//             console.log(error)
//             setImage(null)
//         })
//     }

//     useEffect(() => {
//         carregarAvatar('images/imagem2.jpg')
//     }, [])

//     function remover() {
//         firebase.storage().ref().child('images/imagem2.jpg').delete().then(() => {
//             setImage(null)
//         }).catch((error) => {
//             alert(`${error.code} - ${error.message}`)
//         })
//     }

//     const selectImage = () => {
//         // const options = {
//         //     // noData: true
//         //     title: 'Selecione uma Foto'
//         // }

//         // // Escolher pegar uma imagem da galeria ou da camera.
//         // ImagePicker.showImagePicker(options, response => {
//         //     const source = { uri: response.uri }
//         //     console.log(source)
//         //     setImage(source)
//         // })

//         const options = {
//             noData: true
//         }

//         ImagePicker.launchImageLibrary(options, (r) => {
//             if (r.uri) {
//                 // const source = {uri: r.uri}
//                 // setImage(source)

//                 let uri = r.uri.replace('file://', '')
//                 // let imagem = firebase.storage().ref().child('imagem.jpg')
//                 let imagem = firebase.storage().ref().child('images').child('imagem2.jpg')
//                 let mime = 'image/jpeg'

//                 RNFetchBlob.fs.readFile(uri, 'base64')
//                 .then((data) => {
//                     return RNFetchBlob.polyfill.Blob.build(data, { type: mime+';BASE64' })
//                 })
//                 .then((blob) => {
                    
//                     imagem.put(blob, {contentType:mime})
//                     .on('state_changed', (snapshot) => {

//                         let porcent = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100
//                         setPct(porcent)

//                     },
//                     (error) => {
//                         alert(error.code)
//                     },
//                     () => {
//                         imagem.getDownloadURL().then((url) => {
//                             setImage({ uri: url })
//                         })


//                         alert('Imagem carregada com sucesso!')
//                     })

//                 })
//             }
//         })
//     }

//     const handleSend = () => {
//         // console.log(params.section)
//         if (desc ? (name && desc && price).length > 0 : (name && price).length > 0) {
//             /*
//             newList[index].data.push({
//                 id: uuid(),
//                 name: name,
//                 description: desc ? desc : null,
//                 price: price
//             })
//             setMenuList(newList)
//             category.child(Id_CTG).set({
//                 name: name,
//                 description: desc,
//                 price: price
//             })
//             */
//             ctg.push({
//                 name: name,
//                 description: desc,
//                 price: price
//             })
//             /*
//             listDetails[index].data.push({
//                 id: uuid(), name: name, description: desc, price: price
//             })
//             */
//             navigation.goBack()
//         }
//         // console.log(listDetails)
//         // console.log(menuList)
//     }

    

//     return (
//         <Page>
//             <Scroll
//                 contentContainerStyle={{ alignItems: 'center' }}
//             >
//             <ImageArea>
//                 {image && <Image source={image} />}
//             </ImageArea>
//             <ButtonChooseImg
//                 onPress={selectImage}
//             >
//                 <TextButton>Escolher imagem</TextButton>
//             </ButtonChooseImg>
//             {image &&
//             <ButtonChooseImg
//                 onPress={remover}
//                 bgColor='#FF0000'
//             >
//                 <TextButton>Remover imagem</TextButton>    
//             </ButtonChooseImg>}
//             <Text>{pct}%</Text>
//             {pct > 0 && <View style={{ width: `${pct}%`, height: 40, backgroundColor: '#FF0000', marginBottom: 20 }} ></View>}
//             <BoxAdd>
//                 <Input
//                     value={name}
//                     onChangeText={(t) => setName(t)}
//                     placeholder='Nome'
//                 />
//                 <Input
//                     value={desc}
//                     onChangeText={(t) => setDesc(t)}
//                     placeholder='Descrição'
//                 />
//                 <Input
//                     value={price}
//                     onChangeText={(t) => setPrice(t)}
//                     placeholder='Preço'
//                 />
//             </BoxAdd>
//             <ButtonSend activeOpacity={.9} onPress={handleSend} >
//                 <TextButton>Enviar</TextButton>
//             </ButtonSend>
//             </Scroll>
//         </Page>
//     )
// }

// Screen.navigationOptions = () => {
//     return {
//         headerTitle: 'Adicionar Itens'
//     }
// }

// export default Screen