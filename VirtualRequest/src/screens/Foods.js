import React, { useState, useEffect, useRef, useContext } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import list from '../home_list/foodList'

// Components:
import ListItem from '../components/HomeTab/ListItemFoods'

// Contexts:
import ToTopContext from '../contexts/ToTopContext'

const Page = styled.SafeAreaView`
    flex: 1;
    width: 100%
    align-items: center;
    background-color: #b9f7bf;
`

const Listing = styled.FlatList`
    flex: 1;
    width: 100%;
`

const Text = styled.Text`
    font-size: 20px
`

const Screen = (props) => {
    const value = useContext(ToTopContext)

    let nav = props.navigation.navigate

    const flatListRef = useRef()

    const toTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }

    console.log(value)

    useEffect(() => {
        toTop()
    }, [])

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
                                nav('InfoSnack', {
                                    snack: item.food,
                                    price: item.price,
                                    stuff: item.stuff,
                                })
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
        tabBarLabel: 'Hambúrgueres'
    }
}

const mapStateToProps = (state) => {
    return {
        toTop: state.requestReducer.toTop
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToTop: (toTop) => dispatch({type: 'SET_TOTOP', payload:{ toTop }})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)