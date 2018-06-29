import React, {Component} from 'React';

import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import GiftedListView from 'react-native-gifted-listview'
import utils from '../common/utils'

export default class Read extends Component {

	constructor (props) {
		super(props);
		this.state = {
			sourceList: [],
			chapters: [],
			text: '',
			title: '',
			chapterCount: 0,
			showSetting: false,
			showChapterList: false,
			showSourceList: false
		}
		this.nextChapter = this.nextChapter.bind(this)
		this.showSetting = this.showSetting.bind(this)
		this.showChapterList = this.showChapterList.bind(this)
		this.showSourceList = this.showSourceList.bind(this)
		this.changeChapter = this.changeChapter.bind(this)
		this.changeSource = this.changeSource.bind(this)
		// this.bookId = '5816b415b06d1d32157790b1'
		this.bookId = this.props.navigation.state.params.id
	}

	componentWillMount () {
		// storage.clearMap();
		this.init()
	}

	async init () {
		await this.getbookSource()
		let chapters = await this.getChapters();
		let chapterCount = await utils.getItem('chapterCount', this.id) || 0
		if (chapterCount > chapters.length) {
			chapterCount = chapters.length
		}
		this.setState({
    	chapters: chapters,
    	chapterCount: chapterCount,
    	title: chapters[chapterCount].title,
    	link: chapters[chapterCount].link
    })
		let bookContent = await this.getBookContent(chapters[chapterCount].link, chapterCount)
		this.setState({
     	text: bookContent
   	})
	}

	async getbookSource () {
		if (this.state.sourceList.length) {
			return
		}
		let response = await fetch(`http://api.zhuishushenqi.com/toc?view=summary&book=${this.bookId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
		let data = await response.json();
		let sourceId = data.length > 1 ? data[1]._id : data[0]._id;
    for (let item of data) {
      if (item.source === 'my176') {
        sourceId = item._id;
      }
    }
    this.id = sourceId
    this.setState({
    	sourceList: data
    })
	}

	async getChapters () {
		let chapters = await utils.getItem('chapters', this.id)
		if (chapters) return chapters
		try {
			let response = await fetch(`http://api.zhuishushenqi.com/toc/${this.id}?view=chapters`, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      }})
			let data = await response.json();
			utils.setItem('chapters', data.chapters, this.id)
			console.log('chapters', data.chapters)
	    return data.chapters
		} catch (e) {
			console.log('error', e)
		}
	}

