import React, { useEffect } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import HomeDrawer from '../navigators/HomeDrawer'

export default () => {
    useEffect(() => {
        console.log('ENTROU NO HOME DRAWER AGORA')
    }, [])

    // return (
    //     <View style={styles.container}>
    //         {HomeDrawer}
    //     </View>
    // )

    return HomeDrawer
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    }
})