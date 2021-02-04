import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StatusBar, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Linking, Button, Modal } from "react-native";
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';

import { NativeRouter, Route, Link } from "react-router-native";
import RNUrlPreview from 'react-native-url-preview';

import { Icon } from 'react-native-elements'
// import {storeData, getData} from './Components/Data';
import Links from './Components/Links'
import Categories from './Components/Categories'

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('linkData', jsonValue)
  } catch (e) {
    // saving error
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

React.useEffect(async () => {
    async function fetchData() {
      setData(await getData());
  }
  fetchData();
}, []);

return (
  <NativeRouter>
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Home</Text>
        </Link>
        <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={styles.navItem}
        >
          <Text>Links</Text>
        </Link>
      </View>
      <Route exact path="/" component={() => <Categories setData={setData} data={data} setCurrentCategory={setCurrentCategory} />} />
      <Route path="/link" component={() => <Links data={data} setData={setData} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory}/>} />

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