	async getBookContent (link, chapterCount) {
		chapterCount = chapterCount || this.state.chapterCount
		let bookContent = await utils.getItem(`bookContent${this.id}`, chapterCount)
		if (bookContent) return bookContent
		try {
			let chapterResponse = await fetch(`http://chapter2.zhuishushenqi.com/chapter/${encodeURIComponent(link)}?k=2124b73d7e2e1945&t=1468223717`, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      }
	    })
	    let chapter = await chapterResponse.json()
	    let body = chapter.chapter.body
	    utils.setItem(`bookContent${this.id}`, body, chapterCount)
	    return body
		} catch (e) {
			console.log('e', e)
		}
	}

	async nextChapter (next) {
		const {
			chapters,
			chapterCount
		} = this.state;
		let page = chapterCount + next
		let bookContent = await this.getBookContent(chapters[page].link, page)
		if (next > 0) {
			this.getBookContent(chapters[page + 1].link, page + 1)
			this.getBookContent(chapters[page + 2].link, page + 2)
		}
		this.setState({
    	chapterCount: page,
    	title: chapters[page].title,
    	link: chapters[page].link,
    	text: bookContent
    })
    utils.setItem('chapterCount', page, this.id)
    this.scroll.scrollTo({x:0,y: 0,animated:false});
	}

	showSetting () {
		this.setState({
			showSetting: !this.state.showSetting
		})
	}

	showChapterList () {
		console.log('showChapterList')
		this.setState({
			showChapterList: !this.state.showChapterList
		})
	}

	showSourceList () {
		this.setState({
			showSourceList: !this.state.showSourceList
		})
	}

	changeChapter (chapter) {
		console.log('changeChapter', chapter)
		const {chapterCount} = this.state;
		let diff = chapter - chapterCount
		this.nextChapter(diff)
		this.setState({
			showChapterList: false
		})
	}

	changeSource (id) {
		this.id = id
		this.showSourceList()
		this.init()
	}

	render () {
		const {text, title, showSetting, chapters, showChapterList, showSourceList, sourceList} = this.state
		console.log('sourceList', sourceList)
		return (
			<View style={styles.container}>
				<ScrollView style={styles.read} ref={r => this.scroll = r}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.body} onPress={this.showSetting}>{text}</Text>
					<View style={styles.foot}>
						<Text onPress={() => {this.nextChapter(-1)}}>上一章</Text>
						<Text onPress={() => {this.nextChapter(1)}}>下一章</Text>
					</View>
				</ScrollView>
				{
					showSetting ?
					<View style={styles.modalTop}>
						<Text style={styles.source} onPress={this.showSourceList}>换源</Text>
					</View> :
					<View></View>
				}
				{
					showSetting ?
					<View style={styles.modalBottom}>
						<Text style={styles.source} onPress={this.showChapterList}>目录</Text>
					</View>:
					<View></View>
				}
				{
					showChapterList ?
					<TouchableOpacity style={styles.chaptersContainer} onPress={this.showChapterList} activeOpacity={1}>
						<View style={styles.chaptersList}>
							<ScrollView>
								{
									chapters.map((item, index) => {
										return <TouchableOpacity onPress={() => {this.changeChapter(index)}} key={`chaptersTitle${index}`} style={styles.chaptersTitleView}><Text style={styles.chaptersTitle}>{item.title}</Text></TouchableOpacity>
									})
								}
							</ScrollView>
						</View>
					</TouchableOpacity> :
					<View></View>
				}
				{
					showSourceList ?
					<TouchableOpacity style={styles.chaptersContainer} onPress={this.showChapterList} activeOpacity={1}>
						<View style={styles.chaptersList}>
							<ScrollView>
								{
									sourceList.map((item, index) => {
										return (
											<TouchableOpacity onPress={() => {this.changeSource(item._id)}} key={`sourceList${index}`} style={styles.chaptersTitleView}>
												<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
													<Text style={styles.sourceTitle}>{item.name}</Text>
													{
														item._id === this.id ?
														<Text style={styles.sourceNow}>当前书源</Text> :
														null
													}
												</View>
												<Text style={styles.sourceLastChapter}>{item.lastChapter}</Text>
											</TouchableOpacity>
										)
									})
								}
							</ScrollView>
						</View>
					</TouchableOpacity> :
					<View></View>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#eee6dd',
		flex: 1
	},
	source: {
		color: '#a3a3a3',
		fontSize: 16,
		textAlign: 'right'
	},
	modalTop: {
		top: 0,
		position: 'absolute',
		height: 50,
		width: '100%',
		backgroundColor: '#000',
		zIndex: 99,
		justifyContent: 'center',
		paddingBottom: 5,
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 20
	},
	modalBottom: {
		bottom: 0,
		position: 'absolute',
		height: 50,
		width: '100%',
		backgroundColor: '#000',
		zIndex: 99,
		justifyContent: 'center',
		paddingBottom: 5,
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 20
	},
	chaptersContainer: {
		position: 'absolute',
		zIndex: 99,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	chaptersList: {
		backgroundColor: 'white',
		height: 400,
		width: '80%',
		borderRadius: 5,
		marginTop: -30,
		padding: 15
	},
	chaptersTitleView: {
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
		padding: 10
	},
	chaptersTitle: {
		height: 25,
		fontSize: 16,
		lineHeight: 25
	},
	sourceTitle: {
		fontSize: 16,
		color: '#333'
	},
	sourceLastChapter: {
		fontSize: 14,
		color: '#b6b6b6'
	},
	sourceNow: {
		fontSize: 14,
		backgroundColor: '#3cd1a2',
		borderRadius: 5,
		color: '#fff',
		padding: 5
	},
	read: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	title: {
		fontSize: 18,
		color: '#5c5d58',
		paddingTop: 20
	},
	body: {
		fontSize: 16,
		lineHeight: 20,
		color: '#5c5d58',
		paddingBottom: 20,
		marginTop: 10
	},
	foot: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 20
	}
})