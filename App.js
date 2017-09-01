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
					<View style= {styles.title}>
						<Text style = {styles.titleText}>Failed to connect!</Text>
					</View>
					<View style = {styles.search}>
						<TextInput
							placeholder = "Search users"
							returnKeyType = "search"
							onChangeText = {(text) => {this.setState({user: text})}}
							onEndEditing = {() => {this.setState({loading: true, connected: true,})}}
						/>
					</View>
				</View>
			);
		}
		
		if(!this.state.loading) {
			return (
				<View>
					
					<View style = {styles.title}>
						<Text style = {styles.titleText} > {this.state.dataSource[0].owner.login} </Text>
					</View>
					<View style = {styles.search}>
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
							focusedOpacity = {1}>
								<View style = {styles.list}>
									<Text>
										<Text style = {styles.item}>{item.name}</Text>
										<Text style = {styles.star}> &#9733;: {item.stargazers_count}{'\n'}</Text>
										<Text style = {styles.item}>{item.description}</Text>
									</Text>
								</View>
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
				this.setState(previousState => {
        			return { 
        				dataSource: previousState.dataSource,
        				loading: false, 
        			};
      			});
			}
			finally{
				this.setState(previousState => {
        			return { 
        				dataSource: data,
        				loading: false, 
        			};
      			});
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
			<Text style = {styles.item}>
				<Text>Owner: {params.repo.owner.login}{'\n'}</Text>
				<Text>Name: {params.repo.name}{'\n'}</Text>
				<Text>Stars: {params.repo.stargazers_count}{'\n'}</Text>
				<Text>Language: {params.repo.language}{'\n'}</Text>
				<Text>Forks: {params.repo.forks}{'\n'}</Text>
				<Text>Homepage: {params.repo.homepage}{'\n'}</Text>
				<Text>Description: {params.repo.description}</Text>
			</Text>
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
		minHeight: 55,
		borderBottomWidth: 1,
		paddingTop: 10,
	},
	titleText: {
		fontSize: 40,
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
		fontSize: 18,
		height: 'auto',
	},
	star: {
		fontSize: 18,
		textAlign: 'right',
	},
	search: {
		height: 40,
		borderStyle: 'solid',
		borderBottomWidth: 1,
	},
});

const githubRepo = StackNavigator({
	Home: {screen: HomeScreen},
	Info: {screen: infoScreen},
});

AppRegistry.registerComponent('githubRepo', () => githubRepo);
