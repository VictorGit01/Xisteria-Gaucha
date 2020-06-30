import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { StatusBar } from 'react-native'
import { createAppContainer } from 'react-navigation'
import Store from './src/Store'
import uuid from 'uuid/v4'

// Components:
import Loader from './src/components/Loader'

// Navigators:
import MainStackNavigator from './src/navigators/MainStackNavigator'

// Contexts:
import MenuListContext from './src/contexts/MenuListContext'
import DataDetailsContext from './src/contexts/DataDetailsContext'
import ListAddOnsContext from './src/contexts/ListAddOnsContext'
import LoaderContext from './src/contexts/LoaderContext'

const AppContainer = createAppContainer(MainStackNavigator)

export default () => {
    const [ menuList, setMenuList ] = useState([])
    const [ dataDetails, setDataDetails ] = useState({
        // id: uuid(),
        publish: true,
        name: '',
        price: '',
        description: '',
        image: null,
        // days: [
        //     {id: 0, name: 'Domingo', active: true},
        //     {id: 1, name: 'Segunda', active: true},
        //     {id: 2, name: 'Terça', active: true},
        //     {id: 3, name: 'Quarta', active: true},
        //     {id: 4, name: 'Quinta', active: true},
        //     {id: 5, name: 'Sexta', active: true},
        //     {id: 6, name: 'Sábado', active: true},
        // ]
        days: [
            'Domingo',
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sábado',
        ]
    })
    const [ listAddOns, setListAddOns ] = useState(null)
    const [ loaderVisible, setLoaderVisible ] = useState(false)

    const onBack = () => {
        if (loaderVisible) {
            return true
        }
        return false
    }

    return (
        <Provider store={Store} >
            <LoaderContext.Provider value={[ loaderVisible, setLoaderVisible ]} >
                <MenuListContext.Provider value={[menuList, setMenuList]} >
                    <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                    <DataDetailsContext.Provider value={[ dataDetails, setDataDetails ]} >
                        <ListAddOnsContext.Provider value={[ listAddOns, setListAddOns ]} >
                            <AppContainer/>
                        </ListAddOnsContext.Provider>
                    </DataDetailsContext.Provider>
                </MenuListContext.Provider>
                {loaderVisible ? <Loader onBack={onBack} /> : null}
            </LoaderContext.Provider>
        </Provider>
    )
}