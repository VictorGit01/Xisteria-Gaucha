import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import firebase from '../../firebase';

// Components:
import LoadingPage from '../components/LoadingPage';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const SectionInfo = styled.View`
    width: 100%;
    justify-content: center;
    padding: ${normalize(15)}px;
    background-color: #eee;
`
// padding: 10px;
// padding: ${normalize(100)}px;
// padding: ${normalize(11.30)}px;
// padding: ${normalize(10)}px;

const TitleInfo = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #333;
`
// font-size: 20px;
// font-size: ${normalize(57)}px;
// font-size: ${normalize(19.84)}px;

const AreaInfo = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${normalize(10)}px ${normalize(15)}px;
`
// padding: 10px 10px
// padding: ${normalize(110)}px;
// padding: ${normalize(10.28)}px;


const RightArea = styled.View`
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
`

const TextInfo = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: ${props => props.weight || 'normal'};
    color: #000;
    text-align: right;
`

const Separator = styled.View`
    height: ${normalize(1)}px;
    width: 100%;
    background-color: #ccc;
`
// margin-bottom: ${normalize(56.6)}px;

const Screen = (props) => {
    const [ loading, setLoading ] = useState(true);

    const { navigation } = props
    const params = navigation.state.params
    const { data } = params
    const { 
        id, 
        name, 
        surname, 
        city, 
        district, 
        street, 
        number, 
        landmark, 
        ddd, 
        phone, 
        orderQtt,
    } = data
    const full_name = `${name} ${surname}`

    const currentCity = firebase.auth().currentUser
    const users = firebase.database().ref('users')

    useEffect(() => {
        // alert(`NORMALIZE 110: ${normalize(110)}`)
        if (currentCity) {
            const cityId = currentCity.uid

            // console.log('------------CITY_ID AND USER_ID------------')
            // console.log(cityId)
            // console.log(id)
            users.child(cityId).child(id).child('count').set(0)
        }
    }, [])

    function formatPhone() {
        let part1;
        let part2;
        let ajustedPhone;

        if (phone.length >= 9) {
            part1 = phone.slice(0, 5)
            part2 = phone.slice(5, 9)
            ajustedPhone = `(${ddd}) ${part1}-${part2}`
            return ajustedPhone
        } else if (phone.length == 8) {
            part1 = phone.slice(0, 4)
            part2 = phone.slice(4, 8)
            ajustedPhone = `(${ddd}) ${part1}-${part2}`
            return ajustedPhone
        }
    }

    return (
        <Page>
            <Scroll>
                <SectionInfo>
                    <TitleInfo>Dados</TitleInfo>
                </SectionInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Nome:</TextInfo>
                    <RightArea>
                        <TextInfo>{full_name}</TextInfo>
                    </RightArea>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Número de contato:</TextInfo>
                    <RightArea>
                        <TextInfo>{formatPhone()}</TextInfo>
                    </RightArea>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Qtd. de pedidos feitos:</TextInfo>
                    <RightArea>
                        <TextInfo>{orderQtt}</TextInfo>
                    </RightArea>
                </AreaInfo>

                <SectionInfo>
                    <TitleInfo>Endereço</TitleInfo>
                </SectionInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Cidade:</TextInfo>
                    <RightArea>
                        <TextInfo>{city}</TextInfo>
                    </RightArea>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Bairro:</TextInfo>
                    <RightArea>
                        <TextInfo>{district}</TextInfo>
                    </RightArea>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Rua / Avenida:</TextInfo>
                    <RightArea>
                        <TextInfo>{street}</TextInfo>
                    </RightArea>
                </AreaInfo>
                <AreaInfo>
                    <TextInfo weight='bold' >Número:</TextInfo>
                    <RightArea>
                        <TextInfo>{number}</TextInfo>
                    </RightArea>
                </AreaInfo>
                {landmark && landmark.length ?
                <AreaInfo>
                    <TextInfo weight='bold' >Ponto de referência:</TextInfo>
                    <RightArea>
                        <TextInfo>{landmark}</TextInfo>
                    </RightArea>
                </AreaInfo> : null}
                <Separator></Separator>
            </Scroll>
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        headerTitle: 'Informações'
    }
}

export default Screen;