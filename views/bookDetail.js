import React, {Component} from 'React'
import {
	StyleSheet,
	View,
	Text,
	Image
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  MessageBar,
  MessageBarManager
} from 'react-native-message-bar';
import moment from 'moment';
import utils from '../common/utils'
import Button from '../components/button'
import Line from '../components/line'

export default class BookDetail extends Component {

	constructor (props) {
    super(props)
    this.state = {
    	detail: {}
    }
    this.goRead = this.goRead.bind(this)
    this.addBookToList = this.addBookToList.bind(this)
    this.id = this.props.navigation.state.params.id
  }

  componentWillMount () {
  	fetch(`http://api.zhuishushenqi.com/book/${this.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => {
      //打印请求结果
      console.log('detail =======>>>>>>>> ', json);
      let cover = decodeURIComponent(json.cover)
      json.cover = cover.indexOf('http') !== 0 ? cover.slice(cover.indexOf('http')) : cover
	    json.latelyFollower = json.latelyFollower > 10000 ? `${(json.latelyFollower / 10000).toFixed(2)}万` : json.latelyFollower
	    json.wordCount = json.wordCount > 10000 ? `${(json.wordCount / 10000).toFixed(2)}万` : json.wordCount
	    let diff = moment().diff(moment(json.updated))
	    json.updateTime = `${utils.formatTime(diff)} 前更新`
	    this.setState({
	    	detail: json
	    })
    })
    .catch((error)=> {
      console.error(error);
    })
    .done()
  }

  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  componentWillUnmount() {
    // Remove the alert located on this master page from the manager
    MessageBarManager.unregisterMessageBar();
  }

  goRead () {
    this.addBookToList()
  	this.props.navigation.navigate('Read', {
      id: this.id
    })
  }

  addBookToList () {
    const {detail} = this.state
    utils.setItem('bookList', detail, this.id)
    MessageBarManager.showAlert({
      message: '添加成功',
      alertType: 'success',
      stylesheetSuccess: { backgroundColor : '#3cd1a2', strokeColor: '#3cd1a2'},
      titleStyle: { color: 'white'},
      messageStyle: { color: 'white'}
    });
  }

	render () {
		const {detail} = this.state
		return (
			<View style={styles.container}>
				<View style={styles.bookTop}>
          <Image
            source={{uri: detail.cover}}
            style={{width: 65, height: 88}}
          />
	        <View style={styles.bookTextItem}>
	          <Text style={styles.bookName}>
	            {detail.title}
	          </Text>
	          <Text style={styles.bookauther}><Text style={styles.highlight}>{detail.author}</Text>  |  {detail.cat}  |  {detail.wordCount}</Text>
	          <Text style={styles.update}>{detail.updateTime}</Text>
	        </View>
	      </View>
	      <View style={styles.row}>
	      	<Button style={styles.btn} type='full' onPress={this.addBookToList}>加入书架</Button>
	      	<Button onPress={this.goRead}>开始阅读</Button>
	      </View>
	      <Line></Line>
	      <View style={styles.quantization}>
	      	<View>
	      		<Text style={styles.quanTitle}>追人气</Text>
	      		<Text style={styles.quanValue}>{detail.latelyFollower}</Text>
	      	</View>
	      	<View>
	      		<Text style={styles.quanTitle}>读者留存率</Text>
	      		<Text style={styles.quanValue}>{detail.retentionRatio}%</Text>
	      	</View>
	      	<View>
	      		<Text style={styles.quanTitle}>日更新字/天</Text>
	      		<Text style={styles.quanValue}>{detail.serializeWordCount}</Text>
	      	</View>
	      </View>
	      <Line></Line>
      	<Text style={styles.des} numberOfLines={3}>
      		{detail.longIntro}
      	</Text>
	      <Line></Line>
	      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15, alignItems: 'center'}}>
	      	<Text style={styles.directory}>目录</Text>
	      	<Text style={styles.newest}>
	      		[{detail.updateTime}]  {detail.lastChapter}
	      	</Text>
	      </View>
	      <Line></Line>
        <MessageBar ref="alert" />
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bookTop: {
    flexDirection: 'row',
    padding: 20,
  },
  bookTextItem: {
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'space-around'
  },
  bookName: {
    fontSize: 16,
    color: '#333'
  },
  bookauther: {
    fontSize: 14,
    color: '#acacac'
  },
  update: {
  	fontSize: 14,
    color: '#acacac'
  },
  highlight: {
    color: '#3cd1a2'
  },
  row: {
  	flexDirection: 'row',
  	justifyContent: 'space-around'
  },
  quantization: {
  	flexDirection: 'row',
  	justifyContent: 'space-around',
  	paddingTop: 10,
  	paddingBottom: 10
  },
  quanTitle: {
  	color: '#999',
  	fontSize: 13,
  	textAlign: 'center'
  },
  quanValue: {
  	color: '#333',
  	fontSize: 16,
  	textAlign: 'center',
  	marginTop: 10
  },
  des: {
  	padding: 10,
  	paddingLeft: 15,
  	paddingRight: 15,
  	lineHeight: 22,
  	color: '#333'
  },
  directory: {
  	color: '#333',
  	fontSize: 14
  },
  newest: {
  	color: '#acacac',
  	fontSize: 12
  }
});