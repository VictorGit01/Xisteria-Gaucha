import React, { useState, useEffect, useContext, useRef } from 'react'
import { connect } from 'react-redux'
import { ToastAndroid, Platform, YellowBox, Dimensions, StatusBar } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { normalize } from '../functions'
import styled from 'styled-components/native'
import uuid from 'uuid/v4'
import firebase from '../../firebase'

// Components:
import TopArea from '../components/InfoSnack/TopArea'
import BottomArea from '../components/InfoSnack/BottomArea'

// Contexts:
// import ItemsOrderContext from '../contexts/ItemsOrderContext'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    justify-content: flex-start;
    align-items: center;
    background-color: #b9f7bf;
`
//padding-horizontal: 20px

const ScrollPage = styled.ScrollView`
    flex: 1;
    width: 100%
`

const Input = styled.TextInput`
    height: 40px;
    width: 90%;
    align-self: center;
    border: ${normalize(1)}px solid #ccc;
    padding: ${normalize(5)}px;
`

const ModalLoading = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    background-color: rgba(0, 0, 0, .5);
`
//background-color: rgba(0, 0, 0, .5)

const Title = styled.Text`
    font-size: ${Platform.Version <= 23 ? normalize(19) : normalize(20)}px;
    color: #000;
    text-align: center;
`

const ButtonAddArea = styled.View`
    height: ${normalize(90)}px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-top-width: ${normalize(.5)}px;
    border-color: #999;
    bottom: 0px;
`
// height: ${normalize(80)}px
// height: ${normalize(100)}px

const ButtonAdd = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    elevation: 2;
`

const TextButton = styled.Text`
    font-size: ${normalize(18)}px;
    color: #fff;
    text-align: center;
