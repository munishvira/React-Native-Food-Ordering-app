import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import NumericInput from 'react-native-numeric-input'
import { Card, Icon } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import Dialog, {DialogFooter, DialogButton, DialogTitle, DialogContent } from "react-native-popup-dialog";
import Spinner from 'react-native-loading-spinner-overlay';
import RazorpayCheckout from 'react-native-razorpay';


export default class Cart extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      item:[],
      count:1,
      visible:false,
      spinner: false
    }

    this.database()

  }

  componentDidMount(){
    const { currentUser } = auth();
    firestore().collection('users').doc(currentUser.email).get()
    .then(querysnapshot =>{
      this.setState({name:querysnapshot._data.name})
      this.setState({email:querysnapshot._data.email})
      this.setState({phone:querysnapshot._data.phone})
    })
  }

  changecount(value,id,price){
    const { currentUser } = auth();
    const total = value * price
    firestore().collection('Cart').doc(currentUser.uid).collection('basket').doc(id).update({count:value,totalPrice:total})
    this.setState({item:[]})
    this.setState({sum:[]})
  }

  handleChange(id){
    this.setState({visible:true})
    this.setState({fid: id})
  }

  render(){
    const {item} = this.state

    let dialogbox =
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
            text="Remove"
            onPress={() => {
              const { currentUser } = auth();
              const id = this.state.fid
              firestore().collection('Cart').doc(currentUser.uid).collection('basket').doc(id).delete()
              this.setState({item:[]})
              this.setState({sum:[]})
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
              You want to remove this item to the cart {"\n "}{"\n "}
            </Text>
          </View>
        </DialogContent>
      </Dialog>

    let cart = item.map((item,index) =>
      <Card key={index} containerStyle={{padding: 0}}>
        <View style={styles.subtitleView}>
          <Text style={styles.ratingText}>{item.food.name}</Text>
          <View style={{ flex: 1, padding:10, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            <NumericInput minValue={1} textColor='black' rounded totalWidth={80} rightButtonBackgroundColor='green' 
            totalHeight={30} value={item.count} onChange={ value => this.changecount(value, item.food.id, item.food.price)} />
          </View>
          <Icon type='font-awesome' name='rupee' size={15}/>
          <Text style={{fontSize:15, paddingLeft:5, paddingRight:10}}>{item.totalPrice}</Text>
        </View>
        <View style={{paddingLeft:10}}>
          <Text style={{color:'grey'}}>{item.food.label}</Text>
        </View>
        <View>
          <TouchableOpacity style={{padding:10,flexDirection: "row", justifyContent:'center'}} onPress={() => this.handleChange(item.food.id)}>
            <Text style={{color:'red', paddingRight:5, fontSize:15}}>Remove</Text>
            <Icon type='font-awesome' name='remove' size={20} color='red' />
          </TouchableOpacity>
        </View>
      </Card>
      )

        let total = 
      <TouchableOpacity style={{padding:10, alignItems:'center', backgroundColor:'dodgerblue' }}
      onPress={() => {

        var data = {
          description: 'Credits towards consultation',
          currency: 'INR',
          key: 'rzp_test_yNbbqKcUXFp54a',
          amount: this.state.sum * 100,
          name: this.state.name ,
          prefill:{
            name: this.state.name,
            email: this.state.email,
            contact: this.state.phone
          },
          theme: {color: '#528FF0'}
        }
        RazorpayCheckout.open(data)
        .then((data) => {
          console.log(data)
          // firestore().collection('Bill').doc(uid).collection('order')
          // .add({

          // })
        }).catch((error) => {
          console.log(error)
        });
      }}
      >
        <Text style={{fontSize:25}}>Pay {this.state.sum}</Text>
      </TouchableOpacity>

        let add =
        <TouchableOpacity style={{padding:10, alignItems:'center', backgroundColor:'dodgerblue' }}
        onPress={() => this.props.navigation.navigate('Main',{ screen : 'Home'})}
        >
        <Text style={{fontSize:25}}>Add item to Cart</Text>
      </TouchableOpacity>

    return(
      <>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        <ScrollView>
          {dialogbox}
          {cart}
        </ScrollView>
        <View>
          <TouchableOpacity style={{padding:10, alignItems:'center', backgroundColor:'dodgerblue' }}>
          {item.length > 0 ? total : add}
          </TouchableOpacity>
        </View>
      </>
    )
  }

   async database(){
    const { currentUser } = auth();
    firestore().collection('Cart').doc(currentUser.uid).collection('basket').orderBy('timestamp','asc').onSnapshot(querySnapshot => {
      const item=[]
      const price=[]
      querySnapshot.forEach(doc => {
        item.push(doc.data());
        this.setState({item})   
        price.push(doc.data().totalPrice)
        var sum = price.reduce(function(a, b){
          return a + b;
        }, 0);
        this.setState({sum})
      })
    })   
  }
}

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    alignItems:'center'
  },
  ratingText: {
    paddingLeft: 10,
    fontSize:18
  }
})
