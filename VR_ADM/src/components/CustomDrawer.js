import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { normalize } from '../functions';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../firebase';
import NetInfo from '@react-native-community/netinfo';

// Components:
import ModalSignOut from '../components/ModalSignOut'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

function CustomDrawer({ ...props }) {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ deviceId, setDeviceId ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ noConnection, setNoConnection ] = useState(true);
    const [ signOutVisible, setSignOutVisible ] = useState(false);
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext);

    const cities = firebase.database().ref('cities');

    const { navigation } = props
    const nav = navigation.navigate

    useEffect(() => {
        AsyncStorage.getItem('deviceId')
            .then(id => setDeviceId(id))

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                setLoading(false)
            } else {
                setNoConnection(false)
                getCityInformation()
            }
        })
    }, [])

    async function getCityInformation() {
        let cityId = await firebase.auth().currentUser.uid;

        await cities.child(cityId).on('value', snapshot => {
            setName(snapshot.val().city)
            setEmail(snapshot.val().email)
        })

        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }

    async function navigateToLogin() {
        let cityId = await firebase.auth().currentUser.uid;
        // setLoaderVisible(true)
        // firebase.auth().signOut()

        cities.child(cityId).child('devices').child(deviceId).child('logged').set(false)
        .then(() => {
            setTimeout(() => {
                // firebase.auth().signOut()
                navNow()
            }, 1500)
        })
        .catch(error => {
            setLoaderVisible(false)
            toastMsg(`${error.code} - ${error.message}`)
            console.log(error)
        })

        function navNow() {
            navigation.dispatch(StackActions.reset({
                index: 0,
                key: 'Login',
                actions: [
                    NavigationActions.navigate({routeName: 'Login'})
                ]
            }))
        }
    }

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    function chooseIcon(icon) {
        let icon_name;

        if (icon.index === 0) {
            icon_name = 'home';
        } else if (icon.index === 1) {
            icon_name = 'users';
        } else if (icon.index === 2) {
            icon_name = 'clipboard-list';
        } else if (icon.index === 3) {
            icon_name = 'map-marked-alt';
        } else if (icon.index === 4) {
            icon_name = 'info-circle';
        } else if (icon.index === 5) {
            icon_name = 'clock';
        } else if (icon.index === 6) {
            icon_name = 'image';
        } else if (icon.index === 7) {
            icon_name = 'sign-out-alt';
        }

        return icon_name;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerArea}>
                <FontIcon name='user-circle' size={normalize(50)} color='#077a15' />
                <View style={styles.userArea}>
                    {noConnection ? 
                    <ActivityIndicator color='#077a15' size='small' /> :
                    <>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </>}
                </View>
            </View>

            <DrawerNavigatorItems {...props}
                renderIcon={(icon) => <FontIcon name={chooseIcon(icon)} size={normalize(20)} color='#000' />}
                labelStyle={styles.labelDrawer}
                activeTintColor='#000'
                activeBackgroundColor='rgba(0, 255, 0, 0.03)'
                // onItemPress={() => console.log('-----------CLICANDO NO BOTÃO DO DRAWER-----------')}
                onItemPress={(item) => {
                    console.log(item.route)
                    if (item.route.routeName === 'Login') {
                        // navigateToLogin()
                        setSignOutVisible(true)
                    } else {
                        nav(item.route.routeName)
                    }
                }}
            />

            <ModalSignOut
                modalVisible={signOutVisible}
                setModalVisible={setSignOutVisible}
                goToScreen={navigateToLogin}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(10),
        // backgroundColor: '#efe'
        backgroundColor: 'rgba(0, 255, 0, 0.03)'
    },

    userArea: {
        flex: 1,
        marginLeft: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
    },

    name: {
        // marginTop: 5,
        fontSize: normalize(18),
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },

    email: {
        fontSize: normalize(15),
        alignSelf: 'flex-start',
    },

    labelDrawer: {
        flex: 1,
        fontWeight: 'normal',
        fontSize: normalize(16),
    }
})

export default CustomDrawer;