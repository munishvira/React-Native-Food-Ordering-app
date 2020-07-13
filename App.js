import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import SignUp from './src/screens/SignUp'
import Login from './src/screens/Login'
import Main from './src/screens/Main'
import Loading from './src/screens/Loading'
import { YellowBox } from 'react-native';
// import {decode, encode} from 'base-64'


// if (!global.btoa) {  global.btoa = encode }
// if (!global.atob) { global.atob = decode }
// YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Require cycle:']);
YellowBox.ignoreWarnings(['componentWillReceiveProps']);
YellowBox.ignoreWarnings(["Can't perform a React state update "]);
YellowBox.ignoreWarnings(['componentWillMount']);


const Stack = createStackNavigator();
export default class App extends React.Component {
  constructor(props) {
    super(props);

  }
  
  render() {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen name="SignUp" component={SignUp} options={{title:'SignUp', headerLeft: null}} />
          <Stack.Screen name="Login" component={Login} options={{title:'Login', headerLeft: null}}/>
          <Stack.Screen name="Loading" component={Loading} options={{title:null, headerLeft: null}}/>
          <Stack.Screen name="Main" component={Main} options={{title:null, headerLeft: null}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}