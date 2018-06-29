import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from 'react-navigation'; // Version can be specified in package.json

import Home from '../views/home'
import Book from '../views/book'

export default createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({navigation}) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <Ionicons name={`ios-home${focused ? '' : '-outline'}`} size={25} color={tintColor} />;
        },
        tabBarLabel: 'Home'
      })
    },
    Book: {
      screen: Book,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return <Ionicons name={`ios-book${focused ? '' : '-outline'}`} size={25} color={tintColor} />;
        }
      }
    }
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#3cd1a2',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 12
      },
      showLabel: true,
      style: {
        backgroundColor: 'white',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: '#e5e5e5',
        shadowOffset: {
          height: 1
        }
      }
    },
    swipeEnabled: true,
    animationEnabled: true
  }
);