import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert } from "react-native";
import axios from 'axios'
import { Dimensions } from 'react-native';

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

export default Register