`

const Screen = (props) => {
    const { navigation } = props
    const params = navigation.state.params
    let price = Number(params.data.price)

    const [ list, setList ] = useState([])
    // //const [ extra, setExtra ] = useState(params.extra)
    const [ amount, setAmount ] = useState(1)
    const [ priceInfo, setPriceInfo ] = useState(price)
    const [ note, setNote ] = useState('')
    // // const [ itemsOrder, setItemsOrder ] = useContext(ItemsOrderContext)
    const [ openPlace, setOpenPlace ] = useState(false)
    const [ statusBarTheme, setStatusBarTheme ] = useState({
        barStyle: 'light-content',
        background: '#077a15',
    })

    const sectionListRef = useRef()

    const cities = firebase.database().ref('cities')
    const posts = firebase.database().ref('posts')
    const add_ons = firebase.database().ref('add-ons')
    // const cityId = 'U56Sf1atD5TKSCJzxsKsvIDDlTr2'

    // let params = props.navigation.state.params
    let nav = props.navigation.navigate
    let goBack = props.navigation.goBack
    
    let { list_request, setListRequest, current_requests, setCurrentRequests, total, setTotal, cityId } = props
    

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            // console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            // console.log(intCleaned)
            if (newCleaned.length === 0) {
                return '00'
            } else if (newCleaned.length === 1) {
                return '0' + newCleaned
            } else {
                return newCleaned.slice(-2)
            }
        }

        function afterPoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length <= 2) {
                return '0'
            } else {
                return newCleaned.slice(-5, -2)
            }
        }

        function beforePoint() {
            let intCleaned = conv_num(parseInt(cleaned))
            let newCleaned = intCleaned.toString()
            if (newCleaned.length >= 6) {
                return newCleaned.slice(-8, -5) + '.'
            } else {
                return ''
            }
        }

        let num_format = 'R$ ' + beforePoint() + afterPoint() + ',' + afterComma()

        return num_format
    }


    // call this function whenever you want to replace a screen
    // this.replaceScreen('routename')
    // const replaceScreen = (route) => {
    //     // const { locations, position } = this.props.navigation.state.params;
    //     props.navigation.dispatch({
    //     type: 'ReplaceCurrentScreen',
    //     key: route,
    //     routeName: route,
    //     // params: { locations, position },
    //     });
    // };

    useEffect(() => {
        cities.child(cityId).on('value', snapshot => {
            // console.log('---------------LOCAL ABERTO?---------------')
            // console.log(snapshot.val().open)
            setOpenPlace(snapshot.val().open)
        })
    }, [])

    useEffect(() => {
        list_request.map(item => {
            if (item.id == cityId) {
                // console.log(item.data)
            }
        })
        // setPriceInfo(price)
        let dataId = params.data.id

        add_ons.child(cityId).child(dataId).on('value', snapshot => {
            let newList = snapshot.val() ? Array.from(snapshot.val()) : []
            // console.log('---------------ANTIGA LISTA---------------')
            // console.log(newList)
            let must = 'must'
            newList.forEach((item) => {
                item.minQtt = item.minQtt.length == 0 ? 0 : Number(item.minQtt)
                item.maxQtt = item.maxQtt.length == 0 ? 0 : Number(item.maxQtt)
                // item.amount = item.must && item.maxQtt == 1 ? 1 : 0
            })
            // console.log('---------------NOVA LISTA---------------')
            // console.log(newList)
            // snapshot.forEach((childItem) => {
            //     console.log(childItem.val())
            // })
            // let newList = []
            // snapshot.forEach((childItem) => {
            //     newList.push(childItem.val())
            // })
            // setList(newList)
            setList(newList)
            // console.log('---------------ATUAL LISTA---------------')
            // console.log(list)
            // console.log(newList)
        })
        // console.log(props.navigation)
    }, [])

    

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(280),
        )
    }

    function scrollTo(ind) {
        sectionListRef.current.scrollToLocation({
            animated: true,
            sectionIndex: ind,
            itemIndex: 0,
            // viewOffset: -15
            viewOffset: ind == 0 ? normalize(-205) : 0
        })
    }

    // useEffect(() => {
    //     YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside'])

    //     let sectionId = params.sectionId
    //     let dataId = params.data.id
    //     // posts.child(sectionId).child('data').child(dataId).on('value', snapshot => {
    //         //     newList.push(snapshot.val())
    //         // })
    //     add_ons.child(dataId).on('value', snapshot => {
    //         // let newList = []
    //         // snapshot.forEach((childItem) => {
    //         //     newList.push(childItem.val())
    //         // })
    //         // setList(newList)
    //         setList(snapshot.val())
    //         // console.log(newList)
    //     })
    //     // console.log(params.data)
    // }, [])

    // const extra = {
    //     potatoChips: {name: 'Porção de batata frita', price: 10},
    //     egg: {name: 'Ovo', price: 1},
    //     beef: {name: 'Carne', price: 1},
    //     onion: {name: 'Cebola', price: 1},
    //     chicken: {name: 'Frango', price: 1.5},
    //     bacon: {name: 'Bacon', price: 2},
    //     pepperoni: {name: 'Calabresa', price: 2}
    // }

    // // Extra:
    // const [ potChipsActive, setPotChipsActive ] = useState(false)
    // const [ eggActive, setEggActive ] = useState(false)
    // const [ beefActive, setBeefActive ] = useState(false)
    // const [ onionActive, setOnionActive ] = useState(false)
    // const [ chickenActive, setChickenActive ] = useState(false)
    // const [ baconActive, setBaconActive ] = useState(false)
    // const [ pepperoniActive, setPepperoniActive ] = useState(false)
    // const [ extraPrice, setExtraPrice ] = useState(0)
    // const [ count, setCount ] = useState(false)
    // const [ indicator, setIndicator ] = useState(true)
    // const [ modalIndicator, setModalIndicator ] = useState(false)

    // let extraList = []
    // let listExtraPrice = []
    // let total = 0
    // let TOT = 0
    // let nav = props.navigation.navigate

    // const toastMsg = (msg) => {
    //     ToastAndroid.showWithGravityAndOffset(
    //         msg.toString(),
    //         ToastAndroid.SHORT,
    //         ToastAndroid.BOTTOM,
    //         0,
    //         180
    //     )
    // }

    // function addActive(name, active, price) {
    //     //let activePrice = priceInfo
    //     if (active == true) {
    //         //console.log('Active é true')
    //         extraList.push({
    //             name: name,
    //             price: price
    //         })
    //         //activePrice = activePrice + extraPrice
    //         //setPriceInfo(activePrice)
    //         // console.log(priceInfo)
    //     } else {
    //         // console.log('Active é false')
    //     }
    //     //console.log(`${extra} - ${active}`)
    // }

    useEffect(() => {
        console.log(list)
    }, [list])

    const handleSum = () => {
        let sum = amount
        // let sum_price = params.price
        let sum_price = priceInfo / sum

        // sum <= 4 ? sum++ : sum = 5
        sum <= 98 ? sum++ : sum = 99
        sum_price *= sum

        setAmount(sum)
        setPriceInfo(sum_price)
    }

    const handleSub = () => {
        let sub = amount
        let sub_price = priceInfo
        // let div_price = sub_price / sub
        let div_price = priceInfo / sub

        // sub > 1 ? (sub_price -= div_price, sub--) : sub = 1
        sub > 1 ? sub-- : sub = 1
        div_price *= sub

        // console.log()

        setAmount(sub)
        setPriceInfo(div_price)
    }

    // // let count = 1

    // const handleAdd = () => {
    //     if(amount <= 0) {
    //         alert('Por favor, adicione produtos!')
    //     } else {
    //         if (!count) {
    //             props.list_request.push({
    //                 id: uuid(),
    //                 snack: params.snack,
    //                 price: params.price,
    //                 total_price: priceInfo,
    //                 totalPriceExtra: Number(priceInfo) + Number(extraPrice),
    //                 amount: amount,
    //                 extraList: extraList
    //                 /*
    //                 potato_chips: params.potato_chips,
    //                 extra: params.extra,
    //                 */
    //                 //egg: eggActive ? params.extra.egg.name : null
    
    //             })

    //             // console.log(extraList)
            
    //             props.setListRequest([...props.list_request])

    //             setTimeout(() => {
    //                 toastMsg('Item adicionado à sua sacola.')
    //             }, 200)

    //             props.navigation.goBack()

    //             setCount(true)
    //         }
    //     }
    //     // console.log(`Após clicar ${count}`)
    // }

    // useEffect(() => {
    //     if (params.stuff) {
    //         addActive(extra.potatoChips.name, potChipsActive, extra.potatoChips.price)
    //         addActive(extra.egg.name, eggActive, extra.egg.price)
    //         addActive(extra.beef.name, beefActive, extra.beef.price)
    //         addActive(extra.onion.name, onionActive, extra.onion.price)
    //         addActive(extra.chicken.name, chickenActive, extra.chicken.price)
    //         addActive(extra.bacon.name, baconActive, extra.bacon.price)
    //         addActive(extra.pepperoni.name, pepperoniActive, extra.pepperoni.price)

    //         total = extraList.reduce(function(tot, y) {return tot + y.price}, 0)
    //         setExtraPrice(total)
    //     }

    // }, [addActive])

    // useEffect(() => {
    //     if (list) {
    //         let conv_num = num => isNaN(num) ? 0 : num
    //         let items = list.reduce(item => {return item})
    //         let list_amount = items.data.map(a => { return a.amount * a.price })
    //         let result_amount = list_amount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)
    //         console.log(result_amount)
    //         let result_price = result_amount == 0 ? priceInfo : priceInfo + result_amount
    //         setPriceInfo(result_price)
    //         // list.forEach((item) => {
    //             // let list_amount = item.data.map(a => { return a.amount * a.price })
    //             // let result_amount = list_amount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)
    //             // console.log(result_amount)
    //         // })
    //     }
    // }, [list])

    function handleAdd() {
        if (openPlace) {
            // Estava retornando undefined para os itens que estavam fora da condição:
            // let list_must = list.map((item, index) => {
            //     if (item.must && item.must == true) {
            //         // if (item == 'undefined' || !item || item == null) {}
            //         // console.log(item)
            //         return index
            //         // toastMsg('Marque itens na seção obrigatória.')
            //     }
            //     // console.log(item)
            // })

            // Resolvido com a função filter inserida antes de dá um map:
            // let list_must = list.filter((item, index) => {
            //     if (item.must && item.must == true) {
            //         // if (item == 'undefined' || !item || item == null) {}
            //         // console.log(item)
            //         return true
            //         // toastMsg('Marque itens na seção obrigatória.')
            //     }
            //     // console.log(item)
            // }).map((item, index) => index)

            // Encurtando código:
            let list_must = list.filter((item) => item.must && item.must == true).map((item, index) => index)





            // let lis = []
            // let list_reverse = list_must.reverse()
            // let list_final = list_reverse.map((item, index) => {
            //     // if (item == 'undefined' || !item || item == null) { 
            //     //     // list_reverse.splice(index, 1)
            //     //     return false
            //     // }
            //     // return true
            //     return item
            // })
            // let list_reverse = list_must.reverse().filter(item => {
            let list_reverse = list_must.filter(item => {
                if (item == 'undefined' || item == null || isNaN(item)) {
                    return false
                }
                return true
            })
            // list_reverse.forEach(item => scrollTo(item))
            let value_index = list_reverse.length > 0 ? list_reverse.reduce(function(a, b) { return (a < b) ? a : b }) : null
            console.log('------------VALUE_INDEX------------')
            console.log(!isNaN(value_index))
            console.log('------------LIST_MUST------------')
            console.log(list_must)
            console.log('------------LIST_MUST.LENGTH------------')
            console.log(list_must.length)
            if (!isNaN(value_index) && list_must && list_must.length > 0 ) {
                scrollTo(value_index)
                toastMsg('Selecione os itens obrigatórios.')
                console.log('------------TOTAL EM REQUEST------------')
                console.log(total)
            }
            console.log('=============================================================')

            console.log('------------LIST_REVERSE------------')
            console.log(list_reverse)
            console.log('------------LIST_REVERSE.LENGTH------------')
            console.log(list_reverse)
            console.log('------------!LIST_REVERSE------------')
            console.log(!list_reverse)

            // console.log(value_index)
            if ((list_reverse && list_reverse.length == 0) || !list_reverse) {
                // let listCopy = Array.from(list)
                let newListRequest = Array.from(list_request)
                let newListCurrent = Array.from(current_requests)
                let objList = {}
                // let otherList = list.map(itemMap => {
                //     return itemMap.data.map(item => { if (item.amount > 0) return item })
                // })
    
                console.log('------------NEW_LIST_REQUEST BEFORE------------')
                console.log(newListRequest)
    
                let seen = {}
                let otherList = []
                list.filter((entry, index) => {
                    // let previous;
                    // previous = entry.data
                    // otherList = [...otherList, entry.data]
                    entry.data.map(item => {
                        if (item.amount > 0) {
                            otherList = [...otherList, item]
                        }
                    })
                })
                // otherList[0] 
                objList.name = params.data.name
                objList.price = priceInfo.toFixed(2)
                objList.amount = amount
                objList.note = note
                objList.id = uuid()
                objList.data = otherList
    
                let conv_num = num => isNaN(num) ? 0 : Number(num)
                let calc_price_amount = otherList.reduce((a, b) => {
                    return a + (conv_num(b.amount) * conv_num(b.price))
                }, 0)
                let total_price = calc_price_amount + priceInfo
    
                objList.total_price = total_price.toFixed(2)
    
                console.log('------------OBJ_LIST------------')
                console.log(objList)
                
                newListCurrent.push(objList)
                console.log('------------NEW_LIST_CURRENT------------')
                console.log(newListCurrent)
    
                // console.log('------------OBJ_LIST.DATA------------')
                // console.log(objList.data)
    
                setCurrentRequests(newListCurrent)
    
                // let indexReq = newListRequest.indexOf(cityId)
                // console.log(indexReq)
                // console.log(current_requests)
    
                newListRequest.map(item => {
                    if (item.id == cityId) {
                        item.data = newListCurrent
                    }
                })
    
                console.log('------------NEW_LIST_REQUEST------------')
                console.log(newListRequest)
                setListRequest(newListRequest)
                
    
                // console.log('------------PRICE_INFO------------')
                // console.log(priceInfo.toFixed(2))
    
                // console.log('------------TOTAL_PRICE------------')
                // console.log(total_price.toFixed(2))
                // console.log('list_request:')
                // console.log(newListRequest)
                // console.log('current_requests:')
                // console.log(newListCurrent)
                
                // let tot_req = newListCurrent.reduce((a, b) => { return a + b.total_price }, 0)
                // setTotal(tot_req)
                // console.log(params)
                props.navigation.replace('Request', { scroll_now: true })
                // replaceScreen('Request')
            }
        } else {
            toastMsg('Desculpe, mas estamos fechado! Tente novamente mais tarde.')
        }
    }
    

    return (
        <Page>
            {/* <NavigationEvents onWillFocus={changeTheme} /> */}
            <StatusBar barStyle={statusBarTheme.barStyle} backgroundColor={statusBarTheme.background} />
            {/* <ScrollPage contentContainerStyle={{ paddingBottom: 60 }} > */}
            {/* <TopArea
                // img={params.img}
                // price={params.price}
                // price={params.data.price}
                // dataId={params.data.id}
                data={params.data}
                priceInfo={priceInfo}
                amount={amount}
                handleSum={handleSum}
                handleSub={handleSub}
            /> */}
            
            {/* {params.stuff && */}
            <BottomArea
                cityId={cityId}
                data={params.data}
                list={list}
                setList={setList}
                sectionListRef={sectionListRef}
                scrollTo={scrollTo}
                priceInfo={priceInfo}
                setPriceInfo={setPriceInfo}
                amount={amount}
                handleSum={handleSum}
                handleSub={handleSub}
                note={note}
                setNote={setNote}
                nav={nav}
                // stuff={params.stuff}
                // handleAdd={handleAdd}
                // //active:
                // potChipsActive={potChipsActive}
                // eggActive={eggActive}
                // beefActive={beefActive}
                // onionActive={onionActive}
                // chickenActive={chickenActive}
                // baconActive={baconActive}
                // pepperoniActive={pepperoniActive}
                // //setActive:
                // setPotChipsActive={setPotChipsActive}
                // setEggActive={setEggActive}
                // setBeefActive={setBeefActive}
                // setOnionActive={setOnionActive}
                // setChickenActive={setChickenActive}
                // setBaconActive={setBaconActive}
                // setPepperoniActive={setPepperoniActive}
            />
            
            {/* </ScrollPage> */}
            <ButtonAddArea>
                <ButtonAdd 
                    onPress={handleAdd} 
                    // onPress={() => {}}
                    underlayColor='#e5921a'
                    // activeOpacity={.9} 
                >
                    <TextButton>Adicionar ao pedido</TextButton>
                </ButtonAdd>
            </ButtonAddArea>
        </Page>
    )
}


{/* {indicator ?
<Modal
    visible={modalIndicator}
    transparent={true}
    // animated={true}
        animationType='fade'
>
    <StatusBar barStyle='light-content' backgroundColor='rgb(3, 61, 10)' />
    <ModalLoading>
        <ActivityIndicator size='large' color='#075715' />
    </ModalLoading>
</Modal> : */}

Screen.navigationOptions = ({navigation}) => {
    let params = navigation.state.params
    return {
        // headerTitle: () => <Title> {params.snack} </Title>
        headerTitle: params.name
    }
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests,

        total: state.requestReducer.total,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}}),
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}}),
        setTotal: (total) => dispatch({type: 'SET_TOTAL', payload: {total}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)