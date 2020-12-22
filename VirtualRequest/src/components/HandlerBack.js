import React, { useEffect, useState } from 'react';
import { withNavigation, NavigationEvents } from 'react-navigation';
import { BackHandler } from 'react-native';

import ToHomeContext from '../contexts/ToHomeContext';

const HandlerBack = ({ children, onBack, navigation }) => {
    // let didFocus = navigation.addListener('didFocus', payload => {
    //     BackHandler.addEventListener('hardwareBackPress', onBack)
    //     console.log('função ativada.')
    // })

    // let willBlur;

    // useEffect(() => {
    //     willBlur = navigation.addListener('willBlur', payload => {
    //         BackHandler.removeEventListener('hardwareBackPress', onBack)
    //     })

    //     return () => {
    //         didFocus.remove();
    //         willBlur.remove();
    //         BackHandler.removeEventListener('hardwareBackPress', onBack);
    //     }
    // }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBack)
        }
    }, [])

    return children;
}

export default HandlerBack;