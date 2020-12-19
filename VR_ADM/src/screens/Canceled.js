import React, { useEffect, useState, useContext } from 'react'
import { Dimensions } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import NetInfo from '@react-native-community/netinfo'
import firebase from '../../firebase'

// Components:
import LoadingPage from '../components/LoadingPage'
import ListItem from '../components/Canceled/ListItem'
import ButtonNoConnection from '../components/ButtonNoConnection'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'
import NotifCanceledContext from '../contexts/NotifCanceledContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`

const Listing = styled.FlatList`
    width: 100%;
`

const ButtonNoNet = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    justify-content: center;
    align-items: center;
    background-color: #000;
    border-radius: 3px;
    padding-horizontal: 20px;
`
// height: ${normalize(24)}px;

const TextButton = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: bold;
    color: #fff;
`
// font-size: ${normalize(72)}px;

const TextInfo = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #999;
    margin-bottom: ${props => props.mgBottom || 0}px;
`

const Screen = (props) => {
    const [ list, setList ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ callUser, setCallUser ] = useState(false)
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)
    const [ notifCanceled, setNotifCanceled ] = useContext(NotifCanceledContext)

    const { navigation } = props
    const nav = navigation.navigate

    const canceled = firebase.database().ref('canceled')
    const currentCity = firebase.auth().currentUser

    useEffect(() => {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                endOfLoading()
            } else {
                getCanceled()
            }
        })
        // if (currentCity) {
        //     getCanceled()
        // }
    }, [notifCanceled, callUser])

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }

    function canceledFormatted() {
        if (currentCity) {
            let cityId = currentCity.uid

            return new Promise((resolve, reject) => {
                canceled.child(cityId).on('value', snapshot => {
                    if (snapshot.val()) {
                        let newPropertyValues = []

                        snapshot.forEach(childItem => {
                            let propertyValues = Object.values(childItem.val())
                            let propertyKeys = Object.keys(childItem.val())

                            // let newPropertyValues = propertyValues.map((item, index) => {
                            propertyValues.map((item, index) => {
                                item.userId = childItem.key
                                item.pushId = propertyKeys[index]
                                
                                newPropertyValues = [ ...newPropertyValues, item ]
                                // return item
                            })
                            // resolve(newPropertyValues)
                        })

                        resolve(newPropertyValues)
                    } else {
                        resolve(null)
                    }
                })
            })

        }
    }

    function getCanceled() {

        canceledFormatted().then(resp => {
            if (resp) {
                let newList = []
                // let list_count = []
                
                // resp.map(item => {
                //     list_count.push(item.count)
                // })

                // let conv_num = num => isNaN(num) ? 0 : Number(num)
                // let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                resp.map(item => {
                    // newList.push({
                    //     id: item.id,
                    //     userId: item.userId,
                    //     full_name: item.full_name,
                    //     // total_count: result_count,
                    //     count: item.count,
                    //     date: item.date,
                    //     time: item.time,
                    // })

                    newList.push(item)
                })

                let seen = {}
                let newListNotDup = newList.filter(function(entry) {
                    let previous;

                    // if (seen.hasOwnProperty(entry.userId)) {
                    //     previous = seen[entry.userId];
                    if (seen.hasOwnProperty(entry.id)) {
                        previous = seen[entry.id];

                        return false
                    }

                    // seen[entry.userId] = entry
                    seen[entry.id] = entry

                    return true
                })

                const sortedList = newListNotDup.slice().sort((a, b) => {
                    return new Date(b.cancellationDate) - new Date(a.cancellationDate)
                })

                // setList(newListNotDup)
                setList(sortedList)

                endOfLoading()
            } else {
                setList([])

                endOfLoading()
            }
        })
    }

    if (!loading && list) {
        return (
            <Page>
                <NavigationEvents
                    onWillFocus={() => setLoaderVisible(false)}
                />
                {list.length
                    ? <Listing
                        data={list}
                        renderItem={({item}) => <ListItem item={item} nav={nav} />}
                        keyExtractor={(item) => item.id}
                    />
                    : <TextInfo 
                        // size={normalize(63)}
                        size={normalize(18)}
                        weight='bold'
                    >Não existem pedidos cancelados.</TextInfo>
                }
                
            </Page>
        )
    } else if (!list && !loading) {
        return (
            <Page>
                <TextInfo mgBottom={normalize(20)} >Sem conexão com a internet.</TextInfo>
                <ButtonNoConnection onPress={() => setCallUser(!callUser)} />
            </Page>
        )
    } else {
        return <LoadingPage onWillFocus={() => setLoaderVisible(false)} />
    }
}

export default Screen