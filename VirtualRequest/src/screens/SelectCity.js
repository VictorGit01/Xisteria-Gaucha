import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Platform, ToastAndroid, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { normalize } from '../functions'
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Fi from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import firebase from '../../firebase';
// import messaging from '@react-native-firebase/messaging';
// import { notifications } from 'react-native-firebase-push-notifications'
import notifications from 'react-native-push-notification'
// const admin = require('firebase-admin');
import axios from 'axios';
// import firebaseClient from '../../FirebaseClient';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
`;

const Title = styled.Text`
    font-size: ${normalize(30)}px;
    color: #077a15;
    bottom: ${normalize(40)}px;
`

const SubTitle = styled.Text`
    font-size: ${normalize(18)}px;
    text-align: center;
    margin-vertical: ${normalize(20)}px;
`

// const Item = styled.TouchableOpacity`
//     width: 100%;
//     flex-direction: row;
//     align-items: center;
//     padding-horizontal: ${normalize(15)}px;
//     border-top-width: ${normalize(.5)}px;
//     border-bottom-width: ${normalize(.5)}px;
//     padding-vertical: 10px;
//     margin-bottom: 30px;
// `

// const BoxExtra = styled.View`
//     height: 20px;
//     width: 20px;
//     justify-content: center;
//     align-items: center;
//     background-color: ${props => props.selected ? '#b9f7bf' : '#ccc'};
//     border: 5px solid ${props => props.selected ? '#fe9601' : '#ccc'};
//     border-radius: ${props => props.radius || 12}px;
//     margin-right: 15px;
//     margin-left: 5px;
// `

// const ItemText = styled.Text`
//     font-size: ${props => props.size || 16}px;
//     text-align: ${props => props.txtAlign || 'left'};
//     color: ${props => props.color || '#555'};
// `

const Footer = styled.View`
    height: ${normalize(80)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-color: #999;
    margin-top: ${normalize(10)}px;
`

const ButtonIcon = styled.View`
    height: 100%;
    width: ${normalize(60)}px;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .1);
`

const Button = styled.TouchableHighlight`
    height: ${normalize(50)}px;
    width: 90%;
    flex-direction: row;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(5)}px;
    elevation: 2;
    margin-top: ${normalize(20)}px;
`
// justify-content: space-between;

const ButtonText = styled.Text`
    flex: 1;
    justify-content: center;
    font-size: ${normalize(18)}px;
    text-align: center;
    color: #fff;
`
// text-align: center;
// font-weight: bold;

const Input = styled.View`
    height: ${normalize(60)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    border-color: #077a15;
    background-color: transparent;
    border-width: ${normalize(1)}px;
    border-radius: ${normalize(5)}px;
    margin-top: ${normalize(100)}px;
`

