import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { View, Button, Platform, Dimensions, ToastAndroid } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { normalize } from '../functions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';

// Contexts:
import LoaderContext from '../contexts/LoaderContext';

const { height, width } = Dimensions.get('window')

// function normalize(size) {
//     return (width + height) / size
// }

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #fff;
`;

const Scroll = styled.ScrollView`

`

const Item = styled.TouchableHighlight`
    flex-direction: row;
    width: 100%;
    align-items: center;
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
`
// padding: 15px 10px;
// padding-horizontal: 10px;

const OverlayContainer = styled.View`
    height: 100%;
    width: 100%;
    flex-direction: row;
    background-color: rgba(255, 255, 255, .4);
    position: absolute;
    zIndex: 3;
`

const Header = styled.View`
    flex-direction: row;
    background-color: rgba(0, 0, 0, .08);
    border-bottom-width: ${normalize(1)}px;
    border-color: #ccc;
    padding-vertical: ${normalize(10)}px;
    padding-horizontal: ${normalize(15)}px;
`

const Title = styled.Text`
    font-size: ${normalize(18)}px;
    font-weight: bold;
    color: #333;
    border-color: #ccc;
`

const LeftItem = styled.View`
    flex-direction: row;
    width: 35%;
    padding-left: ${props => props.pdLeft || normalize(10)}px;
`

const RightItem = styled.View`
    flex-direction: row;
    width: 65%;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    padding-right: ${props => props.pdRight || normalize(10)}px;
`

const BoxSquare = styled.View`
    height: ${normalize(24)}px;
    width: ${normalize(24)}px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#fff' : '#ddd'};
    border: ${normalize(5)}px solid ${props => props.selected ? '#fe9601' : '#ddd'};
    border-radius: ${normalize(3)}px;
    margin-right: ${normalize(15)}px;
    margin-left: ${normalize(5)}px;
`

const ItemText = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    color: ${props => props.color || '#000'};
`

const DoubleAction = styled.View`
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: ${normalize(5)}px;
    padding-vertical: ${normalize(10)}px;
`;
// width: 100%
// margin-top: ${normalize(50)}px;
// margin-horizontal: 5px;

const Action = styled.View`
    flex-direction: column;
    justify-content: center;
    width: ${props => props.width || '100%'};
`;

const Input = styled.TextInput`
    padding: 0px;
`

const ButtonInput = styled.TouchableOpacity`
    border-bottom-width: ${normalize(1)}px;
    border-color: #fe9601;
    justify-content: center;
    align-items: center;
    padding-vertical: ${normalize(5)}px;
`;
// height: 43px;
// margin-top: ${normalize(150)}px
// padding-vertical: ${normalize(100)}px;
// padding-vertical: 10px;

const ButtonSave = styled.TouchableHighlight`
    height: ${normalize(48)}px;
    width: 90%;
    justify-content: center;
    align-items: center;
    background-color: #fe9601;
    border-radius: ${normalize(3)}px;
    margin-vertical: ${normalize(60)}px;
`
// height: ${normalize(24)}px;

const ButtonText = styled.Text`
    font-size: ${props => props.size || normalize(18)}px;
    font-weight: bold;
    color: ${props => props.color || '#fff'};
`
// font-size: ${props => props.size || normalize(63)}px;

const ButtonCopy = styled.TouchableOpacity`
    flex-direction: row;
    padding-horizontal: ${normalize(15)}px;
    padding-vertical: ${normalize(15)}px;
`

