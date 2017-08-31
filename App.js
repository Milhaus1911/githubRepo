import {
	StackNavigator,	
} from 'react-navigation';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';



class HomeScreen extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: true,
			user: 'Milhaus1911',
			connected: true,
		}
	}
	
	static navigationOptions = {
		title: 'GithubRepo',
		header: null,
	};

	render() {
		const {navigate} = this.props.navigation;
		
		if(!this.state.connected){
			return (
				<View>
					<View style = {styles.list}>
						<TextInput
							placeholder = "Search users"
							returnKeyType = "search"
							onChangeText = {(text) => {this.setState({user: text})}}
							onEndEditing = {() => {this.setState({loading: false})}}
						/>
					</View>
					<View>
						<Text>Failed to connect!</Text>
					</View>
				</View>
			);
		}
		
		if(!this.state.loading) {
			return (
				<View>
					
					<View style = {styles.title}>
						<Text style = {{fontSize: 40,}}>{this.state.dataSource[0].owner.login}</Text>
					</View>
					<View>
						<TextInput
							placeholder = "Search users"
							returnKeyType = "search"
							onChangeText = {(text) => {this.setState({user: text})}}
							onEndEditing = {() => {this.setState({loading: true})}}
						/>
					</View>
					<View style = {styles.container}>
						<FlatList
						data = {this.state.dataSource}
						keyExtractor = {(item, index) => index}
						renderItem = {({item}) => (
							<TouchableOpacity
							onPress = {() => navigate('Info', {repo: item})}
						focusedOpacity = {1}
							>
								<Text style = {styles.list}>
									<Text style = {styles.item}>{item.name}</Text>
									<Text style = {styles.star}> &#9733;: {item.stargazers_count}{'\n'}</Text>
									<Text style = {styles.item}>{item.description}</Text>
								</Text>
							</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			);
		}
		else {
			fetch("https://api.github.com/users/".concat(this.state.user, "/repos"))
			.then((response) => response.json())
			.then((data) => {
			console.log(this.state.user);
			console.log(data);
			try {
				if (data[0].owner.login == this.state.user){
					this.setState({
						loading: false,
						dataSource: data,
					});
				}
			}
			catch (error){
				this.setState({loading: false, connected: false,});
			}
			finally {
				this.setState({
					loading: false,
					dataSource: data,
				})
			}
			})
			.catch((error) => {
				this.setState({loading: false, connected: false,});
			});
			return (
				<View style = {styles.indicator}>
					<ActivityIndicator />
				</View>
			);
		}
	}
}

class infoScreen extends Component {
	
	constructor(props){
		super(props);
	}
	
	static navigationOptions = ({navigation}) => ({
		title: 'Repository info',
	});
	
	render(){
		const {params} = this.props.navigation.state;
		return(
			<Text>get info from state {params.repo.name}</Text>
		)
	}
}

const styles = StyleSheet.create({
	indicator: {
		flex: 1,
		paddingTop: 50,
		width: 'auto',
	},
	title: {
		backgroundColor: 'lightblue',
		height: 55,
		borderBottomWidth: 1,
		paddingLeft: 10,
		paddingBottom: 10,
	},
	list: {
		borderStyle: 'solid',
		borderBottomWidth: 1,
	},
	container: {
		paddingTop: 0,
		width: 'auto',
		backgroundColor: 'ghostwhite',
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 'auto',
	},
	star: {
		fontSize: 18,
		textAlign: 'right',
	},
});

const githubRepo = StackNavigator({
	Home: {screen: HomeScreen},
	Info: {screen: infoScreen},
});

AppRegistry.registerComponent('githubRepo', () => githubRepo);
