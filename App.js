import React, { useState } from "react";
import { Alert, FlatList, SafeAreaView, View, StatusBar, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Linking, Button, Modal } from "react-native";
import { Dimensions } from 'react-native';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';

import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import RNUrlPreview from 'react-native-url-preview';

import { Icon } from 'react-native-elements'
import Links from './Components/Links'
import Categories from './Components/Categories'
import axios from 'axios'
import Profile from './Components/Profile'

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('linkData', jsonValue)
  } catch (e) {
    // saving error
  }
}

const removeItemValue = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}


const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('linkData')
    console.log(jsonValue)
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch(e) {
    // error reading value
  }
}


const App = () => {

let [currentCategory, setCurrentCategory] = React.useState({})
let [data, setData] = React.useState([]);
let [auth, setAuth] = React.useState(false);

React.useEffect(async () => {
    async function fetchData() {
      await removeItemValue('linkData')
      let data = await getData()

      let user = await axios.get('http://192.168.1.3:8080/users/user').catch(err => console.log(err))
      if (user.data.code === 1) setAuth(true);

      let res = await axios.get('http://192.168.1.3:8080/categories').catch(err => console.log(err))
      setData(res.data.categories);
      console.log(res.data.categories)
  }

  fetchData();
}, []);



return (
  <NativeRouter>
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Profile</Text>
        </Link>
        <Link to="/categories" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Categories</Text>
        </Link>
        <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={styles.navItem}
        >
          <Text>Links</Text>
        </Link>
      </View>
      <Route exact path="/" component={() => <Profile setAuth={setAuth} auth={auth} />} />
      <Route exact path="/categories" component={() => {
          if (!auth) {
            return (<Redirect
              to={{
                pathname: "/",
              }}
            />)
          }
          return (<Categories setData={setData} data={data} setCurrentCategory={setCurrentCategory} />)
        }}
      />
      <Route path="/link" 
        component={() => {
          if (!auth) {
            return (<Redirect
              to={{
                pathname: "/",
              }}
            />)
          }
          return (<Links data={data} setData={setData} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory}/>)
        }} 
      />
    </View>
  </NativeRouter>

  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
    flex: 1,
  },
  
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
});

export default App;







