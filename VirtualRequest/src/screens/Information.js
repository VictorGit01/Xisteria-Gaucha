import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { normalize } from '../functions';
import PaymentIcon from 'react-payment-icons';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import firebase from '../../firebase';
import NetInfo from '@react-native-community/netinfo';

// Components:
import LoadingPage from '../components/LoadingPage';
import NoConnection from '../components/NoConnection';

const Page = styled.SafeAreaView`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: #b9f7bf;
`;

const Scroll = styled.ScrollView`
    width: 100%;
`

const HeaderTitle = styled.Text`
    font-size: ${normalize(20)}px;
    color: ${props => props.color || '#000'};
    margin-right: ${normalize(10)}px;
`

const Title = styled.Text`
    width: 100%
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #000;
    padding: ${normalize(20)}px ${normalize(20)}px ${normalize(10)}px;
    border-color: #ccc;
`

const Item = styled.View`
    width: 90%;
    flex-direction: row;
    align-items: flex-start;
    padding-vertical: ${normalize(15)}px;
    border-color: #999;
    border-bottom-width: ${normalize(.5)}px;
`
// padding: 15px 10px;

const SchedulesArea = styled.View`
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
`

const LeftItem = styled.View`
    flex-direction: row;
    justify-content: space-between;
`
// margin-right: 10px;

const RightItem = styled.View`
    flex-direction: row;
    justify-content: space-between;
`
// margin-left: 10px;

const ItemText = styled.Text`
    font-size: ${normalize(16)}px;
`

