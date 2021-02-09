import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert } from "react-native";
import axios from 'axios'
import { Dimensions } from 'react-native';
import Users from '../API/users'
import CategoryApi from '../API/categories'

const Login = (props) => {
  let {setAuth, setData} = props;
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
            style={{ height: 50, backgroundColor: "lightgreen" }}
            onPress={async () => {
              
              let res = await Users.login(email, password);
              if (res.data.code === 1) {
                let res = await CategoryApi.get().catch(err => console.log(err))
                setData(res.data.categories);
                setAuth(true)
              }
              Alert.alert(res.data.message)
            }}

        >
            <Text>Login</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default Login