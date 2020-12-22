const initialState = {
    // name: '',
    // district: '',
    // street: '',
    // number: '',
    // ddd: '',
    // phone: '',
    list_address: [],
    address: {},
    selected: '',
    cityId: '',
    onScreen: false,
}

export default (state = initialState, action) => {
    switch(action.type) {
        // case 'SET_NAME':
        //     return {...state, name: action.payload.name}
        //     break
        // case 'SET_DISTRICT':
        //     return {...state, district: action.payload.district}
        //     break
        // case 'SET_STREET':
        //     return {...state, street: action.payload.street}
        //     break
        // case 'SET_NUMBER':
        //     return {...state, number: action.payload.number}
        //     break
        // case 'SET_DDD':
        //     return {...state, ddd: action.payload.ddd}
        //     break
        // case 'SET_PHONE':
        //     return {...state, phone: action.payload.phone}
        //     break
        case 'SET_LIST_ADDRESS':
            return {...state, list_address: action.payload.list_address}
            break
        case 'SET_ADDRESS':
            return {...state, address: action.payload.address}
            break
        case 'SET_SELECTED':
            return {...state, selected: action.payload.selected}
            break
        case 'SET_CITY_ID':
            return {...state, cityId: action.payload.cityId}
            break
        case 'SET_ON_SCREEN':
            return {...state, onScreen: action.payload.onScreen}
            break
    }

    return state
}