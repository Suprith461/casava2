import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

import ImagePreview from "../screens/ImagePreview"
import CameraDemo from "../screens/Camera"


const CamNavigatorStack = createStackNavigator();
function CamScreen(){
    return(
        <CamNavigatorStack.Navigator>
            <CamNavigatorStack.Screen name = "Camera" component={CameraDemo} options={{headerShown:false}}/>
            <CamNavigatorStack.Screen name = "PhotoPreview" component={ImagePreview} options={{headerStyle:{backgroundColor:'orange'},headerTitle:'Confirm Upload'}}/>       
        </CamNavigatorStack.Navigator>);
  
  }
  
export default CamScreen;