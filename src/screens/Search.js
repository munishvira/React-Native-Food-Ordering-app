import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, Text } from 'react-native'
import Dialog, {DialogFooter, DialogButton, DialogTitle, DialogContent } from "react-native-popup-dialog";
import database from '@react-native-firebase/database';
import {Card} from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state={
      text:'',
      visible:false,
      food:{},
      dataSource:[],
    }

    this.arrayholder = []
  }
  
  
  componentDidMount(){
    const { currentUser } = auth();
    this.setState({ currentUser })
    database().ref('/').on('value', (snapshot) => {
      this.arrayholder = snapshot.val()
    })
  }

  SearchFilterFunction(text){
     
    const newData = this.arrayholder.filter(function(item){
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    this.setState({
        dataSource : newData,
        text: text
    })
    if(text == ''){
      this.setState({
        dataSource:[],
        text: text
      })
    }
  }

  render() {
    return(
      <>
        <TextInput 
          style={styles.TextInputStyleClass}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search for Food"
        />
        <ScrollView>
          <Dialog visible={this.state.visible}
            onTouchOutside={() => {this.setState({ visible: false })}} 
            children={true} rounded={true}
            hasOverlay={true}
            overlayBackgroundColor='#000'
            dialogTitle={<DialogTitle title="ADD ITEM TO CART" ></DialogTitle>}
            footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                onPress={() => {this.setState({ visible: false })} }
              />
              <DialogButton
                text="ADD"
                onPress={() => {
                  const uid = this.state.currentUser.uid  
                  const fid = this.state.food.id  
                  firestore().collection('Cart').doc(uid).collection('basket').doc(fid)
                  .set({
                    count:1,
                    timestamp:firestore.FieldValue.serverTimestamp(),
                    totalPrice:this.state.food.price, 
                    food:this.state.food
                  }),
                  this.props.navigation.navigate('Main',{ screen : 'Cart'}),
                  this.setState({ visible: false })               
                }} 
              />
            </DialogFooter>
            }
          >
            <DialogContent>
              <View>
                <Text>{"\n"}Are you sure?{"\n"}
                  You want to add this item to the cart {"\n "}{"\n "}
                  Name: {this.state.food.name}{"\n "}
                  Type: {this.state.food.isVegetarian ?('Veg'):('Non-Veg')}{"\n "}
                  Quantity: {this.state.food.label}
                </Text>
              </View>
            </DialogContent>
          </Dialog>
          {this.state.dataSource.map(item => (
            <TouchableOpacity 
            key={item.id}
            onPress={() => {
              this.setState({ visible: true }),
              this.setState({food: item})
            }}
            >
              <Card image={{uri:item.image}}>
                <View
                  style={{
                    padding: 16
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#333"
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#666"
                    }}
                  >
                    {item.cuisine},{" "}
                    {item.isVegetarian ? (
                      <Text style={{ color: "#4caf50", fontWeight: "bold" }}>
                        Veg
                      </Text>
                    ) : (
                      <Text style={{ color: "#a92319", fontWeight: "bold" }}>
                        Non-Veg
                      </Text>
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#999"
                    }}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 21,
                        fontWeight: "bold",
                        color: "#ef6136"
                      }}
                    >
                      Rs.{item.price}
                    </Text>
                  </View>
                </View>
              </Card>   
            </TouchableOpacity> 
          ))}
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({

   TextInputStyleClass:{         
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#009688',
    borderRadius: 7 ,
    backgroundColor : "#FFFFFF"
    }
 });