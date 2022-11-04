
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator,Modal, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome ,MaterialCommunityIcons,MaterialIcons} from '@expo/vector-icons';
//import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

export default function CameraDemo({navigation}){
    const isFocused = useIsFocused()
    const [captured,setCaptured]=useState(false)
    const [hasPermission, setHasPermission] = useState(null);
    const [camera,setCamera]=useState(null);
    const [flashStatus,setFlashStatus]=useState(Camera.Constants.FlashMode.off)
    const [camrollPermission,setCamRollPermission] = useState(null);

  async function askPermission(){
    const { status } = await Camera.requestPermissionsAsync();
    const camrollPermission1=await MediaLibrary.requestPermissionsAsync()
    setCamRollPermission(camrollPermission1.status==='granted')
    setHasPermission(status === 'granted');
  }

  useEffect(() => {
    askPermission()
  }, [navigation]);


 
//function to toggle flash light
function handleFlash(){
    if(flashStatus==Camera.Constants.FlashMode.off){
        setFlashStatus(Camera.Constants.FlashMode.on)
    }else if(flashStatus==Camera.Constants.FlashMode.on){
        setFlashStatus(Camera.Constants.FlashMode.off)
    }
}

  //function to take picture
  const takePicture = async () => {
    if (camera) {
      camera.pausePreview()
      setCaptured(true)
      let photo = await camera.takePictureAsync({skipProcessing:true});
      setCaptured(false)
      navigation.navigate('PhotoPreview',{imageUri:photo.uri,source:'captured'})
  
    }
  }

//function to pick image from gallery
 const  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    navigation.navigate('PhotoPreview',{imageUri:result.uri,source:'gallery'})
    console.log(result);
  }

  
  if (hasPermission === null) {
     Alert.alert("Permission required!");
     askPermission()

    return <View />;
  }
  if (hasPermission === false) {
      console.log('No access to camera')
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {isFocused&& 
        <Camera 
          autoFocus={Camera.Constants.AutoFocus.on}
          useCamera2Api
          flashMode={flashStatus}
          style={styles.camera}        
          ref={ref => {setCamera(ref);}}
        >
      
      
        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>

          {/*Button to pick photo from gallery */}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',                  
            }}>
            <MaterialIcons name="insert-photo" style={{ color: "#fff", fontSize: 40}}/>
          </TouchableOpacity>
          
          {/*Photo capture button */}
          <TouchableOpacity
            onPress={takePicture}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <FontAwesome
                name="camera"
                style={{ color: "#fff", fontSize: 40}}
            />
          </TouchableOpacity>
  
          {/*Flash button */}
          <TouchableOpacity
            onPress={handleFlash}
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <MaterialCommunityIcons
                name={(flashStatus==Camera.Constants.FlashMode.on)?"flash":"flash-off"}
                style={{ color: "#fff", fontSize: 40}}
            />
          </TouchableOpacity>
        </View>
        
      </Camera>}

      {/*The view that shows the image is processing */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={captured}
        >

        {/*View of the modal with less opacity */}
        <View style={{borderWidth:1,width:'100%',height:'100%',backgroundColor:'#00000080',alignItems:'center',flexDirection:'row'}}>
            <View style={{height:70,flexDirection:'row',backgroundColor:"white",width:'95%',justifyContent:'center',marginHorizontal:10}}>
                <ActivityIndicator size="large" color="orange" style={{alignSelf:'center',justifyContent:'center'}} />
                <Text style={{marginHorizontal:25,fontSize:20,alignSelf:'center'}}>Processing Image hold still...</Text>
            </View>    
        </View>
      </Modal>            
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});