import React, { useState, useEffect, useRef } from 'react'
import { SectionList, Dimensions, ToastAndroid } from 'react-native'
import { normalize } from '../../functions'
import styled from 'styled-components/native'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from '../../../firebase'

// Components:
import TopArea from './TopArea'
import { ForceTouchGestureHandler } from 'react-native-gesture-handler'

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const BottomArea = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`
//border-top-width: .5px;

const StuffArea = styled.View`
    width: 100%;
    justify-content: center;
    border-top-width: ${normalize(.5)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999
    padding-vertical: ${normalize(15)}px;
    padding-horizontal: ${normalize(20)}px
`
//height: 80px
//padding-vertical: 60px;
//height: auto;
//padding-vertical: 10px

const StuffText = styled.Text`
    font-size: ${(props) => props.fSize ? props.fSize : normalize(20)}px;
    color: ${(props)=>props.color ? props.color : '#555'};
    margin-vertical: ${normalize(5)}px;
    text-align: justify;
`

const Section = styled.View`
    min-height: ${normalize(60)}px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: ${normalize(20)}px;
    padding-vertical: ${normalize(10)}px;
    border-top-width: ${normalize(.5)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
    margin-top: ${normalize(20)}px;
`

const SectionTitle = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    margin-vertical: ${normalize(3)}px;
`

const SectionCaption = styled.Text`
    font-size: ${normalize(16)}px;
    color: #777;
    font-weight: ${props => props.weight || 'normal'};
    margin-vertical: ${normalize(3)}px;
`

const LeftSectArea = styled.View``

const RightSectArea = styled.View`
    justify-content: space-between;
    align-items: center;;
`

const MustText = styled.Text`
    font-size: ${normalize(16)}px;
    font-weight: bold;
    text-align: center;
    text-align-vertical: center;
    color: ${props => props.color || '#fe9601'};
    border: ${normalize(2)}px solid ${props => props.bdColor || '#fe9601'};
    border-radius: ${normalize(50)}px;
    padding-top: 0px;
    padding-horizontal: ${normalize(5)}px;
`
// width: ${normalize(11.7)}px;
// margin-vertical: 5px;

const Item = styled.TouchableHighlight`
    min-height: ${normalize(60)}px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border: ${normalize(.5)}px solid ${props => props.many_select >= 1 || props.one_select ? '#fe9601' : '#ccc'};
    border-radius: ${normalize(3)}px;
    padding: ${normalize(10)}px;
    margin-horizontal: ${normalize(5)}px;
`

const ItemContent = styled.View`
    flex: 1;
`

const ItemText = styled.Text`
    font-size: ${normalize(15)}px;
    color: #333;
`

const ItemCaption = styled.Text`
    font-size: ${normalize(16)}px;
    color: #999;
    margin-bottom: ${normalize(3)}px;
`

const BoxExtra = styled.View`
    height: ${normalize(24)}px;
    width: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.many_select >= 1 || props.one_select ? '#b9f7bf' : '#ccc'};
    border: ${normalize(5)}px solid ${props => props.many_select >= 1 || props.one_select ? '#fe9601' : '#ccc'};
    border-radius: ${props => props.radius || normalize(12)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const AmountArea = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const ButtonAmount = styled.TouchableHighlight`
    height: ${normalize(40)}px;
    width: ${normalize(40)}px;
    justify-content: center;
    align-items: center;
    border-radius: ${normalize(20)}px;
    margin-horizontal: ${normalize(5)}px;
`

// const ButtonAddArea = styled.View`
//     height: 80px;
//     width: 100%;
//     justify-content: center;
//     align-items: center;
//     bottom: 0px;
// `

// const ButtonAdd = styled.TouchableOpacity`
//     height: 40px;
//     width: 90%;
//     justify-content: center;
//     align-items: center;
//     background-color: #fe9601;
//     border-radius: 3px;
//     elevation: 2;
// `

const ButtonAddNote = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    border-top-width: ${normalize(.5)}px;
    border-bottom-width: ${normalize(.5)}px;
    border-color: #999;
    padding: ${normalize(15)}px ${normalize(20)}px;
    margin-top: ${normalize(20)}px;
`

const ButtonText = styled.Text`
    font-size: ${props => props.size || normalize(16)}px;
    color: #fe9601;
    left: ${normalize(20)}px;
`

const InputVertArea = styled.View`
    width: 90%;
    align-self: center;
    margin-top: ${normalize(20)}px;
`

const Input = styled.TextInput`
    width: 100%;
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
    
    padding-horizontal: ${normalize(10)}px;
    font-size: ${normalize(16)}px;
`
// height: 50px;

const TextCapInput = styled.Text`
    font-size: ${normalize(14)}px;
    color: #555;
    alignSelf: flex-end;
`

export default (props) => {
    //const [ extraActive, setExtraActive ] = useState(false)
    const [ loadBottom, setLoadBottom ] = useState(false)
    const [ selected, setSelected ] = useState({})
    const [ disabled, setDisabled ] = useState(false)
    const [ activeObs, setActiveObs ] = useState(false)
    // const [ list, setList ] = useState(null)

    const add_ons = firebase.database().ref('add-ons')
    // const sectionListRef = useRef()

    const inputRef_1 = useRef()

    let { 
        cityId, 
        data, 
        list, 
        setList, 
        sectionListRef, 
        scrollTo, 
        note, 
        setNote, 
        priceInfo, 
        setPriceInfo, 
        amount,
        nav
    } = props

    let mgBetween = 3
    let highlight = 'rgba(0, 0, 0, .03)'

    function onPriceChange(text) {
        let conv_num = num => isNaN(num) ? 0 : Number(num)
        // let newText = Number(text)
        // let cleaned = ('' + text).replace(/[^\d.,]/g, '')
        let cleaned = ('' + text).replace(/\D/g, '')
        // let num_format = Number(text).toFixed(2).toString()
        function afterComma() {
            let intCleaned = conv_num(parseInt(cleaned))
            // console.log(intCleaned)
            let newCleaned = intCleaned.toString()
            // console.log(intCleaned)
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

    /*
    useEffect(() => {
        console.log(eggActive)
    }, [eggActive])
    */

    /*
    useEffect(() => {
        add_ons.child(data.id).on('value', snapshot => {
            let newList = Array.from(snapshot.val())
            // console.log('---------------ANTIGA LISTA---------------')
            // console.log(newList)
            let must = 'must'
            newList.forEach((item) => {
                item.minQtt = item.minQtt.length == 0 ? 0 : Number(item.minQtt)
                item.maxQtt = item.maxQtt.length == 0 ? 0 : Number(item.maxQtt)
                // item.amount = item.must && item.maxQtt == 1 ? 1 : 0
            })
            // console.log('---------------NOVA LISTA---------------')
            // console.log(newList)
            // snapshot.forEach((childItem) => {
            //     console.log(childItem.val())
            // })
            // let newList = []
            // snapshot.forEach((childItem) => {
            //     newList.push(childItem.val())
            // })
            // setList(newList)
            setList(newList)
            // console.log('---------------ATUAL LISTA---------------')
            console.log(list)
            // console.log(newList)
        })
    }, [])
    */

    /*
    useEffect(() => {
        setTimeout(() => {
            setLoadBottom(true)
        }, 200)
    }, [])
    */

    function toastMsg(msg) {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            normalize(180),
        )
    }

    function renderSectionHeader({section}) {
        let index_section = list.indexOf(section)
        let isMust = 'must'
        let list_amount = section.data.map((itemMap) => {
            return itemMap.amount
        })

        let conv_num = num => isNaN(num) ? 0 : num
        
        let result_amount = list_amount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

        // console.log('list')
        // console.log(list)
        return (
            <>
            {index_section == 0 &&
            <>
            <TopArea
                cityId={cityId}
                data={data}
                priceInfo={props.priceInfo}
                amount={props.amount}
                handleSum={props.handleSum}
                handleSub={props.handleSub}
                nav={nav}
            />
            {/* <StuffText style={{fontWeight: 'bold'}} >Ingredientes</StuffText> */}
            {data.description ?
            <StuffArea>
                <StuffText fSize={normalize(16)} >{data.description}</StuffText>
            </StuffArea> : null}
            {/* {activeObs ?
            <InputVertArea>
                <Input
                    value={note}
                    onChangeText={(t) => setNote(t)}
                    placeholder='Observação'
                    placeholderTextColor='#999'
                    selectionColor='#fe9601'
                    autoFocus={true}
                    maxLength={100}
                    multiline={true}
                    // ref={inputRef_1}
                    blurOnSubmit={true}
                />
                <TextCapInput>{note.length}/100 caracteres</TextCapInput>
            </InputVertArea>
            :
            <ButtonAddNote onPress={() => setActiveObs(true)} underlayColor='#eee' >
                <>
                <FontIcon name='plus' size={normalize(20)} color='#fe9601' />
                <ButtonText>Adicionar observação</ButtonText>
                </>
            </ButtonAddNote>} */}
            </>}
            <Section>
                <LeftSectArea>
                    <SectionTitle>{section.title}</SectionTitle>
                    {/* {(section.minQtt == 0 || section.minQtt.trim().length == 0) && section.maxQtt > 1 && */}
                    {section.minQtt == 0 && section.maxQtt > 1 && section.hasOwnProperty(isMust) &&
                    <SectionCaption>Você escolheu {result_amount} de {section.maxQtt}</SectionCaption>}

                    {section.minQtt == 0 && section.maxQtt > 1 && !section.hasOwnProperty(isMust) &&
                    <SectionCaption>Escolha até {section.maxQtt} itens</SectionCaption>}

                    {section.minQtt >= 1 && section.maxQtt == 0 && section.hasOwnProperty(isMust) &&
                    <SectionCaption>Escolha {section.minQtt} {section.minQtt == 1 ? 'item' : 'itens'} no mínimo</SectionCaption>}

                    {section.minQtt > 0 && section.maxQtt > 1 && section.hasOwnProperty(isMust) &&
                    <SectionCaption>Escolha de {section.minQtt} a {section.maxQtt} itens</SectionCaption>}
                    
                    {/* {(section.minQtt == 0 || section.minQtt.trim().length == 0) && section.maxQtt == 1 && */}
                    {section.minQtt == 0 && section.maxQtt == 1 &&
                    <SectionCaption>Escolha {section.maxQtt} item</SectionCaption>}

                    {/* {section.minQtt.trim().length === 0 && section.maxQtt.trim().length === 0 && null} */}
                    {/* {section.minQtt == 0 && section.maxQtt == 0 && null} */}
                </LeftSectArea>

                {section.must && <MustText>Obrigatório</MustText>}
            </Section>
            </>
        )
    }

    function renderItem({item, index, section}) {
        let price = Number(item.price)
        let index_section = list.indexOf(section)
        // setAmount(list[index_section].data[index].amount)
        let listCopy = Array.from(list)
        let last_index = listCopy.length - 1
        let last_index_item = section.data.length - 1
        let must = 'must'
        // item.amount = 1
        // console.log(list[index_section].data[index])
        console.log('----------------SEÇÃO DO ITEM----------------')
        // console.log(section.data.indexOf(item))
        console.log(section.data.length)
        // listCopy[index_section].data[index].amount = item.hasOwnProperty(must) && item.maxQtt == 1 ? 1 : 0

        function resultPriceAmount() {
            let conv_num = num => isNaN(num) ? 0 : num
            let all_items = list.reduce(item => { return item })
            let list_amount = all_items.data.filter(a => {
                // let item_price = a.price * a.amount
                // let div_am_pr = item_price / a.amount
                return a.price * a.amount
            })
            let result_amount = list_amount.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)
            // let result_amount = list_amount.reduce((a, b) => { return conv_num(b) }, 0)

            // console.log(result_amount)

            return result_amount
        }

        function resultItems() {
            let list_count = listCopy[index_section].data.map(a => {return a.amount})
            // let result_count = list_count.reduce((a, b) => )
            // console.log(list_count)
            let conv_num = num => isNaN(num) ? 0 : num

            let result_count = list_count.reduce((a, b) => { return conv_num(a) + conv_num(b) }, 0)

            return result_count
        }

        function handleSelect() {
            // let minQtt = section.minQtt.trim().length == 0 ? 0 : section.minQtt
            // let maxQtt = section.maxQtt.trim().length == 0 ? 0 : section.maxQtt
            let next_item = Number(index_section) + 1

            
            if (section.multItem) {
                // let must = 'must'
                // console.log(next_item)
                // console.log(listCopy[index_section].data)
                if (resultItems() < section.maxQtt || (section.minQtt == 0 && section.maxQtt == 0)) {
                    listCopy[index_section].data[index].amount += 1
                    // let sum_price = priceInfo / (priceInfo + resultPriceAmount())
                    // let resultPrice = priceInfo + resultPriceAmount()
                    // setPriceInfo(resultPrice)
                    // console.log(resultPrice)
                }
                // resultItems() < section.maxQtt ? listCopy[index_section].data[index].amount += 1 : null
                
                if (resultItems() == section.maxQtt && next_item <= last_index && section.hasOwnProperty(must)) {

                    scrollTo(next_item)
                    // setDisabled(true)
                }
                // console.log(resultItems())

                // console.log(`resultItems = ${resultItems()}`)
                // console.log(`Section.MaxQtt = ${section.maxQtt}`)
                let condManyItems = section.minQtt >= 0 && section.maxQtt == 0

                if (section.hasOwnProperty(must)) {
                    // console.log('Must existe em section.')
                    // listCopy[index_section].must = resultItems() > 0 ? false : true
                    listCopy[index_section].must = resultItems() == section.maxQtt || condManyItems ? false : true
                }
                // setList(listCopy)
                // listCopy[index_section].must = resultItems() > 0 ? false : true
                
            } else if ((section.minQtt >= 0 && section.maxQtt == 0) || (section.maxQtt > 1 && !section.multItem)) {
                let condManyItems = section.minQtt >= 0 && section.maxQtt == 0
                // console.log(`Tamanho de list: ${listCopy.length}`)
                let qttItems = section.data.length
                
                // let must = 'must'
                if ((resultItems() < section.maxQtt || section.maxQtt == 0) && item.amount == 0) {
                    listCopy[index_section].data[index].amount = item.amount == 0 ? 1 : 0
                    // console.log('Ao selecionar')
                } else if (item.amount == 1) {
                    listCopy[index_section].data[index].amount = 0
                    // console.log('Ao deselecionar')
                }
                // 
                // if (resultItems() == section.maxQtt && next_item <= last_index && section.hasOwnProperty(must)) {
                //     scrollTo(next_item)
                // }
                if (section.hasOwnProperty(must) && next_item <= last_index && condManyItems) {
                    resultItems() == qttItems ? scrollTo(next_item) : null
                } else if (section.hasOwnProperty(must) && next_item <= last_index) {
                    resultItems() == section.maxQtt ? scrollTo(next_item) : null
                }

                // console.log(`resultItems = ${resultItems()}`)
                // console.log(`Section.MaxQtt = ${section.maxQtt}`)
                // console.log(`Section.MinQtt = ${section.minQtt}`)
                
                // if (section.hasOwnProperty(must) && condManyItems) {
                if (section.hasOwnProperty(must) && section.minQtt >= 1) {
                    // listCopy[index_section].must = resultItems() > 0 ? false : true
                    listCopy[index_section].must = resultItems() >= section.minQtt ? false : true
                    // console.log('Ativou opção 1')
                } else if (section.hasOwnProperty(must) && section.minQtt == 0 && section.maxQtt == 0) {
                    listCopy[index_section].must = resultItems() > 0 ? false : true
                    // console.log('Ativou Opção 2')
                } else if (section.hasOwnProperty(must)) {
                    listCopy[index_section].must = resultItems() == section.maxQtt ? false : true
                    // console.log('Ativou opção 3')
                }
                

            } else {
                // let must = 'must'
                // listCopy[index_section].data[index].amount = item.amount == 0 ? 1 : 0
                // setSelected(listCopy[index_section].data[index])
                // setSelected(item)
                listCopy[index_section].data.map((itemMap, indexMap) => {
                    if (itemMap.id == item.id) {
                        listCopy[index_section].data[index].amount = item.amount == 0 ? 1 : 0
                    } else {
                        listCopy[index_section].data[indexMap].amount = 0
                    }
                })
                // console.log(section)
                if (section.hasOwnProperty(must)) {
                    // console.log(item)
                    listCopy[index_section].must = !section.must && item.amount == 0 ? true : false
                    !section.must && next_item <= last_index ? scrollTo(next_item) : null
                }
                
                // setSelected(Object.keys(selected).length > 0 && selected.id == item.id ? {} : item)
                
                // if (section.hasOwnProperty(must)) {
                //     listCopy[index_section].must = !section.must && Object.keys(selected).length > 0 && selected.id == item.id ? true : false
                //     section.must == false && next_item <= last_index ? scrollTo(next_item) : null
                // }
                
                // if (!section.must && Object.keys(selected).length > 0 && selected.id == item.id) {
                //     listCopy[index_section].must = true
                // } else {
                //     listCopy[index_section].must = false
                // }

                
                // listCopy[index_section].data[index].amount = 
                // setSelected(item)
            }
            setList(listCopy)
            
            // let resultPrice = sum_price + (item.amount * item.price)
           
        }

        function handleRemove() {
            let condManyItems = section.minQtt == 0 && section.maxQtt == 0
            
            if (item.amount > 0) {
                listCopy[index_section].data[index].amount -= 1
                // let sub_price = priceInfo
                // let resultPrice = sub_price - (item.amount * item.price)
                // let resultPrice = sub_price - resultPriceAmount()
                // setPriceInfo(resultPrice)
                // console.log(resultPrice)
                // setPriceInfo(resultPrice)
                setList(listCopy)
                // console.log(resultItems())
            }
            // let must = 'must'

            if (section.hasOwnProperty(must)) {
                // console.log(resultItems())
                // console.log('Must existe em section.')
                // listCopy[index_section].must = resultItems() > 0 ? false : true
                listCopy[index_section].must = (resultItems() == section.maxQtt && !condManyItems) || (resultItems() > 0 && condManyItems) ? false : true
            }
            // listCopy[index_section].must = resultItems() > 0 ? false : true
            
            // console.log(item.amount)
        }

        function handleAdd() {
            let condManyItems = section.minQtt == 0 && section.maxQtt == 0
            let next_item = Number(index_section) + 1
            resultItems() < section.maxQtt || (section.minQtt == 0 && section.maxQtt == 0) ? listCopy[index_section].data[index].amount += 1 : null
            
            // let sum_price = priceInfo
            // let resultPrice = sum_price + (item.amount * item.price)
            // let resultPrice = sum_price + resultPriceAmount()
            // console.log(resultPrice)
            // setPriceInfo(resultPrice)
            
            if (resultItems() == section.maxQtt && next_item <= last_index && section.hasOwnProperty(must)) {
                // toastMsg('Items selecionados.')
                scrollTo(next_item)
                // setDisabled(true)
            }

            // let must = 'must'
            
            if (section.hasOwnProperty(must)) {
                // console.log('Must existe em section.')
                // listCopy[index_section].must = resultItems() > 0 ? false : true
                listCopy[index_section].must = resultItems() == section.maxQtt || condManyItems ? false : true
            } else {
                // console.log('Must não existe em section.')
            }

            setList(listCopy)
            // listCopy[index_section].must = resultItems() > 0 ? false : true
        }

        function boxRadius() {
            // let minQtt = isNaN(section.minQtt) && section.minQtt.trim().length == 0 ? '' : Number(section.minQtt)
            // let maxQtt = isNaN(section.maxQtt) && section.maxQtt.trim().length == 0 ? '' : Number(section.maxQtt)
            let minQtt = section.minQtt
            let maxQtt = section.maxQtt
            // console.log(section.minQtt.trim().length == 0 ? 'minQtt vazio' : minQtt)
            // console.log(section.maxQtt.trim().length == 0 ? 'maxQtt vazio' : maxQtt)
            // console.log(section.minQtt.trim().length == 0 && section.maxQtt.trim().length == 0 ? 'minQtt vazio e maxQtt vazio' : section.minQtt + ' ' + section.maxQtt )

            if (maxQtt > 1)  {
                return 3
            // } else if (minQtt.trim().length == 0 && maxQtt.trim().length == 0) {
            } else if (minQtt >= 0 && maxQtt == 0) {
                return 3
            } else {
                return 12
            }

            // else if (minQtt >= 0 && maxQtt.trim().length == 0) {
            //     return 3
            // }
        }

        // function handleDisabled() {
        //     let minQtt = section.minQtt.trim().length == 0 ? 0 : section.minQtt
        //     let maxQtt = section.maxQtt.trim().length == 0 ? 0 : section.maxQtt
            
        //     if (resultItems() == section.maxQtt) {
        //         return true
        //     } else {
        //         return false
        //     }
        // }

        function condMultItem() {
            // resultItems() < section.maxQtt && item.amount == 0
            if (resultItems() < section.maxQtt) {
                if (item.amount == 0) {
                    return true
                }
            }
            return false
        }

        function observationItem() {
            if (index_section === last_index && index === last_index_item) {
                if (activeObs) {
                    return (
                        <InputVertArea>
                            <Input
                                value={note}
                                onChangeText={(t) => setNote(t)}
                                placeholder='Observação'
                                placeholderTextColor='#999'
                                selectionColor='#fe9601'
                                autoFocus={true}
                                maxLength={100}
                                multiline={true}
                                // ref={inputRef_1}
                                blurOnSubmit={true}
                            />
                            <TextCapInput>{note.length}/100 caracteres</TextCapInput>
                        </InputVertArea>
                    )
                } else {
                    return (
                        <ButtonAddNote onPress={() => setActiveObs(true)} underlayColor='rgba(0, 0, 0, .03)' >
                            <>
                            <FontIcon name='plus' size={normalize(20)} color='#fe9601' />
                            <ButtonText>Adicionar observação</ButtonText>
                            </>
                        </ButtonAddNote>
                    )
                }
            }
        }

        // let condManySelect = section.multItem || (!section.multItem && section.maxQtt > 1) || (section.minQtt >= 0 && section.maxQtt.trim().length == 0) ? item.amount : null
        let condManySelect = section.multItem || (!section.multItem && section.maxQtt > 1) || (section.minQtt >= 0 && section.maxQtt == 0) ? item.amount : null

        return (
            <>
            <Item
                onPress={handleSelect}
                underlayColor={resultItems() == section.maxQtt ? '#b9f7bf' : 'rgba(0, 0, 0, .03)'}
                many_select={condManySelect}
                // one_select={selected.id == item.id}
                one_select={section.minQtt == 0 && section.maxQtt == 1 ? item.amount : null}
                style={{
                    marginTop: index == 0 ? normalize(20) : normalize(15),
                    // borderColor: selected.id == item.id ? '#fe9601' : '#ccc'
                }}
                // disabled={item.amount == section.maxQtt ? true : false}
                // resultItems() == section.maxQtt && (section.id == listCopy[index_section].id) ? true : false
                // disabled={handleDisabled()} 
            >
                <>
                <BoxExtra
                    // radius={Number(section.maxQtt) > 1 ? 3 : 12}
                    radius={boxRadius}
                    many_select={condManySelect}
                    // one_select={selected.id == item.id}
                    one_select={section.minQtt == 0 && section.maxQtt == 1 ? item.amount : null}
                    // selected={selected && selected.id == item.id ? true : false}
                    // style={{
                    //     backgroundColor: selected.id == item.id ? '#b9f7bf' : '#ccc',
                    //     borderColor: selected.id == item.id ? '#fe9601' : '#ccc'
                    // }}
                >
                </BoxExtra>
                <ItemContent>
                    <ItemText style={{ marginBottom: normalize(3) }} >{item.name}</ItemText>
                    {item.description ? <ItemCaption>{item.description}</ItemCaption> : null}
                    {/* {item.price ? <ItemText style={{ marginTop: 3 }} >R$ {price.toFixed(2).replace('.', ',')}</ItemText> : null} */}
                    {item.price ? <ItemText style={{ marginTop: normalize(3) }} >{onPriceChange(item.price)}</ItemText> : null}
                </ItemContent>
                {section.multItem &&
                <AmountArea>
                    <ButtonAmount
                        onPress={handleRemove}
                        underlayColor='rgba(0, 0, 0, .03)'
                    >
                        {/* <FontIcon name='minus' size={20} color='#ff2626' /> */}
                        <Icon name='remove' size={normalize(25)} color='#ff2626' />
                    </ButtonAmount>
                        <ItemText style={{ color: '#ff2626', fontSize: normalize(16) }} >{item.amount}</ItemText>
                    <ButtonAmount
                        onPress={handleAdd}
                        underlayColor={resultItems() == section.maxQtt ? '#b9f7bf' : 'rgba(0, 0, 0, .03)'}
                    >
                        {/* <FontIcon name='plus' size={20} color='#ff2626' /> */}
                        <Icon name='add' size={normalize(25)} color='#ff2626' />
                    </ButtonAmount>
                </AmountArea>}
                </>
            </Item>
            {observationItem()}
            </>
        )
    }

    return (
        <BottomArea>
            {!list || list.length == 0 &&
            <>
                <TopArea
                    cityId={cityId}
                    data={data}
                    priceInfo={props.priceInfo}
                    amount={props.amount}
                    handleSum={props.handleSum}
                    handleSub={props.handleSub}
                    nav={nav}
                />
                {data.description ? <StuffArea>
                    <StuffText fSize={normalize(16)} >{data.description}</StuffText>
                </StuffArea> : null}
                {activeObs ?
                <InputVertArea>
                    <Input
                        value={note}
                        onChangeText={(t) => setNote(t)}
                        placeholder='Observação'
                        placeholderTextColor='#999'
                        selectionColor='#fe9601'
                        autoFocus={true}
                        maxLength={100}
                        multiline={true}
                        blurOnSubmit={true}
                    />
                    <TextCapInput>{note.length}/100 caracteres</TextCapInput>
                </InputVertArea>
                :
                <ButtonAddNote onPress={() => setActiveObs(true)} underlayColor='rgba(0, 0, 0, .03)' >
                    <>
                    <FontIcon name='plus' size={normalize(20)} color='#fe9601' />
                    <ButtonText >Adicionar observação</ButtonText>
                    </>
                </ButtonAddNote>}
            </>}
            {/* <StuffText style={{fontWeight: 'bold'}} >Ingredientes</StuffText> */}
            <SectionList
                // contentContainerStyle={{ paddingBottom: normalize(80) }}
                contentContainerStyle={{ paddingBottom: normalize(40) }}
                style={{ flex: 1, width: '100%' }}
                sections={list}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
                onScrollToIndexFailed={info => {
                    // const wait = new Promise(resolve => setTimeout(resolve, 2000))
                    // wait.then(() => {
                    //     sectionListRef.current.scrollToLocation({
                    //         animated: true,
                    //         sectionIndex: info.index,
                    //         itemIndex: 0,
                    //         viewOffset: 0
                    //     })
                    //     // sectionListRef.current.scrollToIndex({ index: info.index, animated: true })
                    // })
                }}
                keyExtractor={(item) => item.id}
                ref={sectionListRef}
                keyboardShouldPersistTaps='handled'
            />
            {/* <ButtonAddArea>
                <ButtonAdd>
                    <ButtonText>Adicionar à sacola</ButtonText>
                </ButtonAdd>
            </ButtonAddArea> */}
        </BottomArea>
)}