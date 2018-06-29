
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import SearchBar from 'react-native-search-bar'

import api from '../common/api'

class Item extends Component {
  constructor (props) {
    super(props)
    this.onPress = this.onPress.bind(this)
    this.onSelect = this.props.onSelect
  }

  onPress () {
    this.onSelect(this.props.children)
  }

  render () {
    return (
      <TouchableHighlight
        onPress={this.onPress}
        activeOpacity={0.1}
        underlayColor="#d3fff0"
      >
        <View style={styles.item}>
          <Text >{this.props.children}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default class Home extends Component {

  constructor (props) {
    super(props)
    this.state = {
      hint: []
    }
    this.search = this.search.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  search (value) {
    fetch(`http://api.zhuishushenqi.com/book/auto-complete?query=${value}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then(response => response.json())
      .then(json => {
        this.setState({
          hint: json.keywords,
          searchValue: value
        })
        //打印请求结果
        console.log('result =======>>>>>>>> ', json);
      })
      .catch((error)=> {
        console.error(error);
      })
      .done()
  }

  onSelect (value) {
    value = value || this.state.searchValue
    this.props.navigation.navigate('Search', {
      search: value
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <SearchBar
            ref='searchBar'
            placeholder='Search'
            cancelButtonText='取消'
            textFieldBackgroundColor='#ebebf7'
            barTintColor='#f7f7f9'
            hideBackground={true}
            tintColor='#3cd1a2'
            textColor='#333'
            onChangeText={this.search}
            onSearchButtonPress={() => {this.onSelect()}}
          ></SearchBar>
        </View>
        <ScrollView>
          {
            this.state.hint.map((item, index) => {
              return <Item onSelect={this.onSelect} key={index}>{item}</Item>
            })
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  search: {
    backgroundColor: '#f7f7f9'
  },
  item: {
    height: 44,
    flex: 1,
    justifyContent: 'center',
    display: 'flex',
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 0.7,
    borderStyle: 'solid',
    paddingLeft: 10
  }
});
