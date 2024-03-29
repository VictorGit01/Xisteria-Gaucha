const initialState = {
    list_request: [],
    current_requests: [],
    order_history: [],
    total: 0,
    toTop: false,
    dlvFee: '',
    mais: false,
    callHistory: false,
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'SET_LIST_REQUEST':
            return {...state, list_request: action.payload.list_request}
            break
        case 'SET_CURRENT_REQUESTS':
            return {...state, current_requests: action.payload.current_requests}
            break
        case 'SET_ORDER_HISTORY':
            return {...state, order_history: action.payload.order_history}
            break
        case 'SET_TOTAL':
            return {...state, total: action.payload.total}
            break
        case 'SET_TOTOP':
            return {...state, toTop: action.payload.toTop}
            break
        case 'SET_DLVFEE':
            return {...state, dlvFee: action.payload.dlvFee}
            break
        case 'SET_CALL_HISTORY':
            return {...state, callHistory: action.payload.callHistory}
            break
    }

    return state
}