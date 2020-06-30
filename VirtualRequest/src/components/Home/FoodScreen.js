import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components/native'
import list from '../../home_list/foodList'

// Components:
import ListItem from './ListItemFoods'

// Contexts:
import ToTopContext from '../../contexts/ToTopContext'

const Page = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.FlatList`
    flex: 1;
    width: 100%;
`

const Screen = (props) => {
    const [ top, setTop ] = useContext(ToTopContext)

    const flatListRef = useRef()

    const toTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }

    useEffect(() => {
        if (top == true) {
            toTop()
            setTop(false)
        }
    }, [top])

    return (
        <Page>
            <Listing
                data={list.sort(function(a, b) {
                    if (a.food > b.food) {
                        return 1
                    }
                    if (a.food < b.food) {
                        return -1
                    }
                    // a must be equal to b
                    return 0
                })}
                renderItem={({item}) => (
                    <ListItem
                        id={item.id}
                        food={item.food}
                        price={item.price}
                        stuff={item.stuff}
                        handleNav={() => {
                            props.handleNav('InfoSnack', {
                                snack: item.food,
                                price: item.price,
                                stuff: item.stuff,
                                img: item.img,
                                // potato_chips: item.potato_chips,
                                // extra: item.extra,
                                // egg: item.extra.egg.active,
                                // beef: item.extra.beef.active,
                                // onion: item.extra.onion.active,
                                // chicken: item.extra.chicken.active,
                                // bacon: item.extra.bacon.active,
                                // pepperoni: item.extra.pepperoni.active,
                            })
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
                ref={flatListRef}
                // numColumns={2}
            />
        </Page>
    )
}

export default Screen