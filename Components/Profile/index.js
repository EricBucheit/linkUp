import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import axios from 'axios'

import Login from './login'
import Register from './register'
import Logout from './logout'
import UserProfile from './profile'


const Profile = (props) => {
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

export default Profile