import { NavigationActions } from 'react-navigation'

// function getCurrentRoute() {
//     let route = _navigator.state.nav
//     while(route.routes) {
//         route = route.routes[route.index]
//     }
//     return route
// }

// export default {
//     getCurrentRoute
// }

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    )
}

function getCurrentRoute() {
    let route = _navigator.state.nav;
    while (route.routes) {
        route = route.routes[route.index]
    }
    return route
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    getCurrentRoute
}