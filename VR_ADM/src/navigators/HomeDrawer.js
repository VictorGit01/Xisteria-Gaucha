import { createDrawerNavigator } from 'react-navigation-drawer';
import { normalize } from '../functions';

// Navigators:
import HomeStack from './HomeStack';
import ClientsStack from './ClientsStack';
import MenuStack from './MenuStack';
import DeliveryAreaStack from './DeliveryAreaStack';
import ProdSitesStack from './ProdSitesStack';
import InfoCityStack from './InfoCityStack';
import OpeningHoursStack from './OpeningHoursStack';
import BannersStack from './BannersStack';

// Screens:
import Login from '../screens/Login';

// Components:
import CustomDrawer from '../components/CustomDrawer';

const HomeDrawer = createDrawerNavigator({
    HomeStack: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'Início',
        }
    },
    ClientsStack: {
        screen: ClientsStack,
        navigationOptions: {
            drawerLabel: 'Clientes'
        }
    },
    MenuStack: {
        screen: MenuStack,
        navigationOptions: {
            drawerLabel: 'Cardápio',
        },
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
    },
    BannersStack: {
        screen: BannersStack,
        navigationOptions: {
            drawerLabel: 'Definir banner'
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            drawerLabel: 'Sair'
        }
    }
}, {
    initialRouteName: 'HomeStack',
    contentComponent: CustomDrawer,
    contentOptions: {
        labelStyle: {
            fontSize: normalize(16),
            fontWeight: 'normal'
        },
        // activeTintColor: '#000',
        // activeBackgroundColor: 'rgba(0, 255, 0, 0.03)'
    }
});

export default HomeDrawer;