const Screen = (props) => {
    const [ schedulesP1, setSchedulesP1 ] = useState([
        {day: 'Domingo', id: 0, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Segunda', id: 1, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Terça', id: 2, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Quarta', id: 3, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Quinta', id: 4, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Sexta', id: 5, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Sábado', id: 6, begin: '', end: '', date_beg: undefined, date_end: undefined},
    ])

    const [ schedulesP2, setSchedulesP2 ] = useState([
        {day: 'Domingo', id: 0, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Segunda', id: 1, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Terça', id: 2, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Quarta', id: 3, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Quinta', id: 4, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Sexta', id: 5, begin: '', end: '', date_beg: undefined, date_end: undefined},
        {day: 'Sábado', id: 6, begin: '', end: '', date_beg: undefined, date_end: undefined},
    ])
    // const [ domP1, setDomP1 ] = useState('')
    // const [ segP1, setSegP1 ] = useState('')
    // const [ terP1, setTerP1 ] = useState('')
    // const [ quaP1, setQuaP1 ] = useState('')
    // const [ qui ]
    const [ isDatePickerVisible, setDatePickerVisibility ] = useState(false)
    const [ selectedField, setSelectedField ] = useState({})
    const [ selectedDaysP1, setSelectedDaysP1 ] = useState([])
    const [ selectedDaysP2, setSelectedDaysP2 ] = useState([])

    const [ date, setDate ] = useState(new Date())
    const [ mode, setMode ] = useState('date')
    const [ show, setShow ] = useState(false)
    // const [ timeFormat, setTimeFormat ] = useState('00:00')
    const [ loaderVisible, setLoaderVisible ] = useContext(LoaderContext)

    const { navigation } = props
    const goBack = navigation.goBack

    const toastMsg = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg.toString(),
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            180
        )
    }

    function onScreen() {
        if (props.schedulesP1.length > 0) {
            let schedulesP1Copy = Array.from(schedulesP1)
            let selectedReducerDaysP1 = props.schedulesP1.map(x => { return x.day })
            let schedulesP1Days = schedulesP1.map(x => { return x.day })
            let filteredDaysP1Index = selectedReducerDaysP1.map(x => { return schedulesP1Days.indexOf(x) })

            setSelectedDaysP1(filteredDaysP1Index)

            props.schedulesP1.map(item => {
                let index = schedulesP1Days.indexOf(item.day)
                schedulesP1Copy[index].begin = item.begin
                schedulesP1Copy[index].end = item.end
                schedulesP1Copy[index].date_beg = new Date(item.date_beg)
                schedulesP1Copy[index].date_end = new Date(item.date_end)
            })

            // console.log('Copy')
            // console.log(schedulesP1Copy)

            setSchedulesP1(schedulesP1Copy)
        }

        if (props.schedulesP2.length > 0) {
            let schedulesP2Copy = Array.from(schedulesP2)
            let selectedReducerDaysP2 = props.schedulesP2.map(x => { return x.day })
            let schedulesP2Days = schedulesP2.map(x => { return x.day })
            let filteredDaysP2Index = selectedReducerDaysP2.map(x => { return schedulesP2Days.indexOf(x) })

            setSelectedDaysP2(filteredDaysP2Index)

            props.schedulesP2.map(item => {
                let index = schedulesP2Days.indexOf(item.day)

                schedulesP2Copy[index].begin = item.begin
                schedulesP2Copy[index].end = item.end
                schedulesP2Copy[index].date_beg = item.date_beg == 'undefined' ? undefined : new Date(item.date_beg)
                schedulesP2Copy[index].date_end = item.date_end == 'undefined' ? undefined : new Date(item.date_end)
            })

            setSchedulesP2(schedulesP2Copy)
        }
    }

    const onChange = (event, selectedDate) => {
        // console.log('Chamou onChange')
        if (selectedDate === undefined) {
            setShow(false)
        } else {
            const currentDate = selectedDate || date;
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
            if (selectedField.arr_sel === 'schedulesP1') {
                let newSchedules = Array.from(schedulesP1)
                let hours = currentDate.getHours().toString()
                let minutes = currentDate.getMinutes().toString()
                let time_format = `${hours.length < 2 ? '0' + hours : hours}:${minutes.length < 2 ? '0' + minutes : minutes}`
                
                newSchedules[selectedField.index][selectedField.prop] = time_format
                newSchedules[selectedField.index][selectedField.prop_date] = currentDate
                setSchedulesP1(newSchedules)
            } else {
                let newSchedules = Array.from(schedulesP2)
                let hours = currentDate.getHours().toString()
                let minutes = currentDate.getMinutes().toString()
                let time_format = `${hours.length < 2 ? '0' + hours : hours}:${minutes.length < 2 ? '0' + minutes : minutes}`

                newSchedules[selectedField.index][selectedField.prop] = time_format
                newSchedules[selectedField.index][selectedField.prop_date] = currentDate
                setSchedulesP2(newSchedules)
            }
        }
    };

    // useEffect(() => {
    //     // console.log('Value show:')
    //     console.log('Before:')
    //     console.log(selectedDaysP1)
    // }, [selectedDaysP1])

    const showMode = currentMode => {
        // console.log('Chamou showMode')
        setShow(true);
        setMode(currentMode);
    };

    const showDatePicker = () => {
        showMode('date');
    }

    const showTimePicker = () => {
        // console.log('Chamou showTimePicker')
        showMode('time');
    //     console.log(selectedDaysP1)
    }

    function handleSelectedDaysP1(index) {
        const alreadySelected = selectedDaysP1.findIndex(item => item === index);

        if (alreadySelected >= 0) {
            const filteredDays = selectedDaysP1.filter(item => item !== index);

            setSelectedDaysP1(filteredDays);
            setSelectedDaysP2(filteredDays);
            // console.log(index)


            // let newSelectedDaysP2 = Array.from(selectedDaysP2)
            // let idxSelP2 = selectedDaysP2.indexOf(index)

            // if (idxSelP2 >= 0) {
            //     newSelectedDaysP2.splice(idxSelP2, 1)
            //     setSelectedDaysP2(newSelectedDaysP2)
            //     // console.log(newSelectedDaysP2)
            // }




            // console.log('Index de selectedDaysP2')
            // console.log(idx_sel)
        } else {
            setSelectedDaysP1([ ...selectedDaysP1, index ]);
            setSelectedDaysP2([ ...selectedDaysP2, index ]);
            
        }
    }

    function handleSelectedDaysP2(index) {
        const alreadySelected = selectedDaysP2.findIndex(item => item === index);
            if (alreadySelected >= 0) {
            const filteredDays = selectedDaysP2.filter(item => item !== index);

            setSelectedDaysP2(filteredDays);
        } else {
            setSelectedDaysP2([ ...selectedDaysP2, index ])
        }
    }

    // function selectedDaysP1Sorted() {
    //     return selectedDaysP1.sort()
    // }

    function selectedDaysSorted(arr) {
        return arr.sort()
    }

    // const selectedDaysP1Sorted = selectedDaysP1.sort()

    

    function handleSave() {
        setLoaderVisible(true)

        let filteredDaysP1 = selectedDaysSorted(selectedDaysP1).map(item => {
            let schedulesP1Copy = Array.from(schedulesP1)
            return schedulesP1Copy[item]
        })
        let filteredDaysP2 = selectedDaysSorted(selectedDaysP2).map(item => {
            let schedulesP2Copy = Array.from(schedulesP2)
            return schedulesP2Copy[item]
        })
        let daysP1_obj = {
            begin: [],
            end: [],
        }
        let daysP2_obj = {
            begin: [],
            end: [],
        }

        filteredDaysP1.forEach(item => {
            daysP1_obj.begin.push(item.begin)
            daysP1_obj.end.push(item.end)
        })

        filteredDaysP2.forEach(item => {
            daysP2_obj.begin.push(item.begin)
            daysP2_obj.end.push(item.end)
        })

        function isEmptyField(t) {
            return t.every(function (x) { return x.length > 0 })
        }

        function someFieldsFilled(t) {
            return t.some(function (x) { return x.length > 0 })
        }

        let condP1 = !isEmptyField(daysP1_obj.begin) || !isEmptyField(daysP1_obj.end)
        // let condP2 = filteredDaysP2.length > 0 && (!isEmptyField(daysP2_obj.begin) || !isEmptyField(daysP2_obj.end))
        let condP2 = (!isEmptyField(daysP2_obj.begin) || !isEmptyField(daysP2_obj.end)) && (someFieldsFilled(daysP2_obj.begin) || someFieldsFilled(daysP2_obj.end))

        if (filteredDaysP1.length < 1) {
            setLoaderVisible(false)
            toastMsg('Selecione os dias de funcionamento.')
        } else if (condP1) {
        //  else if (condP1 || condP2) {
            setLoaderVisible(false)
            toastMsg('Insira o horário nos campos selecionados.')
        } else if (condP2) {
            setLoaderVisible(false)
            
            toastMsg('Ao definir pelo menos um horário no 2º período, é preciso definir o restante.')
        } else {
            // console.log('----------------FILTERED_P1----------------')
            // console.log(filteredDaysP1)
            filteredDaysP1.map(item => {
                item.date_beg = new Date(item.date_beg).toISOString()
                item.date_end = new Date(item.date_end).toISOString()
            })

            filteredDaysP2.map(item => {
                // item.date_beg = new Date(item.date_beg).toISOString()
                // item.date_end = new Date(item.date_end).toISOString()
                item.date_beg = item.date_beg == undefined ? 'undefined' : new Date(item.date_beg).toISOString()
                item.date_end = item.date_end == undefined ? 'undefined' : new Date(item.date_end).toISOString()
            })

            // setLoaderVisible(false)
            
            props.setSchedulesP1(filteredDaysP1)
            props.setSchedulesP2(filteredDaysP2)

            // console.log('----------------DAYS_P1----------------')
            // console.log(filteredDaysP1)
            // console.log('----------------DAYS_P2----------------')
            // console.log(filteredDaysP2)

            setTimeout(() => {
                goBack()
            }, 2000)

            // function saveP2() {
            //     cities.child(cityId).child('schedulesP2').set(filteredDaysP2)
            //     .then(() => {
            //         setLoaderVisible(false)
            //         toastMsg('Horários salvo com sucesso!')
            //     })
            //     .catch(error => {
            //         setTimeout(() => {
            //             setLoaderVisible(false)
            //             console.log(error)
            //             toastMsg(`${error.code} - ${error.message}`)
            //         }, 500)
            //     })
            // }

            // cities.child(cityId).child('schedulesP1').set(filteredDaysP1)
            // .then(() => {
            //     saveP2()
            // })
            // .catch(error => {
            //     setTimeout(() => {
            //         setLoaderVisible(false)
            //         console.log(error)
            //         toastMsg(`${error.code} - ${error.message}`)
            //     }, 500)
            // })
        }

    }

    function handleCopyAboveP1(index) {
        let schedulesP1Copy = Array.from(schedulesP1)

        schedulesP1Copy[index].begin = schedulesP1[index - 1].begin
        schedulesP1Copy[index].end = schedulesP1[index - 1].end
        schedulesP1Copy[index].date_beg = schedulesP1[index - 1].date_beg
        schedulesP1Copy[index].date_end = schedulesP1[index - 1].date_end

        setSchedulesP1(schedulesP1Copy)
        // console.log(schedulesP1Copy)
    }

    function handleCopyAboveP2(index) {
        let schedulesP2Copy = Array.from(schedulesP2)

        schedulesP2Copy[index].begin = schedulesP2[index - 1].begin
        schedulesP2Copy[index].end = schedulesP2[index - 1].end
        schedulesP2Copy[index].date_beg = schedulesP2[index - 1].date_beg
        schedulesP2Copy[index].date_end = schedulesP2[index - 1].date_end

        setSchedulesP2(schedulesP2Copy)
    }

    // function outScreen() {
    //     let schedulesP1Copy = Array.from(schedulesP1)
    //     // console.log('-------------BEFORE-------------')
    //     // console.log(schedulesP1Copy)
    //     schedulesP1Copy.map(item => {
    //         item.begin = ''
    //         item.end = ''
    //         item.date_beg = undefined
    //         item.date_end = undefined
    //     })
    //     // console.log('-------------AFTER-------------')
    //     // console.log(schedulesP1Copy)
    // }

    return (
        <Page>
            <NavigationEvents
                onWillFocus={onScreen}
                // onWillBlur={outScreen}
            />
            <Scroll
                contentContainerStyle={{ paddingBottom: normalize(80), alignItems: 'center' }}
            >
                <Header>
                    <LeftItem pdLeft='0' >
                        <Title>Dias:</Title>
                    </LeftItem>
                    <RightItem>
                        <Title>1º Período:</Title>
                    </RightItem>
                </Header>
                {schedulesP1.map((item, index) => (
                    <Item
                        key={index}
                        // onPress={() => {
                        //     daysCopy = JSON.parse(JSON.stringify(days))
                        //     daysCopy[index].active = !daysCopy[index].active
                        //     setDays(daysCopy)
                        // }}
                        onPress={() => {
                            handleSelectedDaysP1(index)
                            // console.log('Before:')
                            // console.log(selectedDaysP1)
                        }}
                        // onPress={() => handleSelectedDaysP1(index)}
                        underlayColor='#eee'
                        // hitSlop={{ top: 20, bottom: 20 }}
                    >
                        <>
                        <LeftItem>
                            <BoxSquare selected={selectedDaysP1.includes(index) ? true : false} ></BoxSquare>
                            {/* <BoxSquare selected={selectedDaysP1.includes(index) ? true : false} ></BoxSquare> */}
                            <ItemText>{item.day}</ItemText>
                        </LeftItem>

                        <RightItem>
                            <DoubleAction>
                                <Action
                                    width='35%'
                                >
                                    {/* <ItemText style={{ alignSelf: 'center', bottom: -15, fontSize: 16 }} >{date.getHours()}</ItemText> */}
                                    <ButtonInput
                                        onPress={() => {
                                            // console.log('Chamou o botão filho 1')
                                            showTimePicker()
                                            setSelectedField({ arr_sel: 'schedulesP1', index, prop: 'begin', prop_date: 'date_beg' })
                                            // console.log(Object.getOwnPropertyNames(item))
                                            setDate(item.date_beg == undefined ? new Date() : new Date(item.date_beg))
                                        }}
                                        hitSlop={{ top: normalize(15), bottom: normalize(15), left: normalize(15), right: normalize(15) }}
                                    >
                                        <ItemText size={normalize(16)} color={item.begin.length == 0 ? '#999' : '#000'} >{item.begin.length == 0 ? '00:00' : item.begin}</ItemText>
                                        {/* <Input value={date.getHours().toString()} onTouchStart={() => {
                                            Keyboard.dismiss()
                                            showTimePicker()
                                        }} /> */}
                                    </ButtonInput>
                                </Action>
                                <ItemText>às</ItemText>
                                <Action
                                    width='35%'
                                >
                                    {/* <ItemText style={{ alignSelf: 'center', bottom: -15, fontSize: 16 }} >{date.getHours()}</ItemText> */}
                                    <ButtonInput
                                        onPress={() => {
                                            // console.log('Chamou o botão filho 2')
                                            let newDate = new Date()
                                            showTimePicker()
                                            setSelectedField({ arr_sel: 'schedulesP1', index, prop: 'end', prop_date: 'date_end' })
                                            // console.log(Object.getOwnPropertyNames(item))
                                            setDate(item.date_end == undefined ? new Date() : new Date(item.date_end))
                                            // console.log(item.date_end ? newDate.toISOString() : undefined)
                                        }}
                                        hitSlop={{ top: normalize(15), bottom: normalize(15), left: normalize(15), right: normalize(15) }}
                                    >
                                        {/* <Input value={date.getHours().toString()} /> */}
                                        <ItemText size={normalize(16)} color={item.end.length == 0 ? '#999' : '#000'} >{item.end.length == 0 ? '00:00' : item.end}</ItemText>
                                    </ButtonInput>
                                </Action>
                            </DoubleAction>
                            {index > 0 &&
                            <ButtonCopy
                                onPress={() => handleCopyAboveP1(index)}
                                activeOpacity={.7}
                            >
                                <FontIcon name='long-arrow-alt-up' size={normalize(20)} color='#999' style={{ right: normalize(2) }} />
                                <FontIcon name='clone' size={normalize(20)} color='#999' style={{ left: normalize(2) }} />
                            </ButtonCopy>}
                        </RightItem>
                        
                        </>

                    </Item>
                ))}

                <Header>
                    <LeftItem pdLeft='0' >
                        <Title>Dias:</Title>
                    </LeftItem>
                    <RightItem>
                        <Title>2º Período:</Title>
                    </RightItem>
                </Header>
                {schedulesP2.map((item, index) => {
                    // function disableButton() {
                    //     if (!selectedDaysP1Sorted().includes(index)) {
                            

                    //         return true
                    //     }
                    //     return false
                    // }

                    return (
                        <Item
                            key={index}
                            // onPress={() => {
                            //     daysCopy = JSON.parse(JSON.stringify(days))
                            //     daysCopy[index].active = !daysCopy[index].active
                            //     setDays(daysCopy)
                            // }}
                            // disabled={!selectedDaysP1.includes(index) ? true : false}
                            disabled={true}
                            onPress={() => {
                                // handleSelectedDaysP2(index)
                                // console.log('After')
                                // console.log()
                            }}
                            underlayColor='#eee'
                            // hitSlop={{ top: 20, bottom: 20 }}
                        >
                            <>
                            <LeftItem>
                                {/* <BoxSquare></BoxSquare> */}
                                {/* <BoxSquare selected={selectedDaysP2.includes(index) ? true : false} ></BoxSquare> */}
                                <Icon 
                                    name={selectedDaysP2.includes(index) ? 'check' : 'close'} 
                                    size={normalize(25)} 
                                    color='#fe9601' 
                                    style={{ marginLeft: normalize(5), marginRight: normalize(15) }} 
                                />
                                <ItemText>{item.day}</ItemText>
                            </LeftItem>

                            <RightItem>
                                <DoubleAction>
                                    <Action
                                        width='35%'
                                    >
                                        {/* <ItemText>{date.getHours()}</ItemText> */}
                                        <ButtonInput
                                            onPress={() => {
                                                showTimePicker()
                                                setSelectedField({ arr_sel: 'schedulesP2', index, prop: 'begin', prop_date: 'date_beg' })
                                                setDate(item.date_beg == undefined ? new Date() : new Date(item.date_beg))
                                            }}
                                            hitSlop={{ top: normalize(15), bottom: normalize(15), left: normalize(15), right: normalize(15) }}
                                        >
                                            {/* <Input value={date.getHours().toString()} /> */}
                                            <ItemText size={normalize(16)} color={item.begin.length == 0 ? '#999' : '#000'} >{item.begin.length == 0 ? '00:00' : item.begin}</ItemText>
                                        </ButtonInput>
                                    </Action>
                                    <ItemText>às</ItemText>
                                    <Action
                                        width='35%'
                                    >
                                        {/* <ItemText>{date.getHours()}</ItemText> */}
                                        <ButtonInput
                                            onPress={() => {
                                                showTimePicker()
                                                setSelectedField({ arr_sel: 'schedulesP2', index, prop: 'end', prop_date: 'date_end' })
                                                setDate(item.date_end == undefined ? new Date() : new Date(item.date_end))
                                            }}
                                            hitSlop={{ top: normalize(15), bottom: normalize(15), left: normalize(15), right: normalize(15) }}
                                        >
                                            {/* <Input value={date.getHours().toString()} /> */}
                                            <ItemText size={normalize(16)} color={item.end.length == 0 ? '#999' : '#000'} >{item.end.length == 0 ? '00:00' : item.end}</ItemText>
                                        </ButtonInput>
                                    </Action>
                                </DoubleAction>

                                {index > 0 &&
                                <ButtonCopy
                                    onPress={() => handleCopyAboveP2(index)}
                                >
                                    <FontIcon name='long-arrow-alt-up' size={normalize(20)} color='#999' style={{ right: normalize(2) }} />
                                    <FontIcon name='clone' size={normalize(20)} color='#999' style={{ left: normalize(2) }} />
                                </ButtonCopy>}
                            </RightItem>
                            {!selectedDaysP1.includes(index) && <OverlayContainer/>}
                            </>
                        </Item>
                    )
                })}
                <ButtonSave
                    onPress={handleSave}
                    underlayColor='#e5921a'
                >
                    <ButtonText>Salvar</ButtonText>
                </ButtonSave>
            </Scroll>
            {show && (
                <DateTimePicker
                    // isVisible={isDatePickerVisible}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    
                />
            )}
        </Page>
    );
}

Screen.navigationOptions = () => {
    return {
        headerShown: true,
        headerTitle: 'Horários de funcionamento',
        headerTitleAlign: 'center',
    }
}

const mapStateToProps = (state) => {
    return {
        schedulesP1: state.registerReducer.schedulesP1,
        schedulesP2: state.registerReducer.schedulesP2,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSchedulesP1: (schedulesP1) => dispatch({type: 'SET_SCHEDULESP1', payload: {schedulesP1}}),
        setSchedulesP2: (schedulesP2) => dispatch({type: 'SET_SCHEDULESP2', payload: {schedulesP2}}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);