import React, { useEffect, useState, useContext } from 'react'
import { Platform, Vibration, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

// Components:
import ModalDelete from './ModalDelete';

// Contexts:
import ActiveContext from '../../contexts/ActiveContext'

const ItemArea = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    border-bottom-width: .5px;
    padding: 10px;
`
//height: 70px
//height: 90px

const ItemMainArea = styled.View`
    flex: 1;
    justify-content: space-between
`

const ItemTopArea = styled.View`
    flex-direction: row;
`

const ItemAreaLeft = styled.View`
    flex: 1;
    justify-content: space-evenly;
`
//heigth: 100%

const ItemAreaRight = styled.View`
    width: 100px;
    align-items: flex-end;
    justify-content: center;
`
//height: 100%;

const ItemText = styled.Text`
    font-size: ${Platform.Version <= 23 ? 16 : 18}px;
    color: ${props => props.color ? props.color : '#000'};
`

const ExtraArea = styled.View`
    flex-direction:row;
    width: 100%
    align-items: center
    justify-content: space-between;
`

const ExtraLeftArea = styled.View`
    flex-direction: row
    align-items: center;
`

const ItemExtraText = styled.Text`
    font-size: 16px;
    color: #888
    margin-left: 5px;
`

const UlList = styled.View`
    height: 4px;
    width: 4px;
    background-color: #888;
    border-radius: 2
`

const ListRequest = (props) => {
    
    const [ extraPrice, setExtraPrice ] = useState(0)
    //const [ totalList, setTotalList ] = useState([])
    const [ activeScreen, setActiveScreen ] = useContext(ActiveContext)

    let { actionLongPress, modalVisible, setModalVisible } = props

    let list = [...props.list_request]
    let item = props.item
    let index = props.index
    let DURATION = 60
    let listExtraPrice = []
    //var goBack = props.navigation.goBack

    //console.log(list.map((item, index) => list[index]))

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    

    const handleDel = (i) => {
        props.setIndicator(true)
        props.loading()
        list.splice(i, 1)
        props.totalList.splice(i, 1)
        props.setListRequest(list)
        props.setTotalList(props.totalList)
        setModalVisible(false)
        list.length <= 0 ? (
            props.setIndicator(false),
            props.goBack(),
            setActiveScreen('foods'),
            setTimeout(() => {
                toastMsg('Sua sacola está vazia.')
            }, 200)
        ) : null
    }

    let total = 0;

    useEffect(() => {
        /*
        item.extraList.map((extraItem, extraIndex) => {
            listExtraPrice.push(extraItem.price)
        })
        total = listExtraPrice.reduce(function(tot, y) {return tot + y}, 0)
        setExtraPrice(total)
        //console.log(extraPrice)
        */
    }, [extraPrice])

    return (
        <ItemArea
            underlayColor='rgba(0, 0, 0, .03)'
            //activeOpacity={.7}
            onLongPress={() => actionLongPress(index)}
        >
            <>
            <ItemMainArea>
                <ItemTopArea>
                    <ItemAreaLeft>
                        <ItemText>{item.name}</ItemText>
                        <ItemText color='#ff2626' >Quantidade: {item.amount}</ItemText>
                    </ItemAreaLeft>
                    <ItemAreaRight>
                        <ItemText>R$ {Number(item.price).toFixed(2).replace('.', ',')}</ItemText>
                    </ItemAreaRight>
                </ItemTopArea>
                {/* {item.extraList &&
                <> */}
                {item.data.map((extraItem, extraIndex) => {
                    let conv_num = num => isNaN(num) ? 0 : Number(num)
                    let priceAmount = conv_num(extraItem.price) * conv_num(extraItem.amount)
                    return (
                        <ExtraArea key={extraIndex} >
                            <ExtraLeftArea>
                                <UlList></UlList>
                                <ItemExtraText>{extraItem.amount}x {extraItem.name}</ItemExtraText>
                            </ExtraLeftArea>
                            {extraItem.price > 0 && <ItemExtraText>R$ {priceAmount.toFixed(2).replace('.', ',') }</ItemExtraText>}
                        </ExtraArea>
                    )
                })}
                {/* </>} */}
            </ItemMainArea>
            {/* <ModalDelete
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleDel={() => handleDel(index)}
            /> */}
            
            </>
        </ItemArea>
    )
}

const mapStateToProps = (state) => {
    return {
        list_request: state.requestReducer.list_request,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setListRequest: (list_request) => dispatch({type: 'SET_LIST_REQUEST', payload: {list_request}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListRequest)