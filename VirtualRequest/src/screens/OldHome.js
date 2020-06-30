import React, { useState, useEffect, useContext } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

// Components:
import PosterArea from '../components/Home/PosterArea'
import ButtonArea from '../components/Home/ButtonArea'
import FoodScreen from '../components/Home/FoodScreen'
import DrinkScreen from '../components/Home/DrinkScreen'
import FooterArea from '../components/Home/FooterArea'

// Contexts:
import ActiveContext from '../contexts/ActiveContext'
// import ToTopContext from '../contexts/ToTopContext'

const Page = styled.SafeAreaView`
    flex: 1;
    background-color: #b9f7bf;
`

const IndicatorArea = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

const Screen = (props) => {
    const [ indicator, setIndicator ] = useState(true)
    // const [ active, setActive ] = useState('foods')
    const [ activeScreen, setActiveScreen ] = useContext(ActiveContext)
    const nav = props.navigation.navigate

    useEffect(() => {
            setTimeout(() => {
                setIndicator(false)
            }, 1500)
    }, [activeScreen])

    // let currentRoute = NavigationService.getCurrentRoute

    useEffect(() => {
        // setIndicator(true)
        // console.log('Iniciou Home')
        
    }, [])
    
    // useEffect(() => {
    //     setIndicator(true)
    // }, [active])


    return (
        <Page>
            {/* <ActiveContext.Provider value={[active, setActive]} > */}
                <PosterArea />
                <ButtonArea />
                <IndicatorArea>
                {indicator ? <ActivityIndicator size='large' color='#077a15' /> :
                <>
                    {activeScreen == 'foods' &&
                    <FoodScreen handleNav={nav} setIndicator={setIndicator} />}
                    {activeScreen == 'drinks' &&
                    <DrinkScreen handleNav={nav} setIndicator={setIndicator} />}
                    <FooterArea handleNav={nav} setIndicator={setIndicator} />
                </>}
                </IndicatorArea>
            {/* </ActiveContext.Provider> */}
        </Page>
    )
}

Screen.navigationOptions = (props) => {
    const nav = props.navigation.navigate
    
    const ButtonIcon = styled.TouchableOpacity`
        height: 100%;
        width: 60px;
        justify-content: center;
        align-items: center;
    `

    const IconTop = styled.Image`
        width: 20px;
        height: 20px;
    `

    return {
        headerTitle: 'Xisteria Gaúcha',
        headerRight: () => (
            <ButtonIcon
                onPress={() => nav('History')}
                activeOpacity={1}
            >
                <IconTop source={require('../assets/icons/history_64px.png')} />
            </ButtonIcon>
        )
    }
}

export default Screen