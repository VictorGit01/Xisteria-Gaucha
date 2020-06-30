import React, { useState, useEffect, useRef, useContext } from 'react'
import { SectionList, Button } from 'react-native'
import styled from 'styled-components/native'
import list from '../../home_list/drinkList'

// Components:
import SectionHeaderDrinks from './SectionHeaderDrinks'
import ListItem from './ListItemDrinks'

// Contexts:
import ToTopContext from '../../contexts/ToTopContext'

const Page = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    background-color: #b9f7bf;
`

const Screen = (props) => {
    const [ top, setTop ] = useContext(ToTopContext)

    const sectionListRef = useRef()

    const toTop = () => {
        sectionListRef.current.scrollToLocation({
            animated: true,
            itemIndex: 0,
            sectionIndex: 0,
            viewOffset: 0 // Posição do término da rolagem
        })
    }

    useEffect(() => {
        top == true ? (toTop(), setTop()) : null
    }, [top])

    /*
    const moveToSection = (index) => {
        sectionList.scrollToLocation({
            animated: true,
            itemIndex: 0,
            sectionIndex: index,
            viewOffset: 0
        })
    }

    useEffect(() => {
        if (top == true) {
            moveToSection(0)
        }
    }, [top])
    */

    return (
        <Page>
            <SectionList
                ref={sectionListRef}
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
                            props.handleNav('InfoSnack', {
                                snack: item.drink,
                                price: item.price,
                                img: item.img,
                            })
                            //toTop()
                        }}

                    />
                )}
                keyExtractor={(item) => item.id}
                //ref={s => setSectionList(s)}
                //ref={sectionListRef}
            />
        </Page>
    )
}

export default Screen