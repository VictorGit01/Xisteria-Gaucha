import React from 'react';
import PaymentIcon from 'react-payment-icons';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5Pro'

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #b9f7bf;
`;

const Information = () => {
    return (
        <Page>
            <FontIcon name='map-marker-times' size={20} color='#000' brand />
        </Page>
    );
}

Information.navigationOptions = () => {
    return {
        headerTitle: 'Informações',
    }
}

export default Information;