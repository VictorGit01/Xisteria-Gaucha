import React, { useEffect, useState, useContext } from 'react'
import { Platform, Vibration, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { normalize } from '../../functions'
import styled from 'styled-components/native'
import Fi from 'react-native-vector-icons/Feather'

// Components:
import ModalDelete from './ModalDelete';

// Contexts:
import ActiveContext from '../../contexts/ActiveContext'

const ItemArea = styled.TouchableHighlight`
    width: 100%;
    flex-direction: row;
    border-bottom-width: ${normalize(.5)}px;
    padding: ${normalize(10)}px;
`
//height: 70px
//height: 90px

const ItemMainArea = styled.View`
    flex: 1;
    justify-content: space-between
`

const ItemTopArea = styled.View`
    flex-direction: row;
    align-items: center;
`

const ItemAreaLeft = styled.View`
    flex: 1;
    justify-content: space-evenly;
`
//heigth: 100%

const ItemAreaRight = styled.View`
    width: ${normalize(100)}px;
    align-items: flex-end;
    justify-content: center;
`
//height: 100%;

const ItemText = styled.Text`
    font-size: ${Platform.Version <= 23 ? normalize(16) : normalize(18)}px;
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
    font-size: ${normalize(16)}px;
    color: ${props => props.color || '#888'};
    margin-left: ${normalize(5)}px;
`

const UlList = styled.View`
    height: ${normalize(4)}px;
    width: ${normalize(4)}px;
    background-color: #888;
    border-radius: 2
`

const ButtonEdit = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    
    margin-left: ${normalize(15)}px;
`
// padding: ${normalize(10)}px;

const ListRequest = (props) => {
    
    const [ extraPrice, setExtraPrice ] = useState(0)
    //const [ totalList, setTotalList ] = useState([])
    const [ activeScreen, setActiveScreen ] = useContext(ActiveContext)

    let { 
        // actionLongPress, 
        openExclusionModal,
        modalVisible, 
        setModalVisible 
    } = props

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
            normalize(180)
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

    // useEffect(() => {
    //     /*
    //     item.extraList.map((extraItem, extraIndex) => {
    //         listExtraPrice.push(extraItem.price)
    //     })
    //     total = listExtraPrice.reduce(function(tot, y) {return tot + y}, 0)
    //     setExtraPrice(total)
    //     //console.log(extraPrice)
    //     */
    // }, [extraPrice])

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            console.log(intCleaned)
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

    return (
        <ItemArea
            underlayColor='rgba(0, 0, 0, .03)'
            onPress={() => {}}
            //activeOpacity={.7}
            // onLongPress={() => actionLongPress(index)}
        >
            <>
            <ItemMainArea>
                <ItemTopArea style={{ marginBottom: normalize(5) }} >
                    <ItemAreaLeft>
                        <ItemText>{item.name}</ItemText>
                        <ItemText color='#ff2626' >Quantidade: {item.amount}</ItemText>
                    </ItemAreaLeft>
                    <ItemAreaRight>
                        {/* <ItemText>R$ {Number(item.price).toFixed(2).replace('.', ',')}</ItemText> */}
                        {/* <ItemText>{onPriceChange(item.price.toFixed(2))}</ItemText> */}
                        <ItemText>{onPriceChange(item.price)}</ItemText>
                    </ItemAreaRight>
                    <ButtonEdit
                        onPress={() => openExclusionModal(index)}
                        activeOpacity={.6}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        {/* <Fi name='more-vertical' size={24} color='#000' /> */}
                        <Fi name='trash-2' size={20} color='#444' />
                    </ButtonEdit>
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
                            {/* {extraItem.price > 0 && <ItemExtraText>R$ {priceAmount.toFixed(2).replace('.', ',') }</ItemExtraText>} */}
                            {extraItem.price > 0 && <ItemExtraText>{onPriceChange(priceAmount.toFixed(2))}</ItemExtraText>}
                        </ExtraArea>
                    )
                })}
                {item.note.length > 0 &&
                <ExtraArea style={{ marginTop: normalize(5), alignItems: 'flex-start' }} >
                    <ItemExtraText style={{ marginLeft: 0, marginRight: normalize(10) }} >Observação</ItemExtraText>
                    <ItemExtraText style={{ textAlign: 'right', alignSelf: 'flex-end', flex: .8 }} >{item.note}</ItemExtraText>
                </ExtraArea>}
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