import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CamScreen from "./src/navigation/nav"
import {useEffect} from 'react'
import {Provider} from 'react-redux';
import store from './src/redux/store'


export default function App() {
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <CamScreen/>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

