import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { ToastAndroid, Vibration } from 'react-native'
import { normalize } from '../../functions'
import styled from 'styled-components/native'

// Contexts:
import ToTopContext from '../../contexts/ToTopContext'

const BackArea = styled.View`
    width: ${normalize(100)}px;
    height: ${normalize(100)}px;
    align-self: flex-end;
    position: absolute;
    bottom: 0px;
    zIndex: ${normalize(7)}px;
`

const Area = styled.View`
    flex-direction: row;
    width: 100%;
    height: ${normalize(40)}px;
    background-color: #077a15;
    border-bottom-width: .5px;
    border-color: rgba(255, 255, 255, .5);
`
// border-color: #444;

const InfoArea = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`

const TextInfo = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: ${props => props.weight || 'normal'}
    color: #fff;
`

const ButtonArea = styled.View`
    width: ${normalize(100)}px;
    height: ${normalize(100)}px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    position: absolute;
    bottom: 0px;
    zIndex: ${normalize(7)}px;
    padding: ${normalize(10)}px ${normalize(10)}px 0px ${normalize(10)}px;
`
/*
margin-left: 295px;
margin-top: -50px;

flex: 1
width: 100%
height: 100%;
justify-content: center;
align-items: center;
padding-top: ${normalize(15)}px;
background-color: tomato
*/

const ButtonConfirm = styled.TouchableHighlight`
    width: ${normalize(60)}px;
    height: ${normalize(60)}px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(30)}px;
    elevation: 2;
`

const IconButton = styled.Image`
    width: ${normalize(20)}px;
    height: ${normalize(20)}px;
`

const Footer = (props) => {
    const [ top, setTop ] = useContext(ToTopContext)
    const [ totalItems, setTotalItems ] = useState(0)
    const [ list, setList ] = useState(null)

    let { cityId, list_request, current_requests } = props

    // let amount_badge = props.list_request.length
    // let list = list_request.reduce((item => { if (item.id == cityId) { return item.data } }))

    // let total_items = 0

    useEffect(() => {
        // console.log(list)
        // list_request.map(item => {
        //     if (item.id == cityId && item.data.length > 0) {
        //         let total_items = item.data.reduce(function(tot, y) {return tot + y.amount}, 0)
        //         setTotalItems(total_items)
        //         console.log(totalItems)
        //     }
        // })
        // total_items = list.reduce(function(tot, y) {return tot + y.amount}, 0)
        // setTotalItems(total_items)
        // console.log(totalItems)
        if (current_requests) {
            let total_items = current_requests.reduce(function(tot, y) {return tot + y.amount}, 0)
            setTotalItems(total_items)
            // console.log(current_requests)
        }
        // console.log(list)
    }, [current_requests, cityId])
    // }, [current_requests])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180),
        )
    }

    const handleNavToRequest = () => {
        if (totalItems <= 0) {
            Vibration.vibrate(60)
            // toastMsg('Adicione produtos ao pedido.'),
            toastMsg('Adicione itens à sacola.')
        } else {
            // props.nav('Request')
            props.nav('Request')
            setTop(true)
        }
    }

    return (
        <>
        {/* <BackArea> */}
            <ButtonArea
                // onPress={handleNotif}
                // activeOpacity={1}
            >
                <ButtonConfirm 
                    onPress={handleNavToRequest}
                    underlayColor='#e5921a'
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} 
                >
                    <IconButton source={require('../../assets/icons/done_64px.png')} />
                </ButtonConfirm>
            </ButtonArea>
        {/* </BackArea> */}
        <Area>
            <InfoArea>
                {/* <Text>Itens no pedido({totalItems})</Text> */}
                <TextInfo>Itens na sacola<TextInfo weight='bold' >({totalItems})</TextInfo></TextInfo>
            </InfoArea>
        </Area>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        cityId: state.userReducer.cityId,
        list_request: state.requestReducer.list_request,
        current_requests: state.requestReducer.current_requests
    }
}

/*
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
*/

export default connect(mapStateToProps)(Footer)