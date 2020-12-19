import React, { useState, useEffect, useContext, useRef } from 'react'
import { Platform, Vibration, Alert, StatusBar, BackHandler, ToastAndroid } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import uuid from 'uuid/v4'
import { normalize } from '../functions'

// Components:
import ModalDelete from '../components/Request/ModalDelete'
import ListItem from '../components/Request/ListItem'
import Footer from '../components/Request/Footer'
import PageDelete from '../components/Request/PageDelete'
import LoadingPage from '../components/LoadingPage'
import Header from '../components/Header'

// Contexts:
import LoaderContext from '../contexts/LoaderContext'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.FlatList`
    width: 100%;
    padding-bottom: ${normalize(60)}px;
`

// const ItemArea = styled.TouchableOpacity`
//     flex-direction: row;
//     height: 70px;
//     width: 100%;
//     border-bottom-width: .5px;
//     padding-horizontal: 10px;
// `

// const ItemAreaLeft = styled.View`
//     flex: 1;
//     height: 100%;
//     justify-content: space-evenly;
// `

// const ItemAreaRight = styled.View`
//     height: 100%;
//     width: 100px;
//     align-items: flex-end;
//     justify-content: center;
// `

// const ItemText = styled.Text`
//     font-size: ${Platform.Version <= 23 ? 16 : 18}px;
//     color: ${props=>props.color ? props.color : '#000'};
// `

const Screen = (props) => {
    const { current_requests, setCurrentRequests, list_request, setListRequest, cityId, navigation } = props
    const [ totalList, setTotalList ] = useState([])
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ indicator, setIndicator ] = useState(true)
    const [ deleteVisible, setDeleteVisible ] = useState(false)
    const [ indexList, setIndexList ] = useState(0)
    // const [ list, setList ] = useState(Array.from(props.list_request))
    const [ list, setList ] = useState(Array.from(current_requests))
    const [ loadingPageVisible, setLoadingPageVisible ] = useState(false)

    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const flatListRef = useRef()
    // let list = [...props.list_request]
    // let total = 0
    let nav = props.navigation.navigate
    let goBack = props.navigation.goBack
    let _isMount = false

    //console.log(list.map((item, index) => list[index]))

    const loading = () => {
        // setIndicator(true)
        setTimeout(() => {
            setIndicator(false)
        }, 500)
    }

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180)
        )
    }

    const onScreen = () => {
        let params = navigation.state.params
        // let scroll_now = 'scroll_now'
        console.log('---------------PARAMS---------------')
        if (params && params.scroll_now) {
            setTimeout(() => {
                scrollToEnd()
            }, 600)
        }
    }

    // function onBack() {
    //     if (deleteVisible) {
    //         setDeleteVisible(false)
    //         return true
    //     }
    //     return false
    // }

    // useEffect(() => {
    //     BackHandler.addEventListener('hardwareBackPress', onBack)
    //     return () => {
    //         BackHandler.removeEventListener('hardwareBackPress', onBack)
    //     }
    // }, [deleteVisible])

    useEffect(() => {
        // console.log('cityId: ' + props.name)
        setIndicator(true)
        // list.map((item, index) => {
        //     totalList[index] = item.totalPriceExtra
        //     setTotalList(totalList)
        // })
        // //console.log(totalList)
        // total = totalList.reduce(function(tot, y) {return tot + y}, 0)
        // setTotalPrice(total)

        // Comentado depois que vi que não tinha sentido colocar aqui:
        // if (list.length == 0) {
        //     goBack()
        // }
        // 


        // let total = list.reduce((a, b) => { return a + b.total_price }, 0)
        let tot_req = list.reduce((a, b) => { return Number(a) + Number(b.total_price) }, 0)
        console.log('--------------TOTAL--------------')
        let num1 = 11.00
        let num2 = 12.50
        console.log(num1 + num2)
        
        // list.map(item => {
        //     console.log(Number(item.total_price).toFixed(2))
        // })
        props.setTotal(tot_req ? tot_req.toFixed(2) : 0)
        // setTotalPrice(props.total)
        console.log('--------------LIST ENTROU EM REQUEST--------------')
        list.map(item => {
            console.log(item)
        })
        loading()
        // console.log(props.total)
    }, [list])

    // useEffect(() => {
    //     loading()
    //     /*
    //     _isMount = true
    //     if (_isMount) {
            
    //     }
    //     */
    //     // console.log(totalPrice)
    // }, [/*totalPrice*/])

    const scrollToEnd = () => {
        flatListRef.current.scrollToEnd()
    }

    const actionLongPress = (index) => {
        Vibration.vibrate(DURATION)
        setDeleteVisible(true)
        setIndexList(index)
    }

    function openExclusionModal(index) {
        setDeleteVisible(true)
        setIndexList(index)
    }

    /*
    useEffect(() => {
            props.toTop == false ? props.setToTop(true) : null
            //props.setToTop(false)
            //console.log('Entrou.')
            //console.log(`ToTop, está: ${props.toTop}`)
    }, [props.toTop])
    */

    const DURATION = 60
    const PATTERN = [1000, 2000, 3000]

    function handleDel() {
        // let listCopy = Array.from(props.list_request)
        let currReqCopy = Array.from(current_requests)
        let listReqCopy = Array.from(list_request)

        setDeleteVisible(false)

        currReqCopy.length > 1 
        ? setLoaderVisible(true)
        : setLoadingPageVisible(true)
        
        setTimeout(() => {
            currReqCopy.splice(indexList, 1)
            setCurrentRequests(currReqCopy)
            setList(currReqCopy)
    
            // console.log('--------------LIST_REQUEST ANTES--------------')
            // console.log(listReqCopy)
            listReqCopy.map((item, index) => {
                if (item.id == cityId) {
                    listReqCopy[index].data.splice(indexList, 1)
                    // if (!item.data[indexList]) {
                    //     return item.data
                    // }
                    // delete item.data[indexList]
                }
            })
    
            setListRequest(listReqCopy)
    
            // console.log('--------------LIST_REQUEST DEPOIS--------------')
            // console.log(listReqCopy)
    
            setTotalPrice(props.total)

            // console.log(props.list_request.length)
            // console.log(indexList)

            setTimeout(() => {
                setLoaderVisible(false)
                setLoadingPageVisible(false)

                if (!currReqCopy.length) {
                    goBack()
                    toastMsg('Sua sacola está vazia.')
                }
            }, 1000)
        }, 1000)
    }

    if (loadingPageVisible) {
        return (
            <>
                <Header title='Itens na sacola' navigation={navigation} right_side={true} left_icon='clear' />
                <LoadingPage />
            </>
        )
    }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={onScreen}
            />
            {/* <StatusBar
                barStyle='light-content'
                backgroundColor='#075715'
            /> */}

            <Header title='Itens na sacola' navigation={navigation} right_side={true} left_icon='clear' />

            <Listing
                // contentContainerStyle={{ paddingBottom: 80 }}
                data={list}
                renderItem={({item, index}) =>
                    <ListItem
                        item={item}
                        index={index}
                        //actionLongPress={actionLongPress}
                        totalList={totalList}
                        setTotalList={setTotalList}
                        goBack={goBack}
                        setIndicator={setIndicator}
                        loading={loading}
                        // actionLongPress={actionLongPress}
                        openExclusionModal={openExclusionModal}
                        deleteVisible={deleteVisible}
                        setDeleteVisible={setDeleteVisible}
                    />}
                keyExtractor={(item) => item.id}
                ref={flatListRef}
                contentContainerStyle={{ paddingBottom: normalize(60) }}
            />
            
            {/* <Scroll>
                {list.map((item, index) => (
                    <ItemArea
                        key={index}
                        activeOpacity={.7}
                        onLongPress={() => actionLongPress()}
                        //delayLongPress={10}
                    >
                        <ModalDelete
                            deleteVisible={deleteVisible}
                            setDeleteVisible={setDeleteVisible}
                            handleDel={() => handleDel(item.id)}
                        />
                        <ItemAreaLeft>
                            <ItemText>{item.snack}</ItemText>
                            <ItemText color='#ff2626' >Quantidade {item.amount}</ItemText>
                        </ItemAreaLeft>
                        <ItemAreaRight>
                            <ItemText>R$ {item.total_price.toFixed(2).replace('.', ',')}</ItemText>
                        </ItemAreaRight>
                    </ItemArea>
                ))}
            </Scroll> */}
            <Footer total={props.total} indicator={indicator} />
            {/* {deleteVisible ? <PageDelete /> : null} */}
            <ModalDelete
                modalVisible={deleteVisible}
                setModalVisible={setDeleteVisible}
                handleDel={handleDel}
            />
        </Page>
    )
}

