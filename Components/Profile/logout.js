import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert } from "react-native";
import axios from 'axios'


const Logout = (props) => {
  let {setAuth} = props
  return (

    <View>
        <TouchableHighlight
        	style={{

        			height: 50,
        			backgroundColor: "red"
        		}}
            onPress={() => {
              axios.post('http://192.168.1.3:8080/users/logout').then(res => {
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

export default Logout
