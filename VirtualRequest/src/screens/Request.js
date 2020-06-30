import React, { useState, useEffect } from 'react'
import { Platform, Vibration, Alert, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import uuid from 'uuid/v4'

// Components:
import ModalDelete from '../components/Request/ModalDelete'
import ListItem from '../components/Request/ListItem'
import Footer from '../components/Request/Footer'
import PageDelete from '../components/Request/PageDelete'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.FlatList`
    flex: 1;
    width: 100%;
`

const ItemArea = styled.TouchableOpacity`
    flex-direction: row;
    height: 70px;
    width: 100%;
    border-bottom-width: .5px;
    padding-horizontal: 10px;
`

const ItemAreaLeft = styled.View`
    flex: 1;
    height: 100%;
    justify-content: space-evenly;
`

const ItemAreaRight = styled.View`
    height: 100%;
    width: 100px;
    align-items: flex-end;
    justify-content: center;
`

const ItemText = styled.Text`
    font-size: ${Platform.Version <= 23 ? 16 : 18}px;
    color: ${props=>props.color ? props.color : '#000'};
`

const Screen = (props) => {
    const { current_requests, setCurrentRequests, list_request, setListRequest, cityId } = props
    const [ totalList, setTotalList ] = useState([])
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ indicator, setIndicator ] = useState(true)
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ indexList, setIndexList ] = useState(0)
    // const [ list, setList ] = useState(Array.from(props.list_request))
    const [ list, setList ] = useState(Array.from(current_requests))

    // let list = [...props.list_request]
    // let total = 0
    var goBack = props.navigation.goBack
    let _isMount = false

    //console.log(list.map((item, index) => list[index]))

    const loading = () => {
        // setIndicator(true)
        setTimeout(() => {
            setIndicator(false)
        }, 500)
    }

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
        if (list.length == 0) {
            goBack()
        }



        // let total = list.reduce((a, b) => { return a + b.total_price }, 0)
        let tot_req = list.reduce((a, b) => { return a + b.total_price }, 0)
        props.setTotal(tot_req)
        // setTotalPrice(props.total)
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

    const actionLongPress = (index) => {
        Vibration.vibrate(DURATION)
        setModalVisible(true)
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
        
        currReqCopy.splice(indexList, 1)
        setCurrentRequests(currReqCopy)
        setList(currReqCopy)

        console.log('--------------LIST_REQUEST ANTES--------------')
        console.log(listReqCopy)
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

        console.log('--------------LIST_REQUEST DEPOIS--------------')
        console.log(listReqCopy)

        setTotalPrice(props.total)
        setModalVisible(false)
        // console.log(props.list_request.length)
        // console.log(indexList)
    }

    return (
        <Page>
            {/* <StatusBar
                barStyle='light-content'
                backgroundColor='#075715'
            /> */}

            <Listing
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
                        actionLongPress={actionLongPress}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                    />}
                keyExtractor={(item) => item.id}
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
                            modalVisible={modalVisible}
                            setModalVisible={setModalVisible}
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
            {/* {modalVisible ? <PageDelete /> : null} */}
            <ModalDelete
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleDel={handleDel}
            />
        </Page>
    )
}

Screen.navigationOptions = ({navigation}) => {
    let nav = navigation.navigate
    let back = navigation.goBack
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
        headerTitle: 'Itens na sacola',
        headerLeft: () => (
            <HeaderButtonIcon onPress={() => back()} activeOpacity={1} underlayColor={highlight} >
                <HeaderIcon source={require('../assets/icons/close_64px.png')} size={15} />
            </HeaderButtonIcon>
        ),
        headerRight: () => (
            <HeaderButtonIcon onPress={() => nav('Resume')} activeOpacity={1} underlayColor={highlight} >
                <HeaderIcon source={require('../assets/icons/done_64px.png')} />
            </HeaderButtonIcon>
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