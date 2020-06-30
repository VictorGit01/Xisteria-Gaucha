import React, { useContext, useRef } from 'react'
import { SectionList, Button } from 'react-native'
import styled from 'styled-components/native'

// Src:
import list from '../home_list/drinkList'

// Components:
import ListItem from '../components/HomeTab/ListItemDrinks'
import SectionHeaderDrinks from '../components/HomeTab/SectionHeaderDrinks'

// Contexts:
import toTopContext from '../contexts/ToTopContext'

const Page = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.SectionList`
    flex: 1;
    align-items: center;
`

const Text = styled.Text`
    font-size: 20px;
`

const Screen = (props) => {
    let nav = props.navigation.navigate
    let flatListRef = useRef()

    const toTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }

    return (
        <Page>
            <SectionList
                style={{
                    flex: 1,
                    width: '100%',
                    //paddingHorizontal: 15,
                    //borderTopWidth: .2,
                    //borderTopColor: '#b9f7bf',
                }}
                sections={list}
                renderSectionHeader={({ section: { title } }) => <SectionHeaderDrinks title={title} />}
                renderItem={({item}) => (
                    <ListItem
                        data={item}
                        id={item.id}
                        drink={item.drink}
                        price={item.price}
                        handleNav={() => {
                            nav('InfoSnack', {
                                snack: item.drink,
                                price: item.price,
                            })
                            //toTop()
                        }}

                    />
                )}
                keyExtractor={(item) => item.id}
                ref={flatListRef}
            />
        </Page>
    )
}

Screen.navigationOptions = () => {
    return {
        tabBarLabel: 'Bebidas'
    }
}

export default Screen