import React, { useEffect, useState, useContext } from 'react'
import { Dimensions } from 'react-native'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import firebase from '../../firebase'

// Contexts:
import NotifDeliveryContext from '../contexts/NotifDeliveryContext'
import NotifPlaceContext from '../contexts/NotifPlaceContext'
import NotifCanceledContext from '../contexts/NotifCanceledContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const TabBarLabel = styled.View`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`
const BackBadge = styled.View`
    height: 25px;
    width: 25px;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    border-radius: 15px
    position: absolute;
    right: -8px;
    top: -5px;
`

const TabBarBadge = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: rgba(255, 0, 0, 0.9);
    justify-content: center;
    align-items: center;
`

const TabBarCount = styled.Text`
    font-size: 12px;
    color: #fff;
`

const Label = styled.Text`
    font-size: ${normalize(15)}px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.color || '#fff'};
`
// font-size: 15px;

export default (props) => {
    // const [ notifClients, setNotifClients ] = useContext(NotifClientsContext)
    // const [ notifDelivery, setNotifDelivery ] = useState({})
    // const [ notifPlace, setNotifPlace ] = useState({})
    // const [ notifCanceled, setNotifCanceled ] = useState({})

    const [ notifDelivery, setNotifDelivery ] = useContext(NotifDeliveryContext)
    const [ notifPlace, setNotifPlace ] = useContext(NotifPlaceContext)
    const [ notifCanceled, setNotifCanceled ] = useContext(NotifCanceledContext)

    const currentCity = firebase.auth().currentUser
    const requests = firebase.database().ref('requests')
    const canceled = firebase.database().ref('canceled')

    useEffect(() => {
        if (currentCity) {
            getNotifDelivery()
            getNotifPlace()
            getNotifCanceled()
        }
    }, [currentCity])

    function getNotifDelivery() {
        let cityId = currentCity.uid
        
        requests.child(cityId).on('value', snapshot => {
            let list_count = []
            let list_data = []
            let notifDeliveryCopy = JSON.parse(JSON.stringify(notifDelivery))

            snapshot.forEach(childItem => {
                let propertyValues = Object.values(childItem.val())
                
                propertyValues.map(item => {
                    if (item.dlvTypePos == 1) {
                        list_count.push(item.count)
                        list_data.push({
                            count: item.count,
                            id: item.id,
                        })
                    }
                })
            })

            // resp.map(item => {
            //     if (item.dlvTypePos == 1) {
            //         list_count.push(item.count)
            //         list_data.push({
            //             count: item.count,
            //             id: item.id,
            //         })
            //     }
            // })

            let seen = {}
            list_data = list_data.filter(function(entry) {
                let previous;

                if (seen.hasOwnProperty(entry.id)) {
                    previous = seen[entry.id];
                    previous.count.push(entry.count)

                    return false
                }

                if (!Array.isArray(entry.count)) {
                    entry.count = [entry.count]
                }

                seen[entry.id] = entry

                return true
            })

            let conv_num = num => isNaN(num) ? 0 : Number(num)

            let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

            list_data = list_data.filter(function(filItem) {
                filItem.count = filItem.count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                return true
            })

            notifDeliveryCopy.delivery = result_count

            notifDeliveryCopy.data = list_data

            setTimeout(() => {
                setNotifDelivery(notifDeliveryCopy)
            }, 2000)
        })
    }

    // Notifications Place:

    function getNotifPlace() {
        let cityId = currentCity.uid
                
        requests.child(cityId).on('value', snapshot => {
            let list_count = []
            let list_data = []
            let notifPlaceCopy = JSON.parse(JSON.stringify(notifPlace))
            
            snapshot.forEach(childItem => {
                let propertyValues = Object.values(childItem.val())
                
                propertyValues.map(item => {
                    if (item.dlvTypePos == 0) {
                        list_count.push(item.count)
                        list_data.push({
                            count: item.count,
                            id: item.id,
                        })
                    }
                })
            })

            let seen = {}
            list_data = list_data.filter(function(entry) {
                let previous;

                if (seen.hasOwnProperty(entry.id)) {
                    previous = seen[entry.id];
                    previous.count.push(entry.count)

                    return false
                }

                if (!Array.isArray(entry.count)) {
                    entry.count = [entry.count]
                }

                seen[entry.id] = entry

                return true
            })

            let conv_num = num => isNaN(num) ? 0 : Number(num)

            let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

            list_data = list_data.filter(function(filItem) {
                filItem.count = filItem.count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                return true
            })

            notifPlaceCopy.place = result_count

            notifPlaceCopy.data = list_data

            setNotifPlace(notifPlaceCopy)
        })
    
    }

    // Notifications Canceled:

    function getNotifCanceled() {
        let cityId = currentCity.uid
                
        canceled.child(cityId).on('value', snapshot => {
            let list_count = []
            let list_data = []
            let notifCanceledCopy = JSON.parse(JSON.stringify(notifCanceled))
            
            snapshot.forEach(childItem => {
                let propertyValues = Object.values(childItem.val())
                
                propertyValues.map(item => {
                    list_count.push(item.count)
                    list_data.push({
                        count: item.count,
                        id: item.id,
                    })
                })
            })

            let seen = {}
            list_data = list_data.filter(function(entry) {
                let previous;

                if (seen.hasOwnProperty(entry.id)) {
                    previous = seen[entry.id];
                    previous.count.push(entry.count)

                    return false
                }

                if (!Array.isArray(entry.count)) {
                    entry.count = [entry.count]
                }

                seen[entry.id] = entry

                return true
            })

            let conv_num = num => isNaN(num) ? 0 : Number(num)

            let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

            list_data = list_data.filter(function(filItem) {
                filItem.count = filItem.count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

                return true
            })

            notifCanceledCopy.canceled = result_count

            notifCanceledCopy.data = list_data

            setNotifCanceled(notifCanceledCopy)
        })
    }
    
    let name = ''
    let color = '#fff'

    switch(props.route) {
        case 'Delivery':
            name = 'Delivery'
            color = (props.focused) ? '#fff' : 'rgba(255, 255, 255, .7)'
            break;
        case 'Place':
            name = 'Retirada'
            color = (props.focused) ? '#fff' : 'rgba(255, 255, 255, .7)'
            break;
        case 'Canceled':
            name = 'Pedidos Cancelados'
            color = (props.focused) ? '#fff' : 'rgba(255, 255, 255, .7)'
            break;
    }

    return (
        <TabBarLabel>
            <Label color={color} >{name}</Label>
            {/* {props.route == 'Clients' && notifClients.clients > 0 && */}
            {props.route == 'Delivery' && notifDelivery.delivery > 0 &&
            <BackBadge>
                <TabBarBadge>
                    <TabBarCount>{notifDelivery.delivery > 9 ? 9 + '+' : notifDelivery.delivery}</TabBarCount>
                </TabBarBadge>
            </BackBadge>}
            {/* {props.route == 'Requests' && notifRequests.requests > 0 && */}
            {props.route == 'Place' && notifPlace.place > 0 &&
            <BackBadge>
                <TabBarBadge>
                    <TabBarCount>{notifPlace.place > 9 ? 9 + '+' : notifPlace.place}</TabBarCount>
                </TabBarBadge>
            </BackBadge>}
            {/* {props.route == 'Canceled' && notifCanceled.canceled > 0 && */}
            {props.route == 'Canceled' && notifCanceled.canceled > 0 &&
            <BackBadge>
                <TabBarBadge>
                    <TabBarCount>{notifCanceled.canceled > 9 ? 9 + '+' : notifCanceled.canceled}</TabBarCount>
                </TabBarBadge>
            </BackBadge>}
        </TabBarLabel>
        
    )
}