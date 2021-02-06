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


const Logout = (props) => {
  let {setAuth} = props
  return (

    <View>
        <TouchableHighlight
            style={{ ...styles.addButton }}
            onPress={() => {
              axios.post('http://192.168.1.3:8080/users/logout').then(res => {
                console.log(res.data.message);
                Alert.alert(res.data.message)
                setAuth(false)
              }).catch(err => console.log(err))
            }}

        >
            <Text>Logout</Text>
        </TouchableHighlight>
      </View>


  )
}

const Register = (props) => {
  let {setAuth} = props
  let [email, setEmail] = React.useState('bucheiteric@gmail.com');
  let [password, setPassword] = React.useState('Testing1212!@');
  let [confirmPassword, setConfirmPassword] = React.useState('Testing1212!@');

  return (
    <View>
      <Text>Register</Text>
      <Text>Email</Text>
      <TextInput
        autoCompleteType='email'
        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        autoCompleteType='password'
        type='password'
        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <Text>Confirm Password</Text>
      <TextInput
        autoCompleteType='password'
        type='password'
        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
      />

      <View>
        <TouchableHighlight
            style={{ ...styles.addButton }}
            onPress={() => {
              axios.post('http://192.168.1.3:8080/users/register', {email: email, password: password}).then(res => {
                if (res.data.code === 1) {
                  setAuth(true)
                }
                Alert.alert(res.data.message)
                console.log(res.data.message);
              }).catch(err => console.log(err))
            }}
        >
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
      </View>
  )
}

const Login = (props) => {
  let {setAuth} = props;
  let [email, setEmail] = React.useState('bucheiteric@gmail.com');
  let [password, setPassword] = React.useState('Testing1212!@');

  return (
    <View>
      <Text>LOGIN</Text>
      <Text>Email</Text>
      <TextInput
        autoCompleteType='email'
        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        autoCompleteType='password'
        type='password'
        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <View>
        <TouchableHighlight
            style={{ ...styles.addButton }}
            onPress={() => {
              console.log(email, password)
              axios.post('http://192.168.1.3:8080/users/login', {email: email, password: password}).then(res => {
                console.log(res.data.message);
                if (res.data.code === 1) {
                  setAuth(true)
                }
                Alert.alert(res.data.message)
              }).catch(err => console.log(err))
            }}

        >
            <Text>Login</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

const UserProfile = (props) => {
  return (
    <View>
      <Link to="/categories" underlayColor="red" style={{color: "red"}}>
        <Text>GO TO CATEGORIES</Text>
      </Link>
    </View>
    )
}

const AuthPage = (props) => {
  let {setAuth, auth} = props;
  let [page, setPage] = React.useState("login");
  return (
    <View>
      {page === "login" && !auth &&
          <View>
             <Button
              onPress={() => setPage("register")}
              title="Click To Register"
              color="#841584"
              accessibilityLabel="Click Here to Register"
            />
            <Login setAuth={setAuth} />
          </View>
        }
      {page === "register" && !auth && 
        <View>
          <Button
            onPress={() => setPage("login")}
            title="Click To Login"
            color="#841584"
            accessibilityLabel="Click Here to Login"
          />
          <Register setAuth={setAuth} />
        </View>
      }
      {auth === true && 
       <UserProfile />
      }
      <Logout setAuth={setAuth} />
    </View>

  )
}

const App = () => {

let [currentCategory, setCurrentCategory] = React.useState({})
let [data, setData] = React.useState([]);
let [auth, setAuth] = React.useState(false);

React.useEffect(async () => {
    async function fetchData() {
      let data = await getData()
      let user = await axios.get('http://192.168.1.3:8080/users/user').catch(err => console.log(err))
      if (user.data.code === 1) setAuth(true);
      setData(data);
      return data
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
      <Route exact path="/" component={() => <AuthPage setAuth={setAuth} auth={auth} />} />
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







