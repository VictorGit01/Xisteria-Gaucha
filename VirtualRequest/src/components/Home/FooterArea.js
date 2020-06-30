import React, { useEffect, useState, useContext } from 'react'
import { ToastAndroid, Vibration } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

// Contexts:
import ToTopContext from '../../contexts/ToTopContext'

const BackArea = styled.View`
    width: 100px;
    height: 100px;
    align-self: flex-end;
    position: absolute;
    bottom: 0px;
    zIndex: 7px
`

const Area = styled.View`
    flex-direction: row;
    width: 100%;
    height: 40px;
    background-color: #077a15;
`

const InfoArea = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`

const TextInfo = styled.Text`
    font-size: 16px;
    font-weight: ${props => props.weight || 'normal'}
    color: #fff;
`

const ButtonArea = styled.TouchableOpacity`
    flex: 1
    width: 100%
    height: 100%;
    justify-content: center;
    align-items: center;
    padding-top: 15px
`
/*
margin-left: 295px;
margin-top: -50px;
*/

const ButtonConfirm = styled.View`
    width: 60px;
    height: 60px;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 30px;
    elevation: 2;
`

const IconButton = styled.Image`
    width: 20px;
    height: 20px;
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

    const handleNotif = () => {
        if (totalItems <= 0) {
            Vibration.vibrate(60)
            ToastAndroid.showWithGravityAndOffset(
                // 'Adicione produtos ao pedido.',
                'Adicione itens à sacola.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                0,
                180
            )
        } else {
            props.nav('Request')
            setTop(true)
        }
    }

    return (
        <>
        <BackArea>
        <ButtonArea
            onPress={handleNotif}
            activeOpacity={1}
        >
            <ButtonConfirm  >
                <IconButton source={require('../../assets/icons/done_64px.png')} />
            </ButtonConfirm>
        </ButtonArea>
        </BackArea>
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