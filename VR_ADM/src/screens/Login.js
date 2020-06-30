import React, { useEffect, useState, useContext } from 'react'
import { Dimensions, ToastAndroid, Keyboard } from 'react-native'
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../firebase'
import NetInfo from '@react-native-community/netinfo'
import axios from 'axios'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const { height, width } = Dimensions.get('window')

function normalize(size) {
    return (width + height) / size
}

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
    padding: ${normalize(100)}px ${normalize(50)}px;
    
`
// margin-bottom: ${normalize(56.5)}px;

const Title = styled.Text`
    font-size: ${props => props.size || normalize(63)}px;
    font-weight: bold;
    color: ${props => props.color || '#000'};
`
// font-size: 18px;

const Action = styled.View`
    flex-direction: column;
    width: 100%;
`

const InputArea = styled.View`
    margin-top: ${normalize(150)}px;
    justify-content: center;
`

const Input = styled.TextInput`
    padding-vertical: 0px;
    padding-bottom: ${normalize(230)}px;
    margin-top: ${normalize(100)}px;
    border-bottom-width: 1px;
    border-color: #077a15;
    font-size: ${normalize(72)}px;
`
// padding-bottom: 5px;

const ButtonVisibility = styled.TouchableOpacity`
    height: 40px;
    width: 40px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    position: absolute;
`

const ButtonArea = styled.View`
    width: 100%
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`

const ButtonSignIn = styled.TouchableHighlight`
    width: 100%;
    height: ${normalize(24)}px
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid #077a15
    border-radius: 3px;
`

const ButtonText = styled.Text`
    font-size: ${normalize(63)}px;
    font-weight: bold;
    color: ${props => props.color || '#077a15'};
`

const Screen = (props) => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ visibility1, setVisibility1 ] = useState(false)
    const [ editable, setEditable ] = useState(true)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    let { navigation } = props

    useEffect(() => {
        firebase.auth().signOut()
    }, [])

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

    useEffect(() => {
        
        // function getStatesData() {
    
        // }

        // const getStatesData = () => {
        //     fetch('https://jsonplaceholder.typicode.com/posts/1', {
        //         method: 'GET',
        //     })
        //     .then(response => {
        //         response.json()
        //     })
        //     // .then(responseJson => {
        //     //     console.log(responseJson)
        //     // })
        //     // .catch(error => {
        //     //     console.log(error)
        //     // })
        // }

        // getStatesData()
    }, [])
    
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
                navigation.dispatch(StackActions.reset({
                    index: 0,
                    // key: 'HomeDrawer',
                    actions: [
                        NavigationActions.navigate({routeName: 'HomeDrawer'})
                    ]
                }))
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
            <Scroll keyboardShouldPersistTaps='handled' >
                <Header>
                    <Title
                        size={normalize(50)}
                        color='#fff'
                    >Seja bem vindo!</Title>
                </Header>
                <Footer>
                    <Action
                        style={{ marginTop: normalize(40) }}
                    >
                        <Title>E-mail</Title>
                        <InputArea>
                            <Input
                                value={email}
                                onChangeText={(t) => setEmail(t)}
                                placeholder='email da cidade'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                // placeholder={email}
                                // editable={false}
                            />
                        </InputArea>
                    </Action>
                    <Action
                        style={{ marginTop: normalize(40) }}
                    >
                        <Title>Senha</Title>
                        <InputArea>
                            <Input
                                value={password}
                                onChangeText={(t) => setPassword(t)}
                                placeholder='senha da cidade'
                            />
                            <ButtonVisibility
                                activeOpacity={1}
                                onPress={() => setVisibility1(!visibility1)}
                            >
                                <Icon name={visibility1 ? 'visibility-off' : 'visibility'} size={20} color='#000' />
                            </ButtonVisibility>
                        </InputArea>
                    </Action>
                    <ButtonArea>
                        <ButtonSignIn
                            onPress={handleSignIn}
                            underlayColor='#eee'
                        >
                            <ButtonText>Entrar</ButtonText>
                        </ButtonSignIn>
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