const Information = (props) => {
    const [ loading, setLoading ] = useState(true)
    const [ noConnection, setNoConnection ] = useState(false)
    const [ callNetInfo, setCallNetInfo ] = useState(false)
    const [ schedules, setSchedules ] = useState([])
    const [ schedulesP1, setSchedulesP1 ] = useState([])
    const [ schedulesP2, setSchedulesP2 ] = useState([])
    const [ address, setAddress ] = useState({})
    const [ phones, setPhones ] = useState([])
    const [ payMethods, setPayMethods ] = useState([])
    const [ dlvFee, setDlvFee ] = useState([])
    const [ open, setOpen ] = useState([])
    const [ infoCity, setInfoCity ] = useState([])
    const [ scheduledMin, setScheduledMin ] = useState({})

    const { cityId } = props

    const cities = firebase.database().ref('cities')

    const formPay = ['Dinheiro', 'Cartão na entrega']

    useEffect(() => {
        setLoading(true)

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setNoConnection(true)
                endOfLoading()
            } else {
                setNoConnection(false)
            }
            
        })
    }, [callNetInfo])

    useEffect(() => {
        let newInfoCity = []
        cities.child(cityId).on('value', snapshot => {
            newInfoCity.push(snapshot.val())

            endOfLoading()
        })
        setInfoCity(newInfoCity)
    }, [])

    useEffect(() => {
        let newPayMethods = []
        
        cities.child(cityId).on('value', snapshot => {
            snapshot.val().selectedPay.map(item => {
                newPayMethods.push(formPay[item])
            })
        })

        let seen = {}
        let newListNotDup = newPayMethods.filter(function(entry) {
            let previous;
            if (seen.hasOwnProperty(entry)) {

                previous = seen[entry]
                
                return false
            }

            seen[entry] = entry

            return true
        })

        setPayMethods(newListNotDup)
    }, [])

    useEffect(() => {
        let newPhones = []
        cities.child(cityId).on('value', snapshot => {
            let phone1 = snapshot.val().phone1 ? `(${snapshot.val().ddd1}) ${onPhoneChange(snapshot.val().phone1)}` : null
            let phone2 = snapshot.val().phone2 ? `(${snapshot.val().ddd2}) ${onPhoneChange(snapshot.val().phone2)}` : null

            newPhones.push(phone1, phone2)
        })
        console.log('PHONES')
        console.log(newPhones)

        let seen = {}
        let newListNotDup = newPhones.filter(function(entry) {
            let previous;
            if (seen.hasOwnProperty(entry) || entry == null) {

                previous = seen[entry]
                
                return false
            }

            seen[entry] = entry

            return true
        })
        
        setPhones(newListNotDup)
    }, [])

    useEffect(() => {
        let newAddress = {}
        cities.child(cityId).on('value', snapshot => {
            newAddress = {
                city: snapshot.val().city,
                district: snapshot.val().district,
                address: snapshot.val().address,
                number: snapshot.val().number,
            }
            setOpen(snapshot.val().open)
            setScheduledMin(snapshot.val().scheduledMin)
        })
        setAddress(newAddress)
    }, [])

    useEffect(() => {
        console.log('SCHEDULED_MIN')
        console.log(scheduledMin)
    }, [scheduledMin])

    useEffect(() => {
        let newSchedules = []
        let schedulesCopy = []
        let newSchedulesP1 = []
        cities.child(cityId).on('value', snapshot => {
            let newSchedulesP2 = []
            // snapshot.val().schedulesP2.map((item, index) => {
            //     newSchedulesP2[index] = item.id
            //     // console.log(item.id)
            //     // schedulesCopy[item.id].begin
            // })
            // console.log(newSchedulesP2)
            
            snapshot.val().schedulesP1.map((item, index) => {
                // console.log('---------SCHEDULESP1---------')
                // console.log(item.id)


                // console.log('---------SCHEDULESP2---------')
                // console.log(index)
                // console.log(snapshot.val().schedulesP2.findIndex(it => {return it.id === item.id}))
                // let condP2 = snapshot.val().schedulesP2.findIndex(findItem => {return findItem.id === item.id})



                /*
                console.log(snapshot.val().schedulesP2[item.id] ? snapshot.val().schedulesP2[index].id : undefined)
                let condP2 = snapshot.val().schedulesP2[index] ? snapshot.val().schedulesP2[index].id : undefined

                console.log(item.id === condP2)
                */


                let condP2 = snapshot.val().schedulesP2 && snapshot.val().schedulesP2[index]



                
                // console.log(snapshot.val().schedulesP2[index] && (index == snapshot.val().schedulesP2[index].id) ? true : false)
                // console.log(snapshot.val().schedulesP2[index] && (schedulesP1[index].includes(snapshot.val().schedulesP1[index].id)) ? true : false)
                newSchedules.push({
                    id: item.id,
                    day: item.day,
                    beginP1: item.begin,
                    endP1: item.end,
                    // beginP2: snapshot.val().schedulesP2[index] ? snapshot.val().schedulesP2[index].begin : '',
                    // ÚLTIMO:
                    // beginP2: snapshot.val().schedulesP2[index] && newSchedulesP2.indexOf(item.id) != -1 ? snapshot.val().schedulesP2[index].begin : '',
                    beginP2: condP2 ? snapshot.val().schedulesP2[index].begin : '',
                    // beginP2: (condP2 !== undefined && condP2 !== -1) ? snapshot.val().schedulesP2[index].begin : '',
                    // endP2: snapshot.val().schedulesP2[index] ? snapshot.val().schedulesP2[index].end : '',
                    // ÚLTIMO:
                    // endP2: snapshot.val().schedulesP2[index] && newSchedulesP2.indexOf(item.id) != -1 ? snapshot.val().schedulesP2[index].end : '',
                    endP2: condP2 ? snapshot.val().schedulesP2[index].end : '',
                    // endP2: (condP2 !== undefined && condP2 !== -1) ? snapshot.val().schedulesP2[index].end : '',
                })
                // console.log(`INDEX: ${index}`)
            })
 
        })


        let seen = {}
        let newListNotDup = newSchedules.filter(function(entry) {
            let previous;
            if (seen.hasOwnProperty(entry.id)) {

                previous = seen[entry.id]
                
                return false
            }

            seen[entry.id] = entry

            return true
        })

        // newSchedulesP1 = snapshot.val().schedulesP1
        // newSchedulesP2 = snapshot.val().schedulesP2
        // console.log('---------IGUAL---------')
        

        // console.log('---------LIST---------')
        // console.log(newSchedules)
        setSchedules(newListNotDup)
        // setSchedulesP1(newSchedulesP1)
        // setSchedulesP2(newSchedulesP2)
    }, [])

    function endOfLoading() {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    function onPhoneChange(text) {
        let cleaned = ('' + text).replace(/\D/g, '')

        let part1;
        let part2;
        let newPhone;

        if (cleaned.length <= 8) {
            part1 = cleaned.slice(0, 4);
            part2 = cleaned.slice(4, 8);

            newPhone = part1 + '-' + part2;
            return newPhone
        } else if (cleaned.length === 9) {
            part1 = cleaned.slice(0, 5);
            part2 = cleaned.slice(5, 9);

            newPhone = part1 + '-' + part2;
            return newPhone
        }
    }

    let last_index_sche = schedules.length - 1
    let last_index_formPay = payMethods.length - 1

    if (loading) {
        return (
            <LoadingPage />
        )
    } else if (noConnection) {
        return (
            <Page style={{ justifyContent: 'center' }} >
                <NoConnection onPress={() => setCallNetInfo(!callNetInfo)} />
            </Page>
        )
    }

    return (
        <Page>
            <Scroll contentContainerStyle={{ alignItems: 'center', paddingBottom: normalize(80) }} >
                <Item style={{ alignItems: 'center', paddingVertical: normalize(40) }} >
                    <HeaderTitle color={open ? 'green' : 'red'} >{open ? 'Aberto' : 'Fechado'}</HeaderTitle>
                    <FontIcon name={open ? 'door-open' : 'door-closed'} size={normalize(20)} color={open ? 'green' : 'red'} />
                </Item>
                <Title>Horários de entrega</Title>
                {schedules.map((item, index) => (
                    <Item key={index} style={{ borderBottomWidth: index == last_index_sche ? normalize(.5) : 0 }} >
                        <ItemText style={{ marginRight: normalize(10), width: '25%' }} >{item.day}</ItemText>
                        <SchedulesArea>
                            {/* <LeftItem> */}
                                <ItemText >{item.beginP1}</ItemText>
                                <ItemText style={{ marginHorizontal: normalize(10) }} >às</ItemText>
                                <ItemText>{item.endP1}</ItemText>
                            {/* </LeftItem> */}
                            {item.beginP2 ?
                            <>
                                <ItemText style={{ marginHorizontal: normalize(10) }} >-</ItemText>
                                <ItemText >{item.beginP2}</ItemText>
                                <ItemText style={{ marginHorizontal: normalize(10) }} >às</ItemText>
                                <ItemText>{item.endP2}</ItemText>
                            </>
                            : null}
                        </SchedulesArea>
                    </Item>
                ))}
                <Title>Formas de pagamento</Title>
                {payMethods.map((item, index) => (
                    <Item key={index} style={{ borderBottomWidth: index === last_index_formPay ? normalize(.5) : 0 }} >
                        <ItemText>{item}</ItemText>
                    </Item>
                ))}

                <Title>Tempo estimado de espera</Title>
                <Item>
                    <ItemText>De {scheduledMin.startMin} a {scheduledMin.finalMin} minutos</ItemText>
                </Item>

                <Title>Contatos</Title>
                <Item style={{ flexWrap: 'wrap' }} >
                {phones.map((item, index) => (
                    <ItemText key={index} >{index > 0 && item !== null ? ' / ' : ''}{item}</ItemText>
                ))}
                </Item>
                
                <Title>Endereço</Title>
                <Item >
                    <ItemText>
                        {address.city + ' - '}
                        {address.district + ' / '}
                        {address.address + ' / '}
                        {address.number}
                    </ItemText>
                </Item>
            </Scroll>
        </Page>
    );
}

Information.navigationOptions = () => {
    return {
        headerTitle: 'Informações',
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId
    }
}

export default connect(mapStateToProps)(Information);

{/* {schedulesP1.map((item, index) => (
    <Item key={index} >
        <>

            <ItemText style={{ marginRight: 10, width: '25%' }} >{item.day}</ItemText>
            <LeftItem>
                <ItemText >{item.begin}</ItemText>
                <ItemText style={{ marginHorizontal: 10 }} >às</ItemText>
                <ItemText>{item.end}</ItemText>
            </LeftItem>

        </>
    </Item>
))}
{schedulesP2 && schedulesP2.map((item, index) => (
    <Item>
        <ItemText>-</ItemText>
        <RightItem>
            <ItemText >{item.begin}</ItemText>
            <ItemText style={{ marginHorizontal: 10 }} >às</ItemText>
            <ItemText>{item.end}</ItemText>
        </RightItem>
    </Item>
))} */}