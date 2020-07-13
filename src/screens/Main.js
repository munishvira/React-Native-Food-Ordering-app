import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon,  withBadge} from 'react-native-elements'
import Home from './Home'
import Cart from './Cart'
import Search from './Search'
import Profile from './Profile'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const Tab = createBottomTabNavigator();

export default class Main extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={
      count:null
    }   
    this.database()
  }

  
  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <Icon type='ionicon' name={iconName} size={size} color={color} />;
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
              return <Icon type='ionicon' name={iconName} size={size} color={color} />;
            }else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
              return <Icon type='ionicon' name={iconName} size={size} color={color} />;
            }
            else if (route.name === 'Cart') {
              const BadgedIcon = withBadge(this.state.count)(Icon)
              iconName = focused ? 'cart' : 'cart-outline';
              if (this.state.count === null){
                return <Icon type='ionicon' name={iconName} size={size} color={color} />;
              }else{
              return <BadgedIcon type='ionicon' name={iconName} size={size} color={color} />;
              }
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={Home} options={{title:'Home'}} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Cart" component={Cart}  />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }

  async database(){
    const { currentUser } = auth();
    firestore().collection('Cart').doc(currentUser.uid).collection('basket').onSnapshot(querySnapshot => {
      if(querySnapshot.size === 0){
        this.setState({count: null})
      }else{
        this.setState({count: querySnapshot.size})
      }
    })
  }
}

  