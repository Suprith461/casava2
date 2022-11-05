import { combineReducers } from 'redux'
import reqReducer from './request/requestReducer'
const rootReducer = combineReducers({
    req:reqReducer
})

export default rootReducer;
