import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { ToastAndroid, Vibration } from 'react-native'
import styled from 'styled-components/native'

// Components:
import InputArea from './DeliveryForm1/InputArea'
import ModalArea from './DeliveryForm1/ModalArea'

// Contexts:
import ActiveContext from '../../contexts/ActiveContext'

const Form = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`

const ButtonArea = styled.View`
    flex: 1;
    width: 90%;
    align-items: center;
`

const ButtonSave = styled.TouchableOpacity`
    height: 40px;
    width: 165px;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 30px;
`
//margin-bottom: 40px;

const ButtonForm = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: 2px;
    elevation: 2px;
    margin-bottom: 30px;
`
//margin-bottom: 40px;

const ButtonSend = styled.TouchableOpacity`
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #077a15;
    border-radius: 2px;
    elevation: 2px;
`

const TextButton = styled.Text`
    font-size: 16px;
    color: #fff;
`

const DeliveryForm = (props) => {
    //InputArea:
    const [ name, setName ] = useState('')
    const [ district, setDistrict ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ number, setNumber ] = useState('')
    const [ ddd, setDDD ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ maxLenDDD, setMaxLenDDD ] = useState(2)
    const [ maxLenPhone, setMaxLenPhone ] = useState(9)

    //Contexts:
    const [ activeScreen, setActiveScreen ] = useContext(ActiveContext)

    //ModalArea:
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ payMethod, setPayMethod ] = useState('Formas de pagamento')
    /*
    const [ payMethod, setPayMethod ] = useState([
        {form: 'Dinheiro', active: false},
        {form: 'Trazer a maquininha', active: false}
    ])
    */

    // setPayMethod(payMethod[1].)

    useEffect(() => {
        if (props.ddd.length === 2) {
            setMaxLenDDD(4)
            ajustedDDD = `(${props.ddd})`
            setDDD(ajustedDDD)
        }

        if (props.phone.length == 9) {
            setMaxLenPhone(10)
            part1 = props.phone.slice(0, 5)
            part2 = props.phone.slice(5, 9)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        } else if (phone.length == 8) {
            setMaxLenPhone(9)
            part1 = props.phone.slice(0, 4)
            part2 = props.phone.slice(4, 8)
            ajustedPhone = `${part1}-${part2}`
            setPhone(ajustedPhone)
        }

        setName(props.name)
        setDistrict(props.district)
        setStreet(props.street)
        setNumber(props.number)
        // setDDD(props.ddd)
        // setPhone(props.phone)
    }, [])

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )  
    }

    const handleSend = () => {
        if ((name && district && street && phone && ddd && number).trim().length <= 0) {
            Vibration.vibrate(70)
            toastMsg('Preencha os campos acima.')
        } else if (payMethod == 'Formas de pagamento') {
            Vibration.vibrate(70)
            toastMsg('Selecione uma forma de pagamento.')
        } else {
            toastMsg('Pedido enviado com sucesso!')
            setActiveScreen('foods')
            props.nav('Home')
        }
    }

    function handleSaveInfo() {
        let newDDD = ddd.replace(/\D/g, '')
        let newPhone = phone.replace(/\D/g, '')

        props.setName(name)
        props.setDistrict(district)
        props.setStreet(street)
        props.setNumber(number)
        props.setDDD(newDDD)
        props.setPhone(newPhone)
        toastMsg('Informações salvas!')
    }

    return (
        <Form>
            <InputArea
                name={name}
                setName={setName}
                //
                district={district}
                setDistrict={setDistrict}
                //
                street={street}
                setStreet={setStreet}
                //
                number={number}
                setNumber={setNumber}
                //
                ddd={ddd}
                setDDD={setDDD}
                //
                phone={phone}
                setPhone={setPhone}
                //
                maxLenDDD={maxLenDDD}
                setMaxLenDDD={setMaxLenDDD}
                //
                maxLenPhone={maxLenPhone}
                setMaxLenPhone={setMaxLenPhone}
            />
            <ButtonArea>
                <ButtonSave
                    activeOpacity={.9}
                    onPress={handleSaveInfo}
                >
                    <TextButton>Salvar informações</TextButton>
                </ButtonSave>
                <ButtonForm
                    activeOpacity={.9}
                    onPress={() => setModalVisible(true)}
                >
                    <TextButton>{payMethod}</TextButton>
                </ButtonForm>
                <ButtonSend
                    activeOpacity={.9}
                    onPress={handleSend}
                >
                    <TextButton>Enviar pedido</TextButton>
                </ButtonSend>
            </ButtonArea>
            <ModalArea
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                payMethod={payMethod}
                setPayMethod={setPayMethod}
            />
        </Form>
    )
}

const mapStateToProps = (state) => {
    return {
        name: state.userReducer.name,
        district: state.userReducer.district,
        street: state.userReducer.street,
        number: state.userReducer.number,
        ddd: state.userReducer.ddd,
        phone: state.userReducer.phone,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setName: (name) => dispatch({type: 'SET_NAME', payload: {name}}),
        setDistrict: (district) => dispatch({type: 'SET_DISTRICT', payload: {district}}),
        setStreet: (street) => dispatch({type: 'SET_STREET', payload: {street}}),
        setNumber: (number) => dispatch({type: 'SET_NUMBER', payload: {number}}),
        setDDD: (ddd) => dispatch({type: 'SET_DDD', payload: {ddd}}),
        setPhone: (phone) => dispatch({type: 'SET_PHONE', payload: {phone}}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryForm)