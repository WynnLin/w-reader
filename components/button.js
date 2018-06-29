import React, {Component} from 'React';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text
} from 'react-native'

export default class Button extends Component {

	constructor (props) {
		super(props)
		this.boxStyle = this.boxStyle()
		this.textStyle = this.textStyle()
	}

	boxStyle () {
		const {type} = this.props;
		let style = [styles.btn]
		switch (type) {
			case 'full':
				style.push(styles.reverseBg);
				break;
			default:
				break;
		}
		return style
	}

	textStyle () {
		const {type} = this.props;
		let style = [styles.text]
		switch (type) {
			case 'full':
				style.push(styles.reverseColor);
				break;
			default:
				break;
		}
		return style
	}

	render () {
		const {children, type, onPress} = this.props

		return (
			<TouchableOpacity style={this.boxStyle} onPress={onPress}>
				<Text style={this.textStyle} >
					{children}
				</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
  btn: {
  	borderStyle: 'solid',
  	borderWidth: 1,
  	borderColor: '#3cd1a2',
  	borderRadius: 5,
  	padding: 15,
  	paddingLeft: 45,
  	paddingRight: 45
  },
  text: {
  	color: '#3cd1a2'
  },
  reverseBg: {
  	backgroundColor: '#3cd1a2'
  },
  reverseColor: {
  	color: '#fff'
  }
});