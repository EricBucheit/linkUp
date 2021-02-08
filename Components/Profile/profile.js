import React  from "react";
import { View, Text } from "react-native";
import { Link } from "react-router-native";
import ProfilePicture from 'react-native-profile-picture'

const UserProfile = (props) => {
  return (
    <View>
      <ProfilePicture 
        isPicture={false}
        user="Big Homie"
        shape='rounded'
      />
      <Text> Email </Text>

      <Link to="/categories" underlayColor="cyan" style={{backgroundColor: "cyan", height: 50}}>
        <Text>GO TO CATEGORIES</Text>
      </Link>
    </View>
    )
}

export default UserProfile