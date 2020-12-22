import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../firebase';

import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

const { height, width } = Dimensions.get('window');

export const wp = dimension => {
    // return wp2dp((dimension / 360) * 100 + '%');
    return wp2dp((dimension / 392.72) * 100 + '%');
    // return wp2dp((dimension / width) * 100 + '%');
};

export const hp = dimension => {
    // return hp2dp((dimension / 760) * 100 + '%');
    return hp2dp((dimension / 738.18) * 100 + '%');
    // return hp2dp((dimension / height) * 100 + '%');
};

export const normalize = size => {
    return ((wp(width) + hp(height)) * size) / (height + width);
    // return ((wp(width) + hp(height)) * size) / (height - width);
}

// export const normalize = size => {
//     return ((hp(640) + wp(360)) * size) / (hp(640) + wp(360));
// }

export function getHistory(cityId, order_history, setOrderHistory) {
    const requests = firebase.database().ref('requests');
    const canceled = firebase.database().ref('canceled');

    function getCanceled() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('deviceId')
                .then(deviceId => {
                    canceled.child(cityId).child(deviceId).on('value', snapshot => {
                        let newList = []
                        snapshot.forEach(childItem => {
                            if (!childItem.val().removed_from_history) {
                                let newChildItem = JSON.parse(JSON.stringify(childItem.val()))
                                newChildItem.response = 5
                                newChildItem.pushId = childItem.key
                                newChildItem.deviceId = deviceId
                                newList = [ ...newList, newChildItem ]
                            }
                        })
                        resolve(newList)
                    })
                })
        })
    }

    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('deviceId')
            .then(deviceId => {
                if (deviceId) {
                    requests.child(cityId).child(deviceId).on('value', snapshot => {
                        let newList = []
                        let condOrderHistory = order_history && order_history.length ? order_history : []
                        // let orderHistoryCopy = []
                        let orderHistoryCopy = JSON.parse(JSON.stringify(condOrderHistory))
                        let pushId = ''
                        // setOrderHistory([])
            
                        snapshot.forEach(childItem => {
                            let childItemCopy = JSON.parse(JSON.stringify(childItem.val()))
                            childItemCopy.pushId = childItem.key
                            childItemCopy.deviceId = deviceId
                            newList.push(childItemCopy)
                            pushId = childItem.key
                        })
    
                        const checkOrderHistData = order_history.some(item => item.id === cityId && item.data && item.data.length)
    
                        // if (order_history && order_history !== undefined) {
                        if (checkOrderHistData) {
    
                            // orderHistoryCopy = JSON.parse(JSON.stringify(order_history))
    
                            function findId(id) {
                                return newList.findIndex(item => item.id == id)
                            }
    
                            orderHistoryCopy.map((item, index) => {
                                if (item.id == cityId) {
    
                                    let newData = item.data.map((childItem, childIndex) => {
                                        let posId = findId(childItem.id)
                                        if (posId >= 0 ) {
                                            // orderHistoryCopy[index].data[childIndex] = newList[posId]
                                            childItem = newList[posId]
    
                                        } 
    
                                        // if (remove_enabled) {
                                        //     childItem.remove_enabled = true
                                        // }
    
                                        childItem.unformattedDate = new Date(childItem.unformattedDate)
                                        
                                        return childItem
                                    })
    
                                    const sortedData = newData.slice().sort((a, b) => {
                                        return b.unformattedDate - a.unformattedDate
                                    })
    
                                    let seen = {}
                                    let sortedDataNotDup = sortedData.filter(function(entry) {
                                        let previous;
                                        if (seen.hasOwnProperty(entry.id)) {
    
                                            previous = seen[entry.id]
                                            
                                            return false
                                        }
    
                                        seen[entry.id] = entry
    
                                        return true
                                    })
    
                                    item.data = sortedDataNotDup
                                    
                                    resolve(sortedDataNotDup)
                                    // console.log('-----------ANTES DE SETAR-----------')
                                    // console.log(orderHistoryCopy[index].data)
                                    // setOrderHistory(orderHistoryCopy)
                                    // console.log('-----------FIM DA FUNÇÃO-----------')
                                    // console.log(orderHistoryCopy[index].data)
                                }
    
                                return item
                            })
    
                            console.log('-----------ANTES DE SETAR-----------')
                            console.log(order_history)
                            setOrderHistory(orderHistoryCopy)
                            console.log('-----------FIM DA FUNÇÃO-----------')
                            console.log(order_history)
                        } else {
                            getCanceled().then(resp => {
                                newList = [ ...newList, ...resp ]
    
                                const sortedData = newList.slice().sort((a, b) => {
                                    return new Date(b.unformattedDate) - new Date(a.unformattedDate)
                                })
    
                                let seen = {}
                                let sortedDataNotDup = sortedData.filter(function(entry) {
                                    let previous;
                                    if (seen.hasOwnProperty(entry.id)) {
    
                                        previous = seen[entry.id]
                                        
                                        return false
                                    }
    
                                    seen[entry.id] = entry
    
                                    return true
                                })
    
                                if (!orderHistoryCopy.some(item => item.id == cityId)) {
                                    orderHistoryCopy.push({
                                        id: cityId,
                                        data: sortedDataNotDup,
                                    })
                                }
    
                                resolve(sortedDataNotDup)
                                setOrderHistory(orderHistoryCopy)
                            })
                        }

                        console.log('----------VALOR DE NEW_LIST----------')
                        console.log(newList)
                    })
                }
            })
    })

}

export function changeTheme(barStyle, background, setStatusBarTheme) {
    let newStatusBarTheme = {
        barStyle,
        background,
    }

    setStatusBarTheme(newStatusBarTheme)
}