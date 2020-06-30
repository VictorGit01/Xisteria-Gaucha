import React, { useState, useContext } from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { StatusBar } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import { store, persistor } from './src/Store'
import MainStackNavigator from './src/navigators/MainStackNavigator'

// Contexts:
import ActiveContext from './src/contexts/ActiveContext'
import ToTopContext from './src/contexts/ToTopContext'
import ItemsOrderContext from './src/contexts/ItemsOrderContext'

import NavigationService from './helpers/NavigationService'

const AppContainer = createAppContainer(MainStackNavigator)

// const prevGetStateForActionHomeStack = RootStack.router.getStateForAction;
// RootStack.router.getStateForAction = (action, state) => {
//     if (state && action.type === 'ReplaceCurrentScreen') {
//         const routes = state.routes.slice(0, state.routes.length - 1);
//         routes.push(action);
//             return {
//                 ...state,
//                 routes,
//                 index: routes.length - 1,
//             };
//     }
// return prevGetStateForActionHomeStack(action, state);
// };

// // call this function whenever you want to replace a screen
// this.replaceScreen('routename')
// replaceScreen = (route) => {
//     // const { locations, position } = this.props.navigation.state.params;
//     this.props.navigation.dispatch({
//     type: 'ReplaceCurrentScreen',
//     key: route,
//     routeName: route,
//     // params: { locations, position },
//     });
// };

export default () => {
    const [ activeScreen, setActiveScreen ] = useState('foods')
    const [ itemsOrder, setItemsOrder ] = useState(0)
    const [ top, setTop ] = useState(false)

    return (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor} >
                <ActiveContext.Provider value={[activeScreen, setActiveScreen]} >
                    <ToTopContext.Provider value={[top, setTop]} >
                        {/* <ItemsOrderContext value={[itemsOrder, setItemsOrder]} > */}
                            <StatusBar barStyle='light-content' backgroundColor='#077a15' />
                            <AppContainer/>
                        {/* </ItemsOrderContext> */}
                    </ToTopContext.Provider>
                </ActiveContext.Provider>
            </PersistGate>
        </Provider>
    )
}

// backgroundColor='#075715'