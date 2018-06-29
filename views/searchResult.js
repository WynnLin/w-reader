
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';

class BookItem extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const {data, go} = this.props
    return (
      <TouchableOpacity onPress={() => {
        this.props.go(data._id)
      }}>
        <View style={styles.bookItem}>
          <Image
            source={{uri: data.cover}}
            style={{width: 85, height: 115}}
          />
          <View style={styles.bookTextItem}>
            <Text style={styles.bookName}>
              {
                data.title.split('').map((item, index) => {
                  if (data.highlight.title&&data.highlight.title.indexOf(item) > -1) {
                    return <Text key={`title${index}`} style={styles.highlight}>{item}</Text>
                  }
                  return item
                })
              }
            </Text>
            <Text style={styles.bookauther}>{data.author}  |  {data.cat}</Text>
            <Text style={styles.bookdes} numberOfLines={2}>{data.shortIntro}</Text>
            <Text style={styles.booklabel}><Text style={styles.highlight}>{data.latelyFollower}</Text>人气  |  <Text style={styles.highlight}>{data.retentionRatio}%</Text>留存</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default class SearchResult extends Component {

  constructor (props) {
    super(props)
    this.state = {
      start: 0,
      limit: 20,
      books: []
    }
    this.goBookDetail = this.goBookDetail.bind(this)
  }

  componentWillMount () {
    this.load()
  }

  load () {
    // this.props.navigation.state.params.search
    fetch(`http://api.zhuishushenqi.com/book/fuzzy-search?query=${this.props.navigation.state.params.search}&start=${this.state.start}&limit=${this.state.limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => {
      //打印请求结果
      console.log('search =======>>>>>>>> ', json);
      json.books.map(item => {
        let cover = decodeURIComponent(item.cover)
        if (cover.indexOf('http') !== 0) {
          item.cover = cover.slice(cover.indexOf('http'))
        }
        if (item.latelyFollower > 10000) {
          item.latelyFollower = `${(item.latelyFollower / 10000).toFixed(2)}万`
        }
        return item
      })
      this.setState({
        books: json.books
      })
    })
    .catch((error)=> {
      console.error(error);
    })
    .done()
  }

  goBookDetail (id) {
    this.props.navigation.navigate('BookDetail', {
      id: id
    })
  }

  render () {
    const {books} = this.state
    return (
      <View style={styles.container}>
        <ScrollView>
          {
            books.map((item, index) => {
              return <BookItem key={index} data={item} go={this.goBookDetail}></BookItem>
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
  bookItem: {
    flexDirection: 'row',
    padding: 10,
  },
  bookTextItem: {
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'space-between'
  },
  bookName: {
    fontSize: 16,
    color: '#333'
  },
  bookauther: {
    fontSize: 14,
    color: '#acacac'
  },
  bookdes: {
    fontSize: 14,
    color: '#acacac',
    width: 250,
    lineHeight: 20
  },
  booklabel: {
    fontSize: 12,
    color: '#acacac',
  },
  highlight: {
    color: '#3cd1a2'
  }
});
