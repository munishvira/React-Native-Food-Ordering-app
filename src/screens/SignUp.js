import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';


export default class SignUp extends React.Component {

  state = {
    email: '', 
    password: '', 
    errorMessage: null,
    name:'', 
    phone:''
  }

  handleSignUp = () => {
    // TODO: Firebase stuff...
    console.log('handleSignUp')
    if(this.state.name == ''){
      this.setState({errorMessage: 'Enter valid details'})
    }
    else if(this.state.email == ''){
      this.setState({errorMessage: 'Enter valid details'})
    }else  if(this.state.phone == ''){
      this.setState({errorMessage: 'Enter valid details'})
    }else if(this.state.password == ''){
      this.setState({errorMessage: 'Enter valid details'})
    }else{
      auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
      .then( () =>{
        firestore().collection('users').doc(this.state.email).set({
          name: this.state.name,
          email:this.state.email,
          phone:this.state.phone
        })
      })
      .catch(error => {
        this.setState({ errorMessage: error.message })
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{paddingBottom:10}}>Sign Up</Text>
        {this.state.errorMessage &&
        <Text style={{ color: 'red' }}>
          {this.state.errorMessage}
        </Text>}
        <TextInput
        placeholder="Name"
        autoCapitalize="none"
        style={styles.inputStyle}
        onChangeText={name => this.setState({ name })}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.inputStyle}
          onChangeText={email => this.setState({ email })}
        />
         <TextInput
          keyboardType='numeric'
          placeholder="Phone"
          autoCapitalize="none"
          style={styles.inputStyle}
          onChangeText={phone => this.setState({ phone })}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.inputStyle}
          onChangeText={password => this.setState({ password })}
        />
        <Button color="#3740FE"
        title="Sign Up" onPress={this.handleSignUp} 
        /> 
        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
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