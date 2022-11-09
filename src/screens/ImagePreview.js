import React,{useEffect,useState} from 'react';
import {Text,FlatList,View,Image,TouchableOpacity,Alert,BackHandler,Dimensions,Modal,ActivityIndicator} from 'react-native';
import { FontAwesome ,AntDesign} from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {useDispatch,useSelector} from 'react-redux'
import {fetchResponse,fetchResponseFailure,fetchResponseSuccess} from "./../redux/request/requestActions" 

export default function ImagePreview({route,navigation}){
    const {width,height} =Dimensions.get("window")
    const { imageUri,source } = route.params;
    const dispatch = useDispatch()
    const fetchingResponse = useSelector(state=>state.req.fetchingResponse);
    const fetchedResponse = useSelector(state=>state.req.fetchedResponse);
    const fetchError = useSelector(state=>state.req.fetchResponseError);
    const [showResWindow,setShowResWindow] = useState(false);
    
    useEffect(()=>{
        dispatch(fetchResponseSuccess(null))
        dispatch(fetchResponseFailure(null))
        setShowResWindow(false)
    },[navigation])
    useEffect(()=>{
        console.log("Fetching state change",fetchingResponse)
       
    },[fetchingResponse])

    useEffect(()=>{
        console.log("Fetched response",fetchedResponse)
        if(fetchedResponse!=null){
            setShowResWindow(true)
        }
        
        
    },[fetchedResponse])

    useEffect(()=>{
        console.log("Fetched response",fetchError)
    },[fetchError])

    {/*Function to delete image when action other than save is performed on the image */}
    function handleBackButtonClick() {
        if(source==='captured'){
            try{
                FileSystem.deleteAsync(imageUri)
                dispatch(fetchResponseSuccess(null))
                dispatch(fetchResponseFailure(null))
                setShowResWindow(false)
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
    function ItemsListElement({label,probability}){
        
        
   
        return(
            <View style={{width:'98%',flexDirection:'row',backgroundColor:'white',elevation:10,borderRadius:5,marginHorizontal:5}}>
                
                <TouchableOpacity style={{flex:1,flexDirection:'row'}} onPress={()=>{setShowResWindow(false);}}>
                
                <View style={{width:'63%',margin:5}}>
    
                        <Text style={{color:'black',fontSize:15,fontWeight:'400'}}>{label}</Text>                   
                             
                        <Text style={{fontSize:12,color:'red'}}>{probability.toString()}</Text>
          
                </View>
                </TouchableOpacity>                    
            </View> 
        );
        
        }
      

    function ItemsFlatList({vars}){
       
        if(vars!=null){
            var vars = JSON.parse(vars);
            return(<View style={{flex:1}}>
                        <FlatList
                        data={vars}
                        showsVerticalScrollIndicator ={false}
                        renderItem={({item})=>{console.log(item);return <ItemsListElement label={item.label} probability={item.score}/>}}
                        keyExtractor={(item) => {return item.label}}  
                        />
                    </View>   );
        }else{
            return null
        }
        
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={fetchingResponse}
                    >

                  
                    <View style={{borderWidth:1,width:'100%',height:'100%',backgroundColor:'#00000080',alignItems:'center',flexDirection:'row'}}>
                        <View style={{height:70,flexDirection:'row',backgroundColor:"white",width:'95%',justifyContent:'center',marginHorizontal:10}}>
                            <ActivityIndicator size="large" color="orange" style={{alignSelf:'center',justifyContent:'center'}} />
                            <Text style={{marginHorizontal:25,fontSize:20,alignSelf:'center'}}>{"Uploading..."}</Text>
                        </View>    
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showResWindow}>

                  
                    <View style={{borderWidth:1,alignSelf:'center',width:'100%',height:'100%',backgroundColor:'#00000060'}}>
                      
                        <TouchableOpacity  style={{height:80}}></TouchableOpacity>
                          
                            <View style={{width:'90%',height:'75%',backgroundColor:'white',alignSelf:'center'}}>
                                <ItemsFlatList vars = {fetchedResponse}/>                 
                            
                            </View>
                
                        <TouchableOpacity onPress={()=>{setShowResWindow(false)}} style={{height:80}}></TouchableOpacity>
                            
                    </View>
                </Modal>                
           
              
            </View>
    );
}
