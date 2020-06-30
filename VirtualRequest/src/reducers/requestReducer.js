const initialState = {
    list_request: [],
    current_requests: [],
    total: 0,
    toTop: false
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'SET_LIST_REQUEST':
            return {...state, list_request: action.payload.list_request}
            break
        case 'SET_CURRENT_REQUESTS':
            return {...state, current_requests: action.payload.current_requests}
            break
        case 'SET_TOTAL':
            return {...state, total: action.payload.total}
            break
        case 'SET_TOTOP':
            return {...state, toTop: action.payload.toTop}
            break
    }

    return state
}