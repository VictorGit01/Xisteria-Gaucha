import React, { useState } from 'react';
import { Modal, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

const Area = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5) 
`
// background-color: transparent
// background-color: rgba(0, 0, 0, .5)

const Scroll = styled.ScrollView`
    width: 100%;
`

const Box = styled.View`
    height: 360px;
    width: 75%;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px 10px 20px 10px
`
// height: 250px;
// height: 50%;

const Header = styled.View`
    height: 40px
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const BoxBody = styled.View`
    flex: 1.2;
    justify-content: center;
`

const BoxFooter = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`

const Title = styled.Text`
    font-size: 18px;
`

const Action = styled.View`
    flex-direction: column;
    width: ${props => props.width || '100%'};
    margin-vertical: 20px;
`

const Text = styled.Text`
    font-size: 12px;
    color: ${props => props.color ? props.color : '#000'};
    bottom: 10px;
`

const TextCaption = styled.Text`
    font-size: 10px;
    color: #999
    align-self: flex-end
`

const TextButton = styled.Text`
    font-size: 16px;
    color: ${props => props.color ? props.color : '#fe9601'}
`

const Input = styled.TextInput`
    height: 40px;
    width: 100%;
    border: 1px solid #000;
    border-radius: 2px;
    padding: 10px;
`

const ButtonClose = styled.TouchableOpacity`
    height: 100%;
    width: 40px;
    justify-content: center;
    align-items: center;
`

const ButtonModal = styled.TouchableOpacity`
    height: 40px;
    width: 48%
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor? props.bgColor : '#fff'}
    border: 1px solid #fe9601
    border-radius: 2px;
`

const AddCity = (props) => {
    

    let {
        modalVisible, setModalVisible,
        city, setCity, dlvFee, setDlvFee,
        handleSave,
    } = props;

    const handleClose = () => {
        setModalVisible(false)
        // setFocusedInput(false)
    }

    // const handleSave = () => {
        
    // }

    return (
        <Modal
            visible={modalVisible}
            onRequestClose={handleClose}
            transparent={true}
            animationType='fade'
        >
            <Area>
            <Scroll
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <Box>
                    <Header>
                        <Title>Adicionar Cidade</Title>
                        <ButtonClose onPress={handleClose} >
                            <FontIcon name='times' size={20} color='#fe9601' />
                        </ButtonClose>
                    </Header>
                    <BoxBody>
                        <Action>
                            <Text>NOME DA CIDADE</Text>
                            <Input
                                value={city}
                                onChangeText={(t) => setCity(t)}
                                autoFocus={true}
                                maxLength={25}
                                // prop para inserir imagem no lado esquesdo campo de texto
                                // inlineImageLeft='search_icon'
                            />
                        </Action>
                        <Action>
                            <Text>TAXA DE ENTREGA</Text>
                            <Input
                                value={dlvFee}
                                onChangeText={(t) => setDlvFee(t)}
                            />
                        </Action>
                    </BoxBody>
                    <BoxFooter>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleClose}
                        >
                            <TextButton>Cancelar</TextButton>
                        </ButtonModal>
                        <ButtonModal
                            activeOpacity={.9}
                            onPress={handleSave}
                            bgColor='#fe9601'
                        >
                            <TextButton color='#fff' >Salvar</TextButton>
                        </ButtonModal>
                    </BoxFooter>
                </Box>
            </Scroll>
            </Area>
        </Modal>
    );
}

export default AddCity;