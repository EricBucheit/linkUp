import React  from "react";
import { View, Text } from "react-native";
import { Link } from "react-router-native";

const UserProfile = (props) => {
  return (
    <View>
      <Link to="/categories" underlayColor="red" style={{color: "red"}}>
        <Text>GO TO CATEGORIES</Text>
      </Link>
    </View>
    )
}

export default UserProfile