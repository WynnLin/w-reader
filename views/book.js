
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import utils from '../common/utils'


class BookItem extends Component {
  render () {
    const {book, onPress} = this.props
    return (
      <TouchableOpacity style={styles.bookitem} onPress={() => {
        onPress(book._id)
      }}>
        <View style={styles.bookcover}>
          <Image
            source={{uri: book.cover}}
            style={styles.bookcover}
          />
        </View>
        <Text style={styles.bookname}>{book.title}</Text>
      </TouchableOpacity>
    )
  }
}


export default class Book extends Component {

  constructor (props) {
    super(props)
    this.state = {
      books: []
    }
    this.read = this.read.bind(this)
  }

  async componentWillMount () {
    const data = await utils.getItemByKey('bookList')
    this.setState({
      books: data || []
    })
  }

  read (id) {
    console.log('id', id)
    this.props.navigation.navigate('Read', {
      id: id
    })
  }

  render() {
    const {books} = this.state
    return (
      <View style={styles.container}>
        {
          books.map((item, index) => {
            return <BookItem key={`bookitem====${index}`} book={item} onPress={this.read}></BookItem>
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  bookitem: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  bookcover: {
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#e5e5e5',
    shadowOffset: {
      height: 1
    },
    width: 100,
    height: 135
  },
  bookname: {
    textAlign: 'center',
    marginTop: 5
  }
});
