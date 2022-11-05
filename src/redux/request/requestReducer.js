import {
    FETCH_RESPONSE_REQUEST,FETCH_RESPONSE_SUCCESS,FETCH_RESPONSE_FAILURE
} from './requestActionTypes'

const initialState= {
    fetchingrResponse:false,
    fetchedResponse:null,
    fetchResponseError:null,
}

export default function reqReducer(state=initialState,action){
    switch(action.type){
        case FETCH_RESPONSE_REQUEST:
            return{
                ...state,
                fetchingResponse:true
            }
        case FETCH_RESPONSE_SUCCESS:
            return{
                ...state,
                fetchingResponse:false,
                fetchedResponse:action.payload
            }
        case FETCH_RESPONSE_FAILURE:
                return{
                    ...state,
                    fetchingResponse:false,
                    fetchResponseError:action.payload
                }
        
        default:return state
    }
}