import React, {Component} from 'React';

import {
	StyleSheet,
	View
} from 'react-native'

export default class Line extends Component {
	render () {
		return (
			<View style={styles.line}></View>
		)
	}
}

const styles = StyleSheet.create({
	line: {
		height: 0.5,
		backgroundColor: '#ebebeb',
		marginTop: 10,
		marginBottom: 10
	}
})