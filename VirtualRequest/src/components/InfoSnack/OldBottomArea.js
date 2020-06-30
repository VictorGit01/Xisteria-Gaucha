import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

const BottomArea = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`
//border-top-width: .5px;

const StuffArea = styled.View`
    height: 80px;
    width: 90%;
    justify-content: center;
    align-items: center;
    border-bottom-width: .5px;
    padding-vertical: 60px;
    
`
//height: 80px
//padding-vertical: 60px;
//height: auto;
//padding-vertical: 10px

const StuffText = styled.Text`
    font-size: ${(props)=>props.fSize ? props.fSize : 20};
    color: ${(props)=>props.color ? props.color : '#000'};
    margin-vertical: 5px;
    text-align: justify;
`

const SideDishButton = styled.TouchableHighlight`
    width: 100%
    justify-content: center;
    align-items: center;
`
//style={{paddingVertical: 30, borderBottomWidth: .5}}
// height: 40px;
// width: 100%;
// justify-content: space-between;
// align-items: center;
// padding-horizontal: 10px;
// padding-vertical: 30px;

const SideDishArea = styled.View`
    height: 40px
    width: 90%
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: .5px;
    padding-vertical: 25px;
    padding-horizontal: 5px
`

const SideDishText = styled.Text`
    font-size: 16px;
    color: #000;
`

const DoubleExtraArea = styled.View`
    height: 65px;
    width: 90%
    flex-direction: row
    justify-content: space-between
    align-items: flex-start;
`
//background-color: #00ff00

const ExtraArea = styled.TouchableHighlight`
    flex: 1
    height: 45px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-horizontal: 10px
    border-radius: 23px
`
//background-color: tomato
//border: .5px solid #ccc

const TextExtraArea = styled.View`
    height: 100%;
    width: 128px
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
//background-color: #ccc

const BoxExtra = styled.View`
    height: 25px;
    width: 25px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.extraActive ? 'transparent' : '#ccc'}
    border: 5px solid ${props => props.extraActive ? '#fe9601' : '#ccc'}
    border-radius: 13px;
    margin-right: 10px;
`

const SelectExtra = styled.View`
    height: 15px;
    width: 15px;
    background-color: ${props => props.extraActive ? 'transparent' : 'transparent'}
    border-radius: 8px;
`

export default (props) => {
    //const [ extraActive, setExtraActive ] = useState(false)
    const [ loadBottom, setLoadBottom ] = useState(false)

    let {
        //active:
        potChipsActive,
        eggActive,
        beefActive,
        onionActive,
        chickenActive,
        baconActive,
        pepperoniActive,
        //setActive:
        setPotChipsActive,
        setEggActive,
        setBeefActive,
        setOnionActive,
        setChickenActive,
        setBaconActive,
        setPepperoniActive,
    } = props

    let mgBetween = 3
    let highlight = 'rgba(0, 0, 0, .03)'

    /*
    useEffect(() => {
        console.log(eggActive)
    }, [eggActive])
    */

    /*
    useEffect(() => {
        setTimeout(() => {
            setLoadBottom(true)
        }, 200)
    }, [])
    */

    return (
        <BottomArea>
            <StuffArea>
                <StuffText style={{fontWeight: 'bold'}} >Ingredientes</StuffText>
                <StuffText fSize={16} >{props.stuff}</StuffText>
            </StuffArea>
            <SideDishButton
                extraActive={potChipsActive}
                onPress={() => setPotChipsActive(potChipsActive ? false : true)}
                underlayColor={highlight}
                activeOpacity={1}
            >
                <SideDishArea>
                    <BoxExtra
                        style={{marginRight: -5}}
                        extraActive={potChipsActive}
                    >
                        <SelectExtra extraActive={potChipsActive} ></SelectExtra>
                    </BoxExtra>
                    <SideDishText>PORÇÃO DE BATATA FRITA</SideDishText>
                    <SideDishText style={{color: '#ff2626'}} >R$ 10,00</SideDishText>
                </SideDishArea>
            </SideDishButton>
            <SideDishText
                style={{
                    marginVertical: 20,
                    color: '#000',
                    fontWeight: 'bold'
                }}
            >ADICIONAIS PARA SANDUÍCHES</SideDishText>

            <DoubleExtraArea>
                <ExtraArea
                    style={{marginRight: mgBetween}}
                    onPress={() => setEggActive(eggActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={eggActive} >
                        <SelectExtra extraActive={eggActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Ovo</SideDishText>
                        <SideDishText style={{color: '#ff2626'}} >R$ 1,00</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>

                <ExtraArea
                    style={{marginLeft: mgBetween}}
                    onPress={() => setBeefActive(beefActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={beefActive} >
                        <SelectExtra extraActive={beefActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Carne</SideDishText>
                        <SideDishText style={{color: '#ff2626'}}>R$ 1,00</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>
            </DoubleExtraArea>

            <DoubleExtraArea>
                <ExtraArea
                    style={{marginRight: mgBetween}}
                    onPress={() => setOnionActive(onionActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={onionActive} >
                        <SelectExtra extraActive={onionActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Cebola</SideDishText>
                        <SideDishText style={{color: '#ff2626'}} >R$ 1,00</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>

                <ExtraArea
                    style={{marginLeft: mgBetween}}
                    onPress={() => setChickenActive(chickenActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={chickenActive} >
                        <SelectExtra extraActive={chickenActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Frango</SideDishText>
                        <SideDishText style={{color: '#ff2626'}} >R$ 1,50</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>
            </DoubleExtraArea>

            <DoubleExtraArea>
                <ExtraArea
                    style={{marginRight: mgBetween}}
                    onPress={() => setBaconActive(baconActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={baconActive} >
                        <SelectExtra extraActive={baconActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Bacon</SideDishText>
                        <SideDishText style={{color: '#ff2626'}} >R$ 2,00</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>

                <ExtraArea
                    style={{marginLeft: mgBetween}}
                    onPress={() => setPepperoniActive(pepperoniActive ? false : true)}
                    underlayColor={highlight}
                >
                    <>
                    <BoxExtra extraActive={pepperoniActive} >
                        <SelectExtra extraActive={pepperoniActive} ></SelectExtra>
                    </BoxExtra>
                    <TextExtraArea>
                        <SideDishText>Calabresa</SideDishText>
                        <SideDishText style={{color: '#ff2626'}} >R$ 2,00</SideDishText>
                    </TextExtraArea>
                    </>
                </ExtraArea>
            </DoubleExtraArea>
        </BottomArea>
)}