import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert } from "react-native";
import { Dimensions } from 'react-native';
import Users from '../API/users'

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
            style={{height: 50, backgroundColor: "lightgreen"}}
            onPress={async () => {
              let res = await Users.register(email, password);
              if (res.data.code === 1) {
                setAuth(true)
              }
              Alert.alert(res.data.message)
            }}
        >
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
      </View>
  )
}

export default Register
