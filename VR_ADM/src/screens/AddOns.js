import React, { useEffect, useState, useRef, useContext } from 'react'
import { SectionList, YellowBox, ToastAndroid, Dimensions, Keyboard } from 'react-native'
import styled from 'styled-components/native'
import firebase from '../../firebase'
import uuid from 'uuid/v4'

import ListAddOnsContext from '../contexts/ListAddOnsContext'

const { height, width } = Dimensions.get('window')

const Page = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
    align-items: center;
    background-color: #fff;
`

const Scroll = styled.ScrollView`
    width: 100%;
`

const Header = styled.View`
    height: 50px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: .5px;
    border-color: #999;
    padding-horizontal: 20px;
    
`
// align-items: flex-start;
// padding-left: 20px;
// margin-bottom: 20px;

const HeaderTitle = styled.Text`
    font-size: 18px;
    font-weight: bold
    color: #999;
`

const TopAndMiddleArea = styled.View`
    min-height: 450px;
    width: 100%;
    align-items: center;
`

const SectionHeader = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, .10);
    border: 1px solid #999;
    border-bottom-width: 0px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 10px 15px;
`

const LeftSectionHeader = styled.View`
    flex: 1;
`

const RightSectionHeader = styled.View`
    height: 100%;
`

const Action = styled.View`
    flex-direction: row;
    
    justify-content: space-between
`
// width: ${props => props.width || '100%'};

const ButtonMust = styled.TouchableOpacity`
    flex-direction: row;
    margin: 10px 0px;
    left: ${props => props.left || 0}px;
`
// margin: 10px 0px 5px;

const BoxSquare = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? 'transparent' : 'rgba(0, 0, 0, .3)'};
    border: 3.5px solid ${props => props.selected ? '#fe9601' : 'rgba(0, 0, 0, .3)'};
    border-radius: 1.5px;
    margin-right: 10px
`

const SectionText = styled.Text`
    font-size: 16px;
    margin-left: ${props => props.mgLeft || 0}px;
`

const InputHeaderArea = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding-vertical: 5px;
`
// justify-content: space-between;

const InputVertArea = styled.View`
    width: ${props => props.width || '100%'};
    padding-vertical: 5px;
`

const Input = styled.TextInput`
    height: 35px;
    width: ${props => props.width || '100%'};
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 3px;
    padding: 0px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
    
`

const TextCaption = styled.Text`
    font-size: 12px;
    color: #777;
    align-self: flex-end;
`

const ItemArea = styled.View`
    width: 100%;
    justify-content: space-between;
    border: 1px solid #999;
    border-top-width: 0px;
    padding: 0px 15px 15px 15px;
`
// flex-direction: row;
// padding: 15px 15px;

const SectionFooter = styled.View`
    width: 100%;
    justify-content: center;
    border: 1px solid #999;
    border-top-width: 0px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    margin-bottom: 20px;
`

const ButtonSctFooter = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
`
// margin-vertical: 20px;
// align-self: flex-start
// padding-horizontal: 15px;

const TextSctFooter = styled.Text`
    font-size: 16px;
    color: #ff2626;
    text-decoration: underline;
`

const ButtonSection = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`

const ButtonArea = styled.View`
    height: 80px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top-width: .5px;
    padding: 20px;
`
// margin-vertical: 20px;
// height: 40px;
// width: 90%;
// padding-vertical: 20px;

const ButtonChoose = styled.TouchableHighlight`
    height: 100%;
    width: 45%;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.bgColor || '#fe9601'};
    border: 1px solid #fe9601;
    border-radius: 3px;
`

const ButtonText = styled.Text`
    font-size: 18px;
    color: ${props => props.color || '#fff'};
`

