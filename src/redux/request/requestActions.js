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

async function query(data) {
    
    
    const fileString = await FileSystem.readAsStringAsync(data)
    console.log(fileString)

    console.log("Data1",data)
    //const data1 = await FileSystem.readAsStringAsync(data)
	const response = await fetch(
		"https://api-inference.huggingface.co/models/siddharth963/vit-base-patch16-224-in21k-finetuned-cassava3",
		{
			headers: {'Accept': 'application/json', 'Authorization': "Bearer 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",'Content-Type': 'image/jpeg' },
			method: "POST",
            body:fileString,
            type: 'image/jpeg'
		}
	);
	const result = await response.json();
	return result;
}


export function fetchResponse(data){
    return(dispatch)=>{
        dispatch(fetchResponseRequest())
        
        
        console.log("function reached",data)
    
        query(data.image).then((response) => {
            console.log(JSON.stringify(response));
            dispatch(fetchResponseSuccess(response.json))
        })

    


      
       
        
    }
}

