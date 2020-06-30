/* Helpers for navigation */

import NavigationActions from './NavigationActions'

export default function(navigation) {
    return {
        ...navigation,
        replaceWithAnimation: (routeName, params, action) => 
            navigation.dispatch(
                NavigationActions.replaceWithAnimation({ routeName, params, action })
            )        
    }

};