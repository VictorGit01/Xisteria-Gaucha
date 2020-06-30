import React, { createContext, useState } from 'react'

export default ActiveContext = createContext('foods')

/*
const ActiveProvider = (props) => {
    const [ active, setActive ] = useState('foods')

    return (
        <ActiveContext.Provider value={active} >
            {props.children}
        </ActiveContext.Provider>
    )
}

export default ActiveProvider
*/