const SelectCity = (props) => {
    // const [ selected, setSelected ] = useState({ value: null, index: 0, color: '#999' })
    const [ selected, setSelected ] = useState({ value: null, index: 0 })
    // const [ selected, setSelected ] = useState({ label: 'Selecione sua cidade', value: null, color: '#999' })
    const [ listCities, setListCities ] = useState([])
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const cities = firebase.database().ref('cities')

    const { navigation, cityId, setCityId, list_request, total, setListRequest } = props
    const nav = navigation.navigate

    // const list_cities = [
    //     {label: 'Tucumã', value: 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'},
    //     {label: 'Ourilândia', value: 'WKYkixbiH2SEzMe9SO2OCCZOXrA3'},
    // ]

    useEffect(() => {
        cities.on('value', snapshot => {
            let newList = []
            snapshot.forEach(childItem => {
                newList.push({
                    label: childItem.val().city,
                    value: childItem.val().id,
                    // color: '#000'
                })
            })
            setListCities(newList)
        })
    }, [])

    useEffect(() => {
        console.log(listCities)
        console.log('-----------TOTAL-----------')
        console.log(total)
    }, [listCities])

    useEffect(() => {
        console.log('SELECTED:')
        console.log(selected)
    }, [selected])

    // useEffect(() => {
    //     notifications.configure({
            
    //     })

    //     // notifications.onNotification(notification => {
    //     //     console.log('Com o App aberto:')
    //     //     console.log(notification)
    //     // })

    //     // notifications.getInitialNotification()
    //     //     .then(event => {
    //     //         if (event) {
    //     //             console.log('Com o App fechado:')
    //     //             console.log(event.notification)
    //     //         }
    //     //     })
    // })

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180),
        )
    }

    function onValueChange(value, index) {
        if (!value) {
            setSelected({ value: null, index: 0/*, color: '#999'*/ })
        } else {
            console.log('ON_VALUE_CHANGE:')
            // console.log(listCities[index - 1])
            console.log(value)
            setSelected({ value, index/*, color: '#000'*/ })
        }
        // console.log('ON_VALUE_CHANGE:')
        // console.log(index)
    }

    function navToHome() {
        navigation.dispatch(StackActions.reset({
            index: 0,
            // key: 'HomeStack',
            actions: [
                NavigationActions.navigate({routeName: 'Home'})
            ]
        }))
    }

    const handleSend = () => {
        setLoaderVisible(true)

        if (selected.index !== 0) {
            // let listRequestCopy = Array.from(list_request)
            // let listRequestCopy = JSON.parse(JSON.stringify(list_request))
            let newListRequest = []

            // listRequestCopy.push({
            //     id: selected.value,
            //     data: []
            // })

            newListRequest.push({
                id: selected.value,
                data: []
            })
            
            // setListRequest(listRequestCopy)
            setCityId(selected.value)
            setListRequest(newListRequest)

            setTimeout(() => {
                navToHome()
                changeNavigationBarColor('#077a15', false)    
            }, 4000)
        } else {
            setTimeout(() => {
                setLoaderVisible(false)
                toastMsg('Por favor, selecione uma cidade!')
            }, 1000)
        }
    }

    const sendMsg = () => {
        let token1 = 'dGzvU4UHSbSiIr5wAHEbYA:APA91bEh9Kq0AQ8vJXMvWK6o3IGzz9WcFsWXbVhbXmlI4ASHLdKMDZtQ-DxpSSvoNZQQ5qVfKq4BUovCj6eEPuys0_tDPZTA4JqSawDg8wjzgmKyeUnzLi0FTrL1AR6fy5QHcNeboi1U'
        let token2 = 'dbRiIYTySCCHFXqmA4S8zr:APA91bGv6JdcGcuZmMVdo2kUW3b3O_STIO4oryieq4u93ZmaP3Vyz9W359S7eYDM8_f4TgbLqiGItVRNOPDE3a6UxMD3CSbcwciIoDqGrKTyTal0FyjD366x8Fdtza1bM6YCyC2wayVm'

        // const FCMToken = 'dGzvU4UHSbSiIr5wAHEbYA:APA91bEh9Kq0AQ8vJXMvWK6o3IGzz9WcFsWXbVhbXmlI4ASHLdKMDZtQ-DxpSSvoNZQQ5qVfKq4BUovCj6eEPuys0_tDPZTA4JqSawDg8wjzgmKyeUnzLi0FTrL1AR6fy5QHcNeboi1U'
        // messaging().sendMessage({
        //     notification: {
        //         title: 'Hello',
        //         body: 'world'
        //     },
        //     data: {
        //         some: 'data'
        //     },
        // })
        // .then(response => {
        //     console.log('Menssagem enviada: ', response)
        // })
        // .catch(error => {
        //     console.log('Error: ', error)
        // })


        // fetch('https://fcm.googleapis.com/fcm/send', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'key=AAAArasXsRE:APA91bHiUrfy0clOFw-Tn1w_PpPfavkweR81vuLxvy6qKgJvWrAQ9VJXFX2rJASelvxfCzRfOLVnQZBA1eQ1SUdj3VtaJN21LN-UFHNaCNdN3v4_RaBpvWCmJXa3dh1FIc6BTIb_cq9p'
        //     },
        //     body: {
        //         'to': `${token}`,
        //         'data': {
        //             'title': 'test title',
        //             'message': 'Menssagem teste',
        //             'data-type': 'direct_message',
        //             // 'custom_notification': {
        //             //     'body': 'test body',
        //             //     'title': 'test title',
        //             //     'color': '#00ACD4',
        //             //     'priority': 'high',
        //             //     'sound': 'default',
        //             //     'show_in_foreground': true,
        //             // }
        //         }
        //     }
        // }).then(response => {
        //     console.log('Menssagem enviada!', response)
        // })
        // .catch(error => {
        //     console.log('Error: ', error)
        // })

        axios({
            method: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAArasXsRE:APA91bHiUrfy0clOFw-Tn1w_PpPfavkweR81vuLxvy6qKgJvWrAQ9VJXFX2rJASelvxfCzRfOLVnQZBA1eQ1SUdj3VtaJN21LN-UFHNaCNdN3v4_RaBpvWCmJXa3dh1FIc6BTIb_cq9p'
            },
            data: {
                'to': `${token2}`,
                // 'registration_ids': [token1, token2],
                'notification': {
                    'title': 'test title',
                    'body': 'Menssagem teste',
                },
                'data': {
                    'custom_notification': {
                        'body': 'test body',
                        'title': 'test title',
                        'color': '#00ACD4',
                        'priority': 'high',
                        'sound': 'default',
                        'show_in_foreground': true,
                    }
                }
            }
        }).then(response => {
            // console.log('Menssagem enviada!', response)
        })
        .catch(error => {
            console.log('Error: ', error)
        })



        // let body;

        // if (Platform.OS === 'android') {
        //     body = {
        //         to: token,
        //         data: {
        //             custom_notification: {
        //                 title: 'Simple FCM Client',
        //                 body: 'Click me to go to detail',
        //                 sound: 'default',
        //                 priority: 'high',
        //                 show_in_foreground: true,
        //                 targetScreen: 'detail'
        //             }
        //         },
        //         priority: 10
        //     }
        // } else {
        //     body = {
        //         to: token,
        //         notification: {
        //             title: 'Simple FCM Client',
        //             body: 'Click me to go to detail',
        //             sound: 'default'
        //         },
        //         data: {
        //             targetScreen: 'detail'
        //         },
        //         priority: 10
        //     }
        // }

        // firebaseClient.send(JSON.stringify(body), 'notification');


        // admin.messaging()
        // .sendToDevice(FCMToken, {
        //     notification: {
        //         title: 'Hello',
        //         body: 'world',
        //     },
        //     data: {
        //         some: 'data'
        //     },
        // })
        // .then(response => {
        //     console.log('Successfully sent message: ', response)
        //     process.exit()
        // })
        // .catch(error => {
        //     console.log('Error sending messaging: ', error)
        //     process.exit()
        // })
    }

    return (
        <Page>
            <Title>
                Seja bem vindo(a)!
            </Title>

            <SubTitle>
                Selecione sua cidade para ter uma melhor experiência.
            </SubTitle>

            <StatusBar barStyle='dark-content' backgroundColor='#b9f7bf' />
            <Input>
                <RNPickerSelect
                    // onValueChange={(value, index) => setSelected({ value, index })}
                    onValueChange={onValueChange}
                    items={listCities}
                    style={{
                        placeholder: {
                            // fontSize: normalize(16),
                            // color: selected.color
                            color: '#999',
                            width: '100%',
                            // backgroundColor: 'tomato',
                        },
                        inputAndroidContainer: {
                            // backgroundColor: 'tomato',
                            flex: 1,
                            // width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: normalize(5),
                            marginRight: normalize(10),
                        },
                        inputAndroid: {
                            width: '100%',
                            height: '100%',
                            color: '#000',
                            // backgroundColor: 'tomato',
                            fontSize: normalize(16),
                        }
                    }}
                    useNativeAndroidPickerStyle={false}
                    // Icon={() => <FontIcon name='sort-down' size={20} color='#000' />}
                    Icon={() => <FontIcon name='caret-down' size={normalize(18)} color='#555' />}
                    value={selected.value}
                    key={selected.value}
                    placeholder={{ label: 'Selecione sua cidade', value: null, color: '#999' }}
                />
            </Input>
            {/* {list_cities.map((item, index) => (
                <Item key={index} onPress={() => setSelected(item.id)} >
                    <BoxExtra selected={selected == item.id} ></BoxExtra>
                    <ItemText>{item.city}</ItemText>
                </Item>
            ))} */}
            <Footer>
                <Button 
                    onPress={handleSend} 
                    underlayColor='#e5921a'
                >
                    <>
                        <ButtonIcon>
                            <Fi name='arrow-right' size={normalize(20)} color='#fff' />
                        </ButtonIcon>
                        <ButtonText>
                            Entrar
                        </ButtonText>
                    </>
                </Button>
            </Footer>
        </Page>
    );
}

const styles = StyleSheet.create({
    select_picker: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black'
    }
})

SelectCity.navigationOptions = () => {
    return {
        headerShown: false
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,

        total: state.requestReducer.total,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCityId: (cityId) => dispatch({type: 'SET_CITY_ID', payload: {cityId}}),
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity);