import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert } from "react-native";
import Users from '../API/users'


const Logout = (props) => {
  let {setAuth, setData} = props
  return (

    <View>
        <TouchableHighlight
        	style={{

        			height: 50,
        			backgroundColor: "red"
        		}}
            onPress={async () => {
                let res = await Users.logout()
                setData([])
                Alert.alert(res.data.message)
                setAuth(false)
            }}

        >
            <Text>Logout</Text>
        </TouchableHighlight>
      </View>


  )
}

export default Logout
