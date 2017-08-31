import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';



export default class githubRepo extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      user: 'Milhaus1911',
    }
  }

  render() {
    if(!this.state.loading) {
      return (
        <View>
          <View >
            <TextInput
              style = {styles.search}
              placeholder = "Search users"
              returnKeyType = "search"
              onChangeText = {(text) => {this.setState({user: text});}}
              onEndEditing = {() => {this.setState({loading: true})}}
            />
          </View>
          <View style = {styles.title}>
            <Text style = {{fontSize: 40,}}>{this.state.dataSource[0].owner.login}</Text>
          </View>
          <View style = {styles.container}>
            <FlatList
            data = {this.state.dataSource}
            keyExtractor = {(item, index) => index}
            renderItem = {({item}) => 
              <View style = {styles.list}>
                <Text style = {{textAlign: 'auto',}}>
                  <Text style = {styles.item}>{item.name}</Text>
                  <Text style = {styles.star}> &#9733;: {item.stargazers_count}{'\n'}</Text>
                  <Text style = {styles.item}>{item.description}</Text>
                </Text>
              </View>}
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
      this.setState({
        loading: false,
        dataSource: data,
      });
      })
      .catch((error) => {
        console.error(error);
        this.setState(previousState => {
          return {
            loading: false,
            user: previousState.user,
            dataSource: previousState.dataSource,
          };
        });
      });
      return (
        <View style = {styles.indicator}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({

  search: {
    backgroundColor: 'ghostwhite',
    paddingTop: 15,
    fontSize: 24,
  },
  indicator: {
    flex: 1,
    paddingTop: 50,
    width: 'auto',
  },
  title: {
    backgroundColor: 'lightsteelblue',
    height: 55,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  list: {
    padding: 5,
    borderStyle: 'solid',
    borderBottomWidth: 1,

  },
  container: {
    paddingTop: 0,
    top: 0,
    width: 'auto',
    overflow: 'scroll',
    backgroundColor: 'ghostwhite',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 'auto',
    textAlign: 'left',
  },
  star: {
    fontSize: 18,
    textAlign: 'right',
  }
})

AppRegistry.registerComponent('githubRepo', () => githubRepo);
