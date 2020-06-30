import { createDrawerNavigator } from 'react-navigation-drawer';

// Navigators:
import HomeStack from './HomeStack';
import MenuStack from './MenuStack';
import DeliveryAreaStack from './DeliveryAreaStack';
import ProdSitesStack from './ProdSitesStack';
import InfoCityStack from './InfoCityStack';
import OpeningHoursStack from './OpeningHoursStack';

const HomeDrawer = createDrawerNavigator({
    HomeStack: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'Início'
        }
    },
    MenuStack: {
        screen: MenuStack,
        navigationOptions: {
            drawerLabel: 'Cardápio'
        }
    },
    // DeliveryAreaStack: {
    //     screen: DeliveryAreaStack,
    //     navigationOptions: {
    //         drawerLabel: 'Área de entrega'
    //     }
    // },
    ProdSitesStack: {
        screen: ProdSitesStack,
        navigationOptions: {
            drawerLabel: 'Locais de produção'
        }
    },
    InfoCityStack: {
        screen: InfoCityStack,
        navigationOptions: {
            drawerLabel: 'Dados da cidade'
        }
    },
    OpeningHoursStack: {
        screen: OpeningHoursStack,
        navigationOptions: {
            drawerLabel: 'Horários de funcionamento'
        }
    }
}, {
    defaultNavigationOptions: {
        
    }
});

export default HomeDrawer;