Screen.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    let goBack = navigation.goBack
    let highlight = 'rgb(5, 85, 15)'

    const HeaderButtonIcon = styled.TouchableHighlight`
        height: 40px;
        width: 40px;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        margin-horizontal: 6px;
    `

    const HeaderIcon = styled.Image`
        height: ${props=>props.size ? props.size : 20}px;
        width: ${props=>props.size ? props.size : 20}px;
        
    `

    return {
        // headerTitle: 'Itens no pedido',
        headerShown: false,
        headerTitle: 'Itens na sacola',
        headerLeft: () => (
            // <HeaderButtonIcon onPress={() => back()} activeOpacity={1} underlayColor={highlight} >
            //     <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} />
            // </HeaderButtonIcon>
            <BorderlessButton 
                onPress={goBack}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                style={{ marginHorizontal: 12, padding: 2 }} 
                rippleColor='rgba(0, 0, 0, .4)' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {/* <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} /> */}
                <Icon name='clear' size={26} color='#fff' />
            </BorderlessButton>
        ),
        headerRight: () => (
            // <HeaderButtonIcon onPress={() => nav('Resume')} activeOpacity={1} underlayColor={highlight} >
            //     <HeaderIcon source={require('../assets/icons/done_64px.png')} />
            // </HeaderButtonIcon>

            <BorderlessButton
                onPress={() => nav('Resume')}
                // style={{ marginHorizontal: 12, padding: 8 }} 
                style={{ marginHorizontal: 12, padding: 2 }} 
                rippleColor='rgba(0, 0, 0, .4)' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {/* <HeaderIcon source={require('../assets/icons/done_64px.png')} /> */}
                <Icon name='done' size={26} color='#fff' />
            </BorderlessButton>
        ),
    }
}

const mapStateToProps = (state) => {
    return {
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests,
        total: state.requestReducer.total,
        toTop: state.requestReducer.toTop,
        name: state.userReducer.name,
        cityId: state.userReducer.cityId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}}),
        setCurrentRequests: (current_requests) => dispatch({type: 'SET_CURRENT_REQUESTS', payload: {current_requests}}),
        setTotal: (total) => dispatch({type: 'SET_TOTAL', payload: {total}}),
        setToTop: (toTop) => dispatch({type: 'SET_TOTOP', payload: {toTop}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)