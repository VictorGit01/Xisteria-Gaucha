import React, { useEffect, useState, useContext, useRef } from 'react'
import { Dimensions, ToastAndroid, Keyboard } from 'react-native'
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../firebase'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import uuid from 'uuid/v4'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
    align-items: center;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    width: 100%;
    height: 40%;
    height: ${height / 3}px;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
`

const Footer = styled.View`
    width: 100%
    padding: ${normalize(10)}px ${normalize(20)}px;
    
`
// margin-bottom: ${normalize(56.5)}px;
// padding: ${normalize(100)}px ${normalize(50)}px;
// padding: ${normalize(11.30)}px ${normalize(22.61)}px;

const Title = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: bold;
    color: ${props => props.color || '#000'};
    letter-spacing: ${props => props.ltrSpacing || 0}px;
`
// font-size: 18px;

const Action = styled.View`
    flex-direction: column;
    width: 100%;
`

const InputArea = styled.View`
    margin-top: ${normalize(8)}px;
    justify-content: center;
`
// margin-top: ${normalize(150)}px;
// margin-top: ${normalize(7.53)}px;

const Input = styled.TextInput`
    padding-vertical: 0px;
    padding-bottom: ${normalize(5)}px;
    margin-top: ${normalize(10)}px;
    border-bottom-width: ${normalize(1)}px;
    border-color: #077a15;
    font-size: ${normalize(16)}px;
`
// padding-bottom: 5px;

const ButtonVisibility = styled.TouchableOpacity`
    height: ${normalize(40)}px;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    position: absolute;
`

const ButtonArea = styled.View`
    width: 100%
    justify-content: center;
    align-items: center;
    margin-top: ${normalize(30)}px;
`

const ButtonSignIn = styled.TouchableHighlight`
    width: 100%;
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(20)}px;
`
// border: 1px solid #077a15;
// background-color: #fff;
// height: ${normalize(24)}px;
// margin-bottom: ${normalize(20)}px;

const ButtonSignUp = styled.TouchableHighlight`
    width: 100%;
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: ${normalize(1)}px solid #077a15;
    border-radius: ${normalize(3)}px;
`

