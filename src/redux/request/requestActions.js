import {
  FETCH_RESPONSE_REQUEST,FETCH_RESPONSE_SUCCESS,FETCH_RESPONSE_FAILURE  } from './requestActionTypes'
import ImageResizer from 'react-native-image-resizer';
import * as FileSystem from 'expo-file-system';
import RNFetchBlob from 'rn-fetch-blob';





export function fetchResponseRequest(data){
    return{
        type:FETCH_RESPONSE_REQUEST,
        payload:data
    }
}
export function fetchResponseSuccess(data){
    return{
        type:FETCH_RESPONSE_SUCCESS,
        payload:data
    }
}
export function fetchResponseFailure(data){
    return{
        type:FETCH_RESPONSE_FAILURE,
        payload:data
    }
}

/*api token
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
*/
    async function query(data){
        let options = { encoding: FileSystem.EncodingType.Base64 };
        const fileString = await FileSystem.readAsStringAsync(data,options)
        
        const res = await RNFetchBlob.fetch('POST', "https://api-inference.huggingface.co/models/siddharth963/vit-base-patch16-224-in21k-finetuned-cassava3", {
        'Authorization': "Bearer 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",
        'Content-Type' : 'application/octet-stream',
        'Accept': 'application/json'
        
        
        },fileString)
       
        return res.text()
    }




export function fetchResponse(data){
    return(dispatch)=>{
        dispatch(fetchResponseRequest())
        try{
            query(data.image).then((response) => {
                //console.log(JSON.stringify(response));
                //console.log("Before dispatch",JSON.stringify(response))
                dispatch(fetchResponseSuccess(response))
            })    
        }catch(err){
            dispatch(fetchResponseFailure(err))
        }
        
    }
}

