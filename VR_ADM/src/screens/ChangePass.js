import React, { useEffect, useState, useContext, useRef } from 'react'
import { ToastAndroid, Dimensions } from 'react-native'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NetInfo from '@react-native-community/netinfo'
import firebase from '../../firebase'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    width: 100%;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Title = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: bold;
    margin-top: ${normalize(20)}px;
`
// margin-top: 20px;
// margin-top: ${normalize(57)}px;
// margin-top: ${normalize(19.84)}px;

const SubTitle = styled.Text`
    font-size: ${normalize(16)}px;
`

const InputArea = styled.View``

const Input = styled.TextInput`
    height: ${normalize(48)}px;
    width: 100%;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
`
// height: 40px;
// height: ${normalize(24)}px;
// height: ${normalize(48)}px;

const ButtonVisibility = styled.TouchableOpacity`
    height: ${normalize(40)}px;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
`

const ButtonSave = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-top: ${normalize(37)}px;
`
// height: 40px;
// margin-top: 30px;
// margin-top: ${normalize(30.7)}px;
// margin-top: ${normalize(36.83)}px;

const TextButton = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #fff;
`
// font-size: 18px;

const Screen = (props) => {
    const [ currentPass, setCurrentPass ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ confNewPass, setConfNewPass ] = useState('')
    const [ visibility1, setVisibility1 ] = useState(false)
    const [ visibility2, setVisibility2 ] = useState(false)
    const [ visibility3, setVisibility3 ] = useState(false)
    const [ editable, setEditable ] = useState(true)
    const [ count, setCount ] = useState(false)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    // References:
    const ref_input2 = useRef()
    const ref_input3 = useRef()

    let { navigation } = props
    let goBack = navigation.goBack

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    // Função para setar loaderVisible para false e editable para true:
    function handleLoadEd() {
        setLoaderVisible(false)
        setEditable(true)
    }

    const f_Base = () => {
        let user = firebase.auth().currentUser
        if (user) {

            let credential = firebase.auth.EmailAuthProvider.credential(
                firebase.auth().currentUser.email,
                currentPass
            )

            // Prompt the user to re-provide their sign-in credentials
            setCount(true)
            user.reauthenticateWithCredential(credential).then(function(response) {

                user.updatePassword(newPassword)
                .then(function(response) {
                    setCurrentPass('')
                    setNewPassword('')
                    setConfNewPass('')
                    handleLoadEd()
                    goBack()
                    toastMsg('Senha alterada com sucesso!')
                }).catch(function(error) {
                    setTimeout(() => {
                        handleLoadEd()
                        setCount(false)
                        if (error.code == 'auth/weak-password') {
                            toastMsg('Sua senha deve conter pelo menos 6 caracteres.')
                        } else {
                            toastMsg(`${error.code} - ${error.message}`)   
                        }
                    }, 500)
                })
                
            }).catch(function(error) {
                setTimeout(() => {
                    handleLoadEd()
                    setCount(false)
                    if (error.code == 'auth/wrong-password') {
                        toastMsg('A senha atual é inválida.')
                    } else if (error.code == 'auth/too-many-requests') {
                        toastMsg('Muitas tentativas sem êxito. Por favor, tente novamente mais tarde.')
                    } else if (error.code == 'auth/network-request-failed') {
                        toastMsg('Ocorreu um erro de rede (com o limite de tempo, conexão interrompida ou servidor inacessível).')
                    } else {
                        toastMsg(`${error.code} - ${error.message}`)
                        console.log(error)
                    }
                }, 500)
            })
        }
    }

    const handleSave = () => {
        setLoaderVisible(true)
        setEditable(false)
        // NetInfo.fetch().then(state => {
            if ((currentPass && newPassword && confNewPass).trim().length <= 0) {
                handleLoadEd()
                toastMsg('Preencha os campos acima.')
            } else if (newPassword != confNewPass) {
                handleLoadEd()
                toastMsg('As senhas não se coincidem.')
            }
            // else if (!state.isConnected) {
            //     handleLoadEd()
            //     toastMsg('Verifique sua conexão com a internet.')
            // }
            else if (!count) {
                f_Base()
            }
        // }).catch((error) => {
        //     handleLoadEd()
        //     toastMsg(`${error.code} - ${error.message}`)
        //     console.log(error)
        // })
    }

    useEffect(() => {
        // alert(`NORMALIZE 10: ${normalize(10)}`)
        // alert(`width: ${width}`)
    }, [])

    return (
        <Page>
            <Scroll
                // contentContainerStyle={{ padding: normalize(50), paddingBottom: normalize(10) }}
                // contentContainerStyle={{ padding: normalize(22.61), paddingBottom: normalize(113.09) }}
                contentContainerStyle={{ padding: normalize(20), paddingBottom: normalize(80) }}
                keyboardShouldPersistTaps='handled'
            >
                {/* <Title 
                    size={normalize(63)} 
                    style={{
                        marginBottom: normalize(11.30), 
                        marginBottom: normalize(100), 
                        marginTop: 0
                }}>A nova senha do local deve ter no mínimo 6 caracteres</Title> */}
                <Title 
                    size={normalize(18)} 
                    style={{
                        /*marginBottom: 11.30*/ 
                        // marginBottom: normalize(100), 
                        marginBottom: normalize(10), 
                        marginTop: 0
                }}>A nova senha do local deve ter no mínimo 6 caracteres</Title>
                <SubTitle>É permitido utitlizar letras maiúsculas, números e caracteres especiais</SubTitle>
                <Title>Senha atual</Title>
                <InputArea>
                    <Input
                        value={currentPass}
                        onChangeText={(t) => setCurrentPass(t)}
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={visibility1 ? false : true }
                        returnKeyType='next'
                        editable={editable}
                        onSubmitEditing={() => ref_input2.current.focus()}
                        blurOnSubmit={false}
                    />
                    <ButtonVisibility
                        activeOpacity={1}
                        onPress={() => setVisibility1(!visibility1)}
                        style={{position: 'absolute', alignSelf: 'flex-end'}}
                    >
                        <Icon name={visibility1 ? 'visibility-off' : 'visibility'} size={normalize(20)} color='#000' />
                    </ButtonVisibility>
                </InputArea>
                <Title>Digite a nova senha</Title>
                <InputArea>
                    <Input
                        value={newPassword}
                        onChangeText={(t) => setNewPassword(t)}
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={visibility2 ? false : true }
                        returnKeyType='next'
                        editable={editable}
                        onSubmitEditing={() => ref_input3.current.focus()}
                        ref={ref_input2}
                        blurOnSubmit={false}
                    />
                    <ButtonVisibility
                        onPress={() => setVisibility2(!visibility2)}
                        activeOpacity={1}
                        style={{position: 'absolute', alignSelf: 'flex-end'}}
                    >
                        <Icon name={visibility2 ? 'visibility-off' : 'visibility'} size={normalize(20)} color='#000' />
                    </ButtonVisibility>
                </InputArea>
                <Title>Confirme a nova senha</Title>
                <InputArea>
                    <Input
                        value={confNewPass}
                        onChangeText={(t) => setConfNewPass(t)}
                        autoCapitalize='none'
                        autoCorrect={false}
                        editable={editable}
                        secureTextEntry={visibility3 ? false : true }
                        ref={ref_input3}
                    />
                    <ButtonVisibility
                        activeOpacity={1}
                        onPress={() => setVisibility3(!visibility3)}
                        style={{position: 'absolute', alignSelf: 'flex-end'}}
                    >
                        <Icon name={visibility3 ? 'visibility-off' : 'visibility'} size={20} color='#000' />
                    </ButtonVisibility>
                </InputArea>
                <ButtonSave
                    onPress={handleSave}
                    // underlayColor='#000'
                    underlayColor='#e5921a'
                >
                    <TextButton>Salvar</TextButton>
                </ButtonSave>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Mudar Senha'
    }
}

export default Screen