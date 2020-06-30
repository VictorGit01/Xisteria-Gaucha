import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';

import ProdSites from '../screens/ProdSites';

const ProductionSites = createStackNavigator({
    ProdSites: {
        screen: ProdSites
    }
}, {
    defaultNavigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
            backgroundColor: '#077a15'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
})

export default ProductionSites;