const Screen = (props) => {
    // const [ list, setList ] = useState(null)
    const [ textInputs, setTextInputs ] = useState([])
    const [ nameCTG, setNameCTG ] = useState([])
    const [ minQtt, setMinQtt ] = useState([])
    const [ maxQtt, setMaxQtt ] = useState([])
    const [ flatTextInputs, setFlatTextInputs ] = useState([])
    const [ nameAdd, setNameAdd ] = useState([])
    const [ description, setDescription ] = useState([])
    const [ price, setPrice ] = useState([])
    const [ indexSect, setIndexSect ] = useState(0)
    const [ dataSect, setDataSect ] = useState([])
    const [ sectionValue, setSectionValue ] = useState(null)
    // const [ list, setList ] = useContext(ListAddOnsContext)
    const [ list, setList ] = useState([])
    const [ done, setDone ] = useState(false)
    const [ listAddOns, setListAddOns ] = useContext(ListAddOnsContext)
    const [ isKeyboardVisible, setKeyboardVisible ] = useState(false)

    let { navigation } = props
    let nav = navigation.navigate
    let goBack = navigation.goBack
    let params = navigation.state.params
    let { editEnabled, dataId, dataImg, dataAddOns } = params
    
    let sectionListRef = useRef()
    let scrollViewRef = useRef()

    const add_ons = firebase.database().ref('add-ons')
    const cityId = firebase.auth().currentUser.uid

    useEffect(() => {
        // YellowBox.ignoreWarnings([
        //     'VirtualizedLists should never be nested'
        // ])

        if (editEnabled && dataAddOns) {
            add_ons.child(cityId).child(dataId).on('value', snapshot => {
                // console.log(snapshot.val())
                setList(snapshot.val())
            })
        }
    }, [])

    useEffect(() => {
        const keyboardDidChangeFrameListener = Keyboard.addListener(
            'keyboardDidChangeFrame',
            () => setKeyboardVisible(true)
        )

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true) // or some other action
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        )

        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
            keyboardDidChangeFrameListener.remove()
        }
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

    const scrollTo = (index, item_index, offset = 0) => {
        // console.log(list.length)
        sectionListRef.current.scrollToLocation({
            animated: true,
            sectionIndex: index,
            itemIndex: item_index ? item_index : 0,
            viewOffset: offset
        })
    }

    const scrollToEnd = () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }

    const handleAddCtg = () => {
        let newList = Array.from(list)
        // let newList = JSON.parse(JSON.stringify(list))
        let addOns = {
            id: uuid(),
            title: '',
            minQtt: '',
            maxQtt: '',
            must: false,
            multItem: false,
            data: [{
                id: uuid(),
                name: '',
                description: '',
                price: '',
                amount: 0
            }]
        }

        newList.push(addOns)
        // addOns.push(...newItems)

        // console.log(addOns)

        // setList(list !== null ? [...list, ...addOns] : addOns)
        // list.push(addOns)
        // let newList = [...list]
        // setList([...newList, addOns])
        // list.push(addOns)
        // newList[list.length] = addOns
        setList(newList)
        // console.log(list.length)
        // setList(newList)
        let last_index = list ? list.length - 1 : 0
        let last_item = list && list.length > 0 ? list[last_index].data.length - 1 : 0

        // let index_last = list ? list.length - 1 : 0
        // console.log(newList.length)
        setTimeout(() => {
            scrollTo(last_index, last_item, -200)
            // scrollToEnd()
            // console.log(list.length == (last_index + 1) ? 'maior' : 'mesmo tamanho')
            // scrollTo(last_index)
            // scrollTo(last_index)
        }, 600)
        // setList(newList)
        // console.log(list.length)
    }

    

    const handleAddAdd = (section) => {
        let newList = JSON.parse(JSON.stringify(list))
        let section_index = list.indexOf(section)
        let data = {
            id: uuid(),
            name: '',
            description: '',
            price: '',
            amount: 0
        }
        newList[section_index].data.push(data)
        setList(newList)
        let last_item = list[section_index].data.length - 1
        scrollTo(section_index, last_item + 1)
        // console.log(list[section_index].data.length)
    }

    const handleAdvance = () => {
        

        if (list && list.length > 0) {
            // let obj_tlt = {}

            // Objeto que armazena as listas que possuem os valores dos campos de cada propriedade de add_ons:
            let ctg_obj = {
                title: [],
                minQtt: [],
                maxQtt: [],
                data: []
            }

            let item_obj = {
                name: [],
                description: [],
                price: []
            }

            let title_list = []
            let minQtt_list = []
            let maxQtt_list = []
            // function checkProperties(obj) {
            //     for (var key in obj) {
            //         if (obj[key].trim().length > 0)
            //             return false
            //     }
            //     return true
            // }


            // function isEmptyObject(obj) {
            //     return Object.keys(obj).every(function(x) {
            //         // return obj[x] === '' || obj[x] === null
            //         return obj[x].trim().length < 1
            //     })
            // }

            // Função para verificar se cada uma das propriedades está preechida;
            // Ela retorna true se o campo estiver preenchido.
            function isEmptyField(t) {
                return t.every(function(x) { return x.trim().length > 0 })
            }
            
            function isEmptyArray(a) {
                return a.every(function(x) { return x && x.length > 0 })
            }

            function isBiggerThan(a, b) {
                return a.every(function(v, i) {
                    a[i] = v.length == 0 ? 0 : Number(v)
                    // b[i] = b[i].length == 0 ? b[i] : Number(b[i])
                    b[i] = b[i].length == 0 ? 0 : Number(b[i])

                    // if (b[i].length == 0) {
                    //     return 
                    // }
                    return a[i] < b[i] || b[i].length == 0 || b[i] == 0
                    // if (a[i] <= b[i]) {
                    //     return false
                    // }

                    // return true
                })
                // return b
            }

            list.forEach((item) => {
                // console.log(item.data)
                // title_list.push(item.title)
                // minQtt_list.push(item.minQtt)
                // maxQtt_list.push(item.maxQtt)

                // Adiciona o valor do campo à lista especificada que está dentro do objeto.
                ctg_obj.title.push(item.title)
                ctg_obj.minQtt.push(item.minQtt)
                ctg_obj.maxQtt.push(item.maxQtt)
                ctg_obj.data.push(item.data)
                // console.log(ctg_obj)
                // if (item.title.trim().length < 1) {
                //     toastMsg('Digite o nome da categoria.')
                // } else {
                //     setListAddOns(list)
                //     nav('Availability')
                //     // console.log(list)
                // }

                item.data.forEach((childItem) => {
                    item_obj.name.push(childItem.name)
                    item_obj.description.push(childItem.description)
                    item_obj.price.push(childItem.price)
                })
            })
            // console.log(isEmptyObject(obj_tlt))
            // console.log(isEmptyField(ctg_obj.title))
            // console.log(isEmptyField(item_obj.name))
            // console.log(isEmptyArray(ctg_obj.data))
            // console.log(isBiggerThan(ctg_obj.minQtt, ctg_obj.maxQtt))

            // Enviando lista de cada propriedade para a função que verifica se o campo está preenchido;
            // Se a função retornar false, uma mensagem é enviada para o usuário preencher o campo.
            // if (!isEmptyField(ctg_obj.title)) {
            //     toastMsg('Digite o nome da categoria.')
            // } else if (!isEmptyField(ctg_obj.minQtt)) {
            //     toastMsg('Insira a quantidade mínima.')
            // } else if (!isEmptyField(ctg_obj.maxQtt)) {
            //     toastMsg('Insira a quantidade máxima.')
            // } else if (!isEmptyField(item_obj.name)) {
            //     toastMsg('Digite o nome do item.')
            // } else if (!isEmptyField(item_obj.price)) {
            //     toastMsg('Digite o preço do item.')
            // } else if (!isEmptyArray(ctg_obj.data)) {
            //     toastMsg('Adicione um complemento.')
            // } else {
            //     setListAddOns(list)
            //     nav('Availability')
            // }


            // Enviando lista de cada propriedade para a função que verifica se o campo está preenchido;
            // Se a função retornar false, uma mensagem é enviada para o usuário preencher o campo.
            if (!isEmptyField(ctg_obj.title)) {
                toastMsg('Digite o nome da categoria.')
            } else if (!isEmptyField(item_obj.name)) {
                toastMsg('Digite o nome do item.')
            } else if (!isBiggerThan(ctg_obj.minQtt, ctg_obj.maxQtt)) {
                toastMsg('A quantidade mínima não pode ser maior ou igual a quantidade máxima.')
            } else if (!isEmptyArray(ctg_obj.data)) {
                toastMsg('Adicione um complemento.')
            } else {
                Keyboard.dismiss()
                setListAddOns(list)
                nav('Availability')
            }
        } else if (!list || list && !list.length > 0) {
            Keyboard.dismiss()
            setListAddOns(list)
            nav('Availability')
        }
        // if (list && done) {
            
        // }
        // console.log(list)
        // nav('Availability')
    }

    let item_section = {}
    item_section.data = []

    function renderSectionHeader({section}) {
        // let index = list.findIndex(x => x.id)
        let index = list.indexOf(section)
        setSectionValue(section)
        item_section.index_section = index
        nameAdd.push(item_section)
        setNameAdd(nameAdd)
        // console.log(dataSect)

        let newList = JSON.parse(JSON.stringify(list))
        
        
        return (
            <>
            <SectionHeader>
                <LeftSectionHeader>
                    <Action>
                        <InputVertArea style={{ flex: 1 }} >
                            <Input
                                // value={nameCTG[index]}
                                // onChangeText={text => {
                                //     nameCTG[index] = text
                                //     setNameCTG(nameCTG)
                                // }}
                                value={newList[index].title}
                                onChangeText={text => {
                                    newList[index].title = text
                                    setList(newList)
                                }}
                                placeholder='Nome'
                                style={{ marginBottom: 5 }}
                            />
                            <TextCaption>0/25</TextCaption>
                        </InputVertArea>
                        <ButtonSection
                            style={{ marginLeft: 10, marginBottom: 17.5 }}
                            onPress={() => {
                                newList.splice(index, 1)
                                setList(newList)
                                toastMsg('Categoria exluída.')
                            }}
                        >
                            <TextSctFooter>Excluir</TextSctFooter>
                        </ButtonSection>
                    </Action>
                    <InputHeaderArea>
                        <InputVertArea width='30%' style={{ paddingTop: 0 }} >
                            <SectionText style={{ marginBottom: 5 }} >Qtd. min: </SectionText>
                            <Input
                                value={newList[index].minQtt}
                                onChangeText={text => {
                                    newList[index].minQtt = text
                                    text > 0 ? newList[index].must = true : null
                                    setList(newList)
                                }}
                                placeholder='0'
                                keyboardType='numeric'
                            />
                        </InputVertArea>
                        <InputVertArea width='30%' style={{ paddingTop: 0, left: 35 }} >
                            {/* <SectionText mgLeft={5} >Qtd. max: </SectionText> */}
                            <SectionText style={{ marginBottom: 5 }} >Qtd. max: </SectionText>
                            <Input
                                value={newList[index].maxQtt}
                                onChangeText={text => {
                                    newList[index].maxQtt = text
                                    setList(newList)
                                }}
                                placeholder='1'
                                keyboardType='numeric'
                            />
                        </InputVertArea>
                    </InputHeaderArea>
                    <InputHeaderArea>
                        <ButtonMust
                            // style={{ alignSelf: 'flex-end' }}
                            onPress={() => {
                                if (newList[index].minQtt < 1) {
                                    newList[index].must = !newList[index].must
                                    setList(newList)
                                }
                            }}
                            activeOpacity={newList[index].minQtt < 1 ? .7 : 1}
                            hitSlop={{ top: 15, bottom: 15 }}
                        >
                            <BoxSquare selected={newList[index].must} ></BoxSquare>
                            <SectionText>Obrigatório</SectionText>
                        </ButtonMust>
                        {Number(newList[index].maxQtt) > 1 || (newList[index].minQtt.length == 0 && Number(newList[index].maxQtt) > 1) || (newList[index].minQtt.length == 0 && newList[index].maxQtt.length == 0) ?
                        <ButtonMust
                            onPress={() => {
                                newList[index].multItem = !newList[index].multItem
                                setList(newList)
                            }}
                            activeOpacity={.7}
                            hitSlop={{ top: 15, bottom: 15 }}
                            left={25}
                        >
                            <BoxSquare selected={newList[index].multItem} ></BoxSquare>
                            <SectionText>Item Múltiplo</SectionText>
                        </ButtonMust> : newList[index].multItem = false}
                    </InputHeaderArea>
                </LeftSectionHeader>
                <RightSectionHeader>
                </RightSectionHeader>
            </SectionHeader>
            </>
        )
    }

    function renderItem({item, index, section}) {
        let newList = JSON.parse(JSON.stringify(list))
        // console.log(list[indexSect].data)
        let index_section = list.indexOf(section)
        // console.log(section)
        // console.log(index_item)
        // console.log(index)

        return (
            <ItemArea>
                {/* <InputHeaderArea> */}
                <ButtonSection
                    style={{ alignSelf: 'flex-end', marginVertical: 7 }}
                    onPress={() => {
                        newList[index_section].data.splice(index, 1)
                        setList(newList)
                        toastMsg('Item excluído.')
                    }}
                >
                    <TextSctFooter>Excluir</TextSctFooter>
                </ButtonSection>
                <Action>
                <InputVertArea width='26%'>
                    <Input
                        value={newList[index_section].data[index].name}
                        onChangeText={text => {
                            newList[index_section].data[index].name = text
                            setList(newList)
                        }}
                        placeholder='Nome'
                        
                    />
                    <TextCaption>0/30</TextCaption>
                </InputVertArea>
                <InputVertArea width='34%'>
                    <Input
                        value={newList[index_section].data[index].description}
                        onChangeText={text => {
                            newList[index_section].data[index].description = text
                            setList(newList)
                        }}
                        placeholder='Descrição'
                        
                    />
                    <TextCaption>0/60</TextCaption>
                </InputVertArea>
                <InputVertArea width='26%'>
                    <Input
                        value={newList[index_section].data[index].price}
                        onChangeText={text => {
                            newList[index_section].data[index].price = text
                            setList(newList)
                        }}
                        placeholder='Preço'
                        keyboardType='numeric'
                    />
                </InputVertArea>
                </Action>
                {/* </InputHeaderArea> */}
            </ItemArea>
        )
    }

    function renderSectionFooter({section}) {
        let index = list.indexOf(section)
        let last_index = list.length - 1

        return (
            <SectionFooter style={{ marginBottom: index == last_index ? 60 : 20 }} >
                <ButtonSctFooter
                    style={{ marginVertical: 15, paddingHorizontal: 15, alignSelf: 'flex-start' }}
                    onPress={() => handleAddAdd(section)}
                    activeOpacity={.9}
                >
                    <TextSctFooter>+</TextSctFooter>
                    <TextSctFooter style={{ left: 5 }} >Adicionar complemento</TextSctFooter>
                </ButtonSctFooter>
            </SectionFooter>
        )
    }

    return (
        <Page>
            {/* <Scroll contentContainerStyle={{ alignItems: 'center' }} ref={scrollViewRef} > */}
            <Header>
                <HeaderTitle>Complementos</HeaderTitle>
                <ButtonSctFooter
                    // style={{ marginLeft: 10 }}
                    onPress={handleAddCtg}
                    activeOpacity={.9}
                >
                    <TextSctFooter style={{ right: 5 }} >+</TextSctFooter>
                    <TextSctFooter>Adicionar categoria</TextSctFooter>
                </ButtonSctFooter>
            </Header>
            {/* <TopAndMiddleArea> */}
                {/* <ButtonSctFooter
                    style={{ marginLeft: 10 }}
                    onPress={handleAddCtg}
                    activeOpacity={.9}
                >
                    <TextSctFooter style={{ right: 5 }} >+</TextSctFooter>
                    <TextSctFooter>Adicionar categoria</TextSctFooter>
                </ButtonSctFooter> */}
                <SectionList
                    // contentContainerStyle={{ width: '100%', alignItems: 'center', paddingHorizontal: 20}}
                    // style={{ width: '100%', paddingHorizontal: 20 }}
                    style={{ flex: 1, width: '100%', paddingHorizontal: 20, paddingTop: 20 }}
                    // scrollEnabled={false}
                    sections={list}
                    renderSectionHeader={renderSectionHeader}
                    renderItem={renderItem}
                    renderSectionFooter={renderSectionFooter}
                    keyExtractor={(item) => item.id}
                    ref={sectionListRef}
                    keyboardShouldPersistTaps='handled'
                />
            {/* </TopAndMiddleArea> */}
            {!isKeyboardVisible &&
            <ButtonArea>
                <ButtonChoose
                    onPress={() => goBack()}
                    bgColor='#fff'
                >
                    <ButtonText color='#fe9601' >Voltar</ButtonText>
                </ButtonChoose>

                <ButtonChoose
                    onPress={handleAdvance}
                >
                    <ButtonText>Próximo</ButtonText>
                </ButtonChoose>
            </ButtonArea>}
            {/* </Scroll> */}
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        tabBarLabel: 'Complementos'
    }
}

export default Screen