const ButtonText = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: ${props => props.color || '#077a15'};
`

const Screen = (props) => {
    const [ snapExist, setSnapExist ] = useState('')
    const [ deviceId, setDeviceId ] = useState('')
    const [ token, setToken ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ visibility, setvisibility ] = useState(true)
    const [ editable, setEditable ] = useState(true)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const { navigation } = props
    const nav = navigation.navigate

    const ref_input2 = useRef()

    useEffect(() => {
        // firebase.auth().signOut()
        // alert(`NORMALIZE 40: ${normalize(40)}`)

        AsyncStorage.getItem('notifToken')
            .then(t => {
                if (t) { setToken(t) }
            })

        AsyncStorage.getItem('deviceId')
            .then(id => {
                // if (!id) {
                //     let newId = uuid()

                //     AsyncStorage.setItem('deviceId', newId)
                //     setDeviceId(newId)
                // } else {
                //     setDeviceId(id)
                // }
                setDeviceId(id)
            })
    }, [])
    
    function onScreen() {
        setLoaderVisible(false)
    }

    // function getStatesData() {
    //     const url = 'http://tutofox.com/foodapp/api.json';

    //     fetch(url)
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         console.log(responseJson)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // }

    // useEffect(() => {
        
    //     // function getStatesData() {
    
    //     // }

    //     // const getStatesData = () => {
    //     //     fetch('https://jsonplaceholder.typicode.com/posts/1', {
    //     //         method: 'GET',
    //     //     })
    //     //     .then(response => {
    //     //         response.json()
    //     //     })
    //     //     // .then(responseJson => {
    //     //     //     console.log(responseJson)
    //     //     // })
    //     //     // .catch(error => {
    //     //     //     console.log(error)
    //     //     // })
    //     // }

    //     // getStatesData()
    // }, [])
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await axios(
    //             'https://servicodados.ibge.gov.br/api/v1/localidades/estados/PA/municipios'
    //         )

    //         result.data.map(item => {
    //             // console.log(item.nome)
    //         })
    //     }


    //     fetchData()
    // }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180,
        )
    }

    function handleLoadEd() {
        setLoaderVisible(false)
        setEditable(true)
    }

    const f_Base = (email, pass) => {
        firebase.auth().signInWithEmailAndPassword(
            email, pass
        ).then((resp) => {
            let user = firebase.auth().currentUser
            if (user) {
                const cityId = user.uid
                const currentCity = firebase.database().ref('cities').child(cityId)

                let snapExist = function() {
                    return new Promise((resolve, reject) => {
                        currentCity.child('devices').child(deviceId).once('value', snapshot => {
                            resolve(snapshot.val())
                        })
                    })
                    
                }
                
                // console.log('--------FUNÇÃO CHAMADA-------')
                
                snapExist().then(resp => {
                    // if (resp) {
                    //     console.log('--------EXISTE-------')
                    //     // currentCity.child('devices').child(deviceId).child('logged').set(true)
                    //     currentCity.child('devices').child(deviceId).set({
                    //         token,
                    //         logged: true,
                    //     })
                    //     .then(() => {
                    //         setTimeout(() => {
                    //             navTo()
                    //         }, 1500)
                    //     })
                    //     .catch(error => {
                    //         setLoaderVisible(false)
                    //         toastMsg(`${error.code} - ${error.message}`)
                    //         console.log(error)
                    //     })

                    // } else {
                    //     console.log('--------NÃO EXISTE-------')
                    //     let newDevice = currentCity.child('devices').child(deviceId)

                    //     newDevice.set({ 
                    //         token,
                    //         logged: true,
                    //     })
                    //     .then(() => {
                    //         setTimeout(() => {
                    //             // navTo()
                    //             saveCityId()
                    //         }, 1500)
                    //     })
                    //     .catch(error => {
                    //         setLoaderVisible(false)
                    //         toastMsg(`${error.code} - ${error.message}`)
                    //         console.log(error)
                    //     })

                    // }
                })
                // console.log(snapExist)

                currentCity.child('devices').child(deviceId).set({
                    token,
                    logged: true,
                })
                .then(() => {
                    setTimeout(() => {
                        saveCityId()
                    }, 1500)
                })
                .catch(error => {
                    setLoaderVisible(false)
                    toastMsg(`${error.code} - ${error.message}`)
                    console.log(error)
                })

                
                function saveCityId() {
                    AsyncStorage.setItem('cityId', cityId)
                        .then(() => {
                            navTo()        
                        })
                        .catch(error => {
                            toastMsg(`${error.code} - ${error.message}`)
                            console.log(error)
                        })
                }

                

                // currentCity.child('devices').child(deviceId)
                // .on('value', snapshot => {
                //     if (snapshot.val() == null) {

                //         let newDevice = currentCity.child('devices').child(deviceId)
                //         newDevice.set({ token, logged: true })
                //         .then(() => {
                //             setTimeout(() => {
                //                 navTo()
                //             }, 1500)
                //         })
                //         .catch(error => {
                //             setLoaderVisible(false)
                //             toastMsg(`${error.code} - ${error.message}`)
                //             console.log(error)
                //         })

                //     } else {

                //         currentCity.child('devices').child(deviceId).child('logged').set(false)
                //         .then(() => {
                //             setTimeout(() => {
                //                 navTo()
                //             }, 1500)
                //         })
                //         .catch(error => {
                //             setLoaderVisible(false)
                //             toastMsg(`${error.code} - ${error.message}`)
                //             console.log(error)
                //         })

                //     }
                // })
                
                // currentCity.child('devices')
                // .on('value', snapshot => {
                //     let listDevices = []
                //     // let deviceId = uuid()

                //     snapshot.forEach(childItem => {
                //         listDevices.push(childItem.val().token)
                //         // listDevices = [ ...listDevices, childItem.val() ]
                //     })

                //     if (!listDevices.includes(token)) {
                //         sendNow()
                //     }
                // })

                // function existToken(t) {
                //     if (t == true) {
                //         return false
                //     }
                //     return true
                // }

                // function sendNow() {
                    
                // }

                // if (existToken() == false) {
                //     console.log('----------------TOKEN:----------------')
                //     console.log(token)

                    
                // } else {
                //     currentCity.child('devices').child(deviceId).child('logged').set(false)
                //         .then(() => {
                //             setTimeout(() => {
                //                 navTo()
                //             }, 1500)
                //         })
                //         .catch(error => {
                //             setLoaderVisible(false)
                //             toastMsg(`${error.code} - ${error.message}`)
                //             console.log(error)
                //         })
                // }

                // console.log('----------------TOKEN JÁ INSERIDO?----------------')
                // console.log(existToken())

                // console.log('----------------TOKEN JÁ INSERIDO?----------------')
                // console.log(listDevices.includes(token))

                // if (listDevices.length > 0) {
                // }

                // currentCity.child('devices')
                // .orderByChild('token')
                // .equalTo(token)
                // .on('value', snapshot => {
                //     if (!snapshot.val()) {
                //         let newDevice = currentCity.child('devices').push()
                //         newDevice.set({
                //             token,
                //             logged: true
                //         })
                //     } else {
                //         console.log('----------------SNAPSHOT.VAL()----------------')
                //         console.log(snapshot.val())
                //     }
                // })

                // firebase.database().ref('cities').child(cityId).child('logged').set(true)

                function navTo() {
                    navigation.dispatch(StackActions.reset({
                        index: 0,
                        key: 'HomeDrawer',
                        actions: [
                            NavigationActions.navigate({routeName: 'HomeDrawer'})
                        ]
                    }))
                }

            }
        })
        .catch((error) => {
            
            setTimeout(() => {
                handleLoadEd()
                
                if (error.code == 'auth/invalid-email') {
                    toastMsg('Endereço de email inválido.')
                } else if (error.code == 'auth/weak-password') {
                    toastMsg('Sua senha deve conter pelo menos 6 caracteres.')
                } else if (error.code == 'auth/wrong-password') {
                    toastMsg('Senha incorreta.')
                } else if (error.code == 'auth/user-not-found') {
                    toastMsg('Não existe local com este email.')
                } else if (error.code == 'auth/user-disabled') {
                    toastMsg('Sua conta foi desativada pelo administrador.')
                } else if (error.code == 'auth/too-many-requests') {
                    toastMsg('Ocorreu um erro! Tente mais tarde.')
                } else if (error.code == 'auth/network-request-failed') {
                    toastMsg('Ocorreu um erro na conexão.')
                } else {
                    toastMsg(`${error.code} - ${error.message}`)
                    console.log(error)
                }
            }, 500)
            
        })
    }

    const handleSignIn = () => {
        setLoaderVisible(true)
        setEditable(false)
        Keyboard.dismiss()
        NetInfo.fetch().then(state => {
            if ((email && password).trim().length <= 0) {
                toastMsg('Preencha os campos.')
                handleLoadEd()
            } else if (!state.isConnected) {
                toastMsg('Verifique sua conexão com a internet.')
                handleLoadEd()
            } else {
                f_Base(email, password)
            }
        }).catch((error) => {
            handleLoadEd()
            toastMsg(`${error.code} - ${error.message}`)
            console.log(error)
        })
    }

    const handleEnter = () => {
        props.navigation.navigate('HomeDrawer')
    }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={onScreen}
            />
            <Scroll keyboardShouldPersistTaps='handled' >
                <Header>
                    <Title
                        // size={normalize(50)}
                        size={normalize(22)}
                        color='#fff'
                        ltrSpacing={normalize(2)}
                    >Seja bem vindo(a)!</Title>
                </Header>
                <Footer>
                    <Action
                        // style={{ marginTop: normalize(40) }}
                        // style={{ marginTop: normalize(28.27) }}
                        style={{ marginTop: normalize(28) }}
                    >
                        <Title>E-mail</Title>
                        <InputArea>
                            <Input
                                value={email}
                                onChangeText={(t) => setEmail(t)}
                                placeholder='email da cidade'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                returnKeyType='next'
                                onSubmitEditing={() => ref_input2.current.focus()}
                                blurOnSubmit={false}
                                // placeholder={email}
                                // editable={false}
                            />
                        </InputArea>
                    </Action>
                    <Action
                        // style={{ marginTop: normalize(40) }}
                        style={{ marginTop: normalize(28) }}
                    >
                        <Title>Senha</Title>
                        <InputArea>
                            <Input
                                value={password}
                                onChangeText={(t) => setPassword(t)}
                                placeholder='senha da cidade'
                                autoCapitalize='none'
                                secureTextEntry={visibility}
                                ref={ref_input2}
                            />
                            <ButtonVisibility
                                activeOpacity={1}
                                onPress={() => setvisibility(!visibility)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name={visibility ? 'visibility' : 'visibility-off'} size={normalize(20)} color='#000' />
                            </ButtonVisibility>
                        </InputArea>
                    </Action>
                    <ButtonArea>
                        <ButtonSignIn
                            onPress={handleSignIn}
                            underlayColor='#027510'
                        >
                            <ButtonText color='#fff'>Entrar</ButtonText>
                        </ButtonSignIn>

                        {/* <ButtonSignUp
                            onPress={() => nav('RegisterCity', {fromLogin: true})}
                        >
                            <ButtonText>Cadastrar</ButtonText>
                        </ButtonSignUp> */}
                    </ButtonArea>
                </Footer>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerShown: false
    }
}

export default Screen