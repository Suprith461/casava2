import React,{useEffect} from 'react';
import {Text,View,Image,TouchableOpacity,Alert,BackHandler,Dimensions} from 'react-native';
import { FontAwesome ,AntDesign} from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {useDispatch,useSelector} from 'react-redux'
import {fetchResponse} from "./../redux/request/requestActions" 

export default function ImagePreview({route,navigation}){
    const {width,height} =Dimensions.get("window")
    const { imageUri,source } = route.params;
    const dispatch = useDispatch()
    const fetchingResponse = useSelector(state=>state.req.fetchingResponse);
    const fetchedResponse = useSelector(state=>state.req.fetchedResponse);
    const fetchError = useSelector(state=>state.req.fetchResponseError);


    useEffect(()=>{
        console.log("Fetching state change")
    },[fetchingResponse])

    useEffect(()=>{
        console.log("Fetched response",fetchedResponse)
    },[fetchedResponse])

    useEffect(()=>{
        console.log("Fetched response",fetchError)
    },[fetchError])

    {/*Function to delete image when action other than save is performed on the image */}
    function handleBackButtonClick() {
        if(source==='captured'){
            try{
                FileSystem.deleteAsync(imageUri)
            }catch(e){
                console.log(e);
            }
        
        }
        
        console.log('back pressed')
        navigation.goBack();
        return true;
      }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
          
        };
        
      }, [navigation]);

    //function to save image in the gallery
    async function SaveandUpload(){
       
        try {
            const mediaPerm = await MediaLibrary.requestPermissionsAsync()
           
            if(mediaPerm.status=="granted"){

               
                const album = await MediaLibrary.getAlbumAsync('CasavaImages');
             
                const asset = await MediaLibrary.createAssetAsync(imageUri);

                if (album == null) {
                    console.log("album created",asset)
                    const album = await MediaLibrary.createAlbumAsync('CasavaImages', asset, false);
                   
                }else{
                        
                        const nasset =await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                        console.log(asset,nasset)
                        Alert.alert('Image Saved to gallery')
                        dispatch(fetchResponse({image:imageUri}))
                    }
                }else{
                    Alert.alert("Media permission required !","To store image information, permission must be granted")
                }
          } catch (e) {
            console.log(e);
        }
        return;
    }

    


    return(
            <View>
                <Image source={{uri:imageUri}} style={{width:width,height:height-175}} />
                    
                <View style={{flexDirection:'row',marginVertical:10,height:50}}>
                        
                    <TouchableOpacity 
                        style={{flex:0.5,padding:5,borderWidth:0.4}} 
                        onPress={handleBackButtonClick}
                    >
                        <AntDesign name="delete" size={25} color="black" style={{alignSelf:'center'}} />
                        <Text style={{alignSelf:'center'}}>Discard</Text>
                    
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:0.5,padding:5,borderWidth:0.4}} onPress={()=>{SaveandUpload(dispatch)}}>
                        <FontAwesome name="cloud-upload" size={25} color="black" style={{alignSelf:'center'}} />
                        <Text style={{alignSelf:'center'}}>Upload and Continue</Text>
                    </TouchableOpacity>
    
                </View>
              
            </View>
    );
}
