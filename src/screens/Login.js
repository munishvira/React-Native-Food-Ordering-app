import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import auth from '@react-native-firebase/auth';


export default class Login extends React.Component {

  constructor(props){
    super(props)


  }
  
  state = {  
    email: '', 
    password: '', 
    errorMessage: null 
  }

  
  handleLogin = () => {
    console.log('handleLogin')  
    if(this.state.email == ''){
      this.setState({errorMessage: 'Enter valid email and password'})
    }else if(this.state.password == ''){
      this.setState({errorMessage: 'Enter valid email and password'})
    }
    else{
      auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => 
      this.props.navigation.navigate('Main'),
      this.setState({email: ''}),
      this.setState({password: ''}),
      this.setState({ errorMessage: null })
      )
      .catch(error => this.setState({ errorMessage: error.message }));
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{paddingBottom:10}}>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.inputStyle}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" color="#3740FE" onPress={this.handleLogin} />
        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          Don't have account? Click here to signup
        </Text>   
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  }
});