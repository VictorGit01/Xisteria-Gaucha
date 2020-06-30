import React, { createContext, useState, useRef } from 'react'

export default ToTopContext = createContext(false)

/*
const ToTopProvider = (props) => {
    const [ stateTop, setStateTop ] = useState(false)

    return (
        <ToTopContext.Provider value={'Yae'}>
            {props.children}
        </ToTopContext.Provider>
    )
}
*/

//export default ToTopProvider

// ToTopContext.Provider
// ToTopContext.Consumer

/*
import React, { useState, createContext } from 'react'

export const ToTopContext = createContext(null)

export default () => {
    const [ toTop, setToTop ] = useState(false)

    return (
        <ToTopContext.Provider value={toTop} >
            <ToTopContext.Consumer>

            </ToTopContext.Consumer>
        </ToTopContext.Provider>
    )
}
*/