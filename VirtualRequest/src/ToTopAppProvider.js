import React, { useState } from 'react'
import ToTopContext from './contexts/ToTopContext'

const ToTopAppProvider = (props) => {
const [ toTop, setToTop ] = useState('funcionou!')

    const initialValue = {
        toTop : toTop
    }

    /*
    const toTop = () => {
        //props.flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
        alert('Funcionou')
    }
    */

    return (
        <ToTopContext.Provider value={initialValue} >
            {props.children}
        </ToTopContext.Provider>
    )
}

export default ToTopAppProvider