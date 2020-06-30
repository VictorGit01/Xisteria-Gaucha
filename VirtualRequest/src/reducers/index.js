import { combineReducers } from 'redux'

// Reducers:
import requestReducer from './requestReducer'
import userReducer from './userReducer'

export default combineReducers({
    requestReducer,
    userReducer,
})