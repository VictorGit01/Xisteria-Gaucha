import React, { useEffect, useState } from 'react'
import { Modal, StatusBar } from 'react-native'
import styled from 'styled-components/native'

const ModalArea = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
`

const ModalBox = styled.View`
    width: 73%;
    height: 230px;
    justify-content: space-around;
    align-items: flex-start;
    background-color: #fff;
    border-radius: 2px;
    padding-vertical: 10px;
    elevation: 15px;
`
//padding-horizontal: 20px;
//width: 280px;
//height: 250px;
//width: 75%;

const TitleModal = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-top: 5px;
    margin-horizontal: 20px;
`

const OptionArea = styled.View`
    height: 94px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`
//height: 140px;
//align-items: flex-start;
//margin-top: 10px;

const ButtonOption = styled.TouchableHighlight`
    height: 40px;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding-horizontal: 20px;
`

const BoxOption = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => props.active ? '#009a67' : '#777'};
    border-radius: 10px;
    margin-right: 20px;
`
//#03BB85

const SelectOption = styled.View`
    height: 10px;
    width: 10px;
    background-color: ${props => props.active ? '#009a67' : 'transparent'};
    border-radius: 5px;
`

const BottomArea = styled.View`
    height: 40px;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: -5px;
    padding-horizontal: 20px;
`

const TextModal = styled.Text`
    font-size: 18px;
`

const ButtonModal = styled.TouchableHighlight`
    height: 36px;
    width: 100px;
    justify-content: center;
    align-items: center;
    margin-horizontal: 3px;
`

const TextBottom = styled.Text`
    font-size: 14px;
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
        setActive(optionSelect)
    }

    useEffect(() => {
        /*
        setActive(0)
        setModalVisible(false)
        */
    }, [])

    return (
        <Modal
            visible={modalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={handleCancel}
        >
            <StatusBar
                barStyle='light'
                backgroundColor={modalVisible ? 'rgb(3, 61, 10)' : '#077a15'}
                // backgroundColor='rgba(0, 0, 0, .5)'
                animated={true}
                // translucent={true}
            />
            <ModalArea>
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
                        >
                            <TextBottom>CANCELAR</TextBottom>
                        </ButtonModal>
                        <ButtonModal
                            onPress={handleSelect}
                        >
                            <TextBottom>SELECIONAR</TextBottom>
                        </ButtonModal>
                    </BottomArea>
                </ModalBox>
            </ModalArea>
        </Modal>
    )
}