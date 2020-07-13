import React from "react";
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import {Card} from 'react-native-elements'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Dialog, {DialogFooter, DialogButton, DialogTitle, DialogContent } from "react-native-popup-dialog";
import Spinner from 'react-native-loading-spinner-overlay'


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu:[],
      filtermenu:[],
      visible:false,
      food:{},
      spinner:true,
      cuisine:[]
    };
    
  }
  
  componentDidMount(){ 
    const { currentUser } = auth();
    this.setState({ currentUser })
    database().ref('/').on('value', (snapshot) => {
      const menu = snapshot.val()
      const cuisine = [...new Set(menu.map(item => item.cuisine))]
      cuisine.unshift('All')
      this.setState({cuisine: cuisine})
      menu.sort((a,b) =>{
        return parseInt(a.rating) - parseInt(b.rating);
       })
      this.setState({menu: menu})
      this.setState({filtermenu: menu})
      this.setState({spinner:false})
    })
  };

  filterCuisine(c){
    const {menu} = this.state
    if(c == 'All'){
      this.setState({filtermenu:menu})
    }else{
      const data = menu.filter(item => item.cuisine == c)
      this.setState({filtermenu:data})
    }
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.state.cuisine.map((c, i) => 
            <View key={i} style={{margin:15, justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => this.filterCuisine(c)}>
                <Text style={styles.text} >{c}</Text>
              </TouchableOpacity>
            </View>
            )}
          </ScrollView>
        </View>
        <ScrollView>
          <Spinner 
          visible={this.state.spinner}
          />
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
        {this.state.filtermenu.map(item => (
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 52,
    flexDirection: 'row',
    backgroundColor:'grey',
    alignItems: 'center',
    width: '100%',
    paddingLeft:10,
    paddingRight:10
  },
  text:{
    color:'white'
  }
});