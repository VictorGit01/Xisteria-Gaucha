import React, { useEffect, useState } from 'react'
import { /*Modal,*/ StatusBar, Dimensions, Platform } from 'react-native'
import Modal from 'react-native-modal'
import { normalize } from '../../functions'
import styled from 'styled-components/native'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

const ModalArea = styled.TouchableOpacity`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.View`
    width: 73%;
    height: ${normalize(230)}px;
    justify-content: space-around;
    align-items: flex-start;
    background-color: #fff;
    border-radius: ${normalize(2)}px;
    padding-vertical: ${normalize(10)}px;
    elevation: ${normalize(15)}px;
`
//padding-horizontal: 20px;
//width: 280px;
//height: 250px;
//width: 75%;

const TitleModal = styled.Text`
    font-size: ${normalize(20)}px;
    font-weight: bold;
    margin-top: ${normalize(5)}px;
    margin-horizontal: ${normalize(20)}px;
`

const OptionArea = styled.View`
    height: ${normalize(94)}px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`
//height: 140px;
//align-items: flex-start;
//margin-top: 10px;

const ButtonOption = styled.TouchableHighlight`
    height: ${normalize(40)}px;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding-horizontal: ${normalize(20)}px;
`

const BoxOption = styled.View`
    height: ${normalize(20)}px;
    width: ${normalize(20)}px;
    justify-content: center;
    align-items: center;
    border: ${normalize(2)}px solid ${props => props.active ? '#009a67' : '#777'};
    border-radius: ${normalize(10)}px;
    margin-right: ${normalize(20)}px;
`
//#03BB85

const SelectOption = styled.View`
    height: ${normalize(10)}px;
    width: ${normalize(10)}px;
    background-color: ${props => props.active ? '#009a67' : 'transparent'};
    border-radius: ${normalize(5)}px;
`

const BottomArea = styled.View`
    height: ${normalize(40)}px;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: ${normalize(-5)}px;
    padding-horizontal: ${normalize(20)}px;
`

const TextModal = styled.Text`
    font-size: ${normalize(18)}px;
`

const ButtonModal = styled.TouchableHighlight`
    height: ${normalize(36)}px;
    width: ${normalize(100)}px;
    justify-content: center;
    align-items: center;
    margin-horizontal: ${normalize(3)}px;
`

const TextBottom = styled.Text`
    font-size: ${normalize(14)}px;
    font-weight: bold;
    color: #009a67;
`

export default (props) => {
    let { modalVisible, setModalVisible, options, optionSelect, setOptionSelect } = props
    const [ active, setActive ] = useState(optionSelect)
    const [ activeSelect, setActiveSelect ] = useState(false)

    let methodPay = ['Dinheiro', 'Trazer a maquininha']

    const togglePay = (item, index) => {
        setActive(index)

        // if (item) {
        //     payMethod[index].active = true
        // } else if (!item) {
        //     payMethod[index].active = false
        // }
        // setPayMethod(payMethod)
        // console.log(payMethod)
    }

    // const handleSelect = () => {
    //     if (active != '') {
    //         setModalVisible(false)
    //         setPayMethod(active)
    //         payMethod == 'Formas de pagamento' ?
    //         setActive('') :
    //         setActive(methodPay)
    //        // null
    //     }
    // }

    const handleSelect = () => {
        setOptionSelect(active)
        setModalVisible(false)
    }

    const handleCancel = () => {
        setModalVisible(false)
        /*
        if (methodPay == 'Formas de pagamento' && active == 'Formas de pagamento') {
            setActive('')
        } else {
            //setActive(methodPay)
        }
        */

        setTimeout(() => {
            setActive(optionSelect)
        }, 500)
    }

    useEffect(() => {
        /*
        setActive(0)
        setModalVisible(false)
        */
    }, [])

    return (
        <Modal
            // visible={modalVisible}
            // animationType='fade'
            // transparent={true}
            // onRequestClose={handleCancel}

            isVisible={modalVisible}
            backdropOpacity={0.9}
            // backdropColor='rgba(0, 0, 0, .5)'
            backdropColor='transparent'
            animationIn='fadeIn'
            animationOut='fadeOut'
            coverScreen={false}
            // deviceHeight={Dimensions.get('screen').height}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
            // onBackdropPress={() => props.setModalVisible(false)}
            // animationInTiming={300}
            // // animationOutTiming={500}
            // backdropTransitionOutTiming={300}
            hideModalContentWhileAnimating={true}     
        >
            {/* <StatusBar
                barStyle='light'
                backgroundColor={modalVisible ? 'rgb(3, 61, 10)' : '#077a15'}
                // backgroundColor='rgba(0, 0, 0, .5)'
                animated={true}
                // translucent={true}
            /> */}
            <ModalArea onPress={handleCancel} activeOpacity={1} >
                <ModalBox>
                    <TitleModal>Selecione uma opção</TitleModal>
                    <OptionArea>
                        {options.map((item, index) => (
                            <ButtonOption
                                key={index}
                                onPress={() => setActive(item)}
                                underlayColor='#eee'
                            >
                                <>
                                <BoxOption active={active == item} >
                                    <SelectOption active={active == item} ></SelectOption>
                                </BoxOption>
                                <TextModal>{item}</TextModal>
                                </>
                            </ButtonOption>
                        ))}
                        {/* <ButtonOption
                            onPress={() => {}}
                            underlayColor='#eee'
                        >
                            <>
                            <BoxOption>
                                <SelectOption></SelectOption>
                            </BoxOption>
                            <TextModal>{methodPay[0]}</TextModal>
                            </>
                        </ButtonOption>
                        <ButtonOption
                            onPress={() => {}}
                            underlayColor='#eee'
                        >
                            <>
                            <BoxOption>
                                <SelectOption></SelectOption>
                            </BoxOption>
                            <TextModal>{methodPay[1]}</TextModal>
                            </>
                        </ButtonOption> */}
                    </OptionArea>
                    <BottomArea>
                        <ButtonModal
                            onPress={handleCancel}
                            underlayColor='#eee'
                        >
                            <TextBottom>CANCELAR</TextBottom>
                        </ButtonModal>
                        <ButtonModal
                            onPress={handleSelect}
                            underlayColor='#eee'
                        >
                            <TextBottom>SELECIONAR</TextBottom>
                        </ButtonModal>
                    </BottomArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}