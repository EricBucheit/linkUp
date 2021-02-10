import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert, StyleSheet, FlatList, SafeAreaView } from "react-native";
import axios from 'axios'
import { Dimensions } from 'react-native';
import CategoryApi from '../API/categories'
import Categories from '../Categories'
import RNUrlPreview from 'react-native-url-preview';
import { List } from 'react-native-paper';
import ProfilePicture from 'react-native-profile-picture'


function Search() {
	let [text, setText] = React.useState('')
	let [data, setData] = React.useState([]);
	let [currentCategory, setCurrentCategory] = React.useState(false);

	return (
		<View style={{flex: 1}}>
	      <Text>Search</Text>
	      <TextInput
	        autoCompleteType='email'
	        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
	        onChangeText={text => setText(text)}
	        value={text}
	      />

	        <TouchableHighlight
	            style={{ height: 50, backgroundColor: "lightgreen", alignItems: "center", justifyContent: "center", borderBottomWidth: 2, marginBottom: 10}}
	            onPress={async () => {
	             	CategoryApi.find(text).then(res => {
	             		setCurrentCategory(false)
	             		setData(res.data.search);
	             	})
	            }}
	        >
	            <Text>Search</Text>
	        </TouchableHighlight>
	      
	      {!currentCategory &&
	      		<FlatList
	      			style={{flex: 1}}
	      			keyExtractor={item => item.id.toString()}
			        data={data}
			        renderItem={({ item }) => (
			        	<List.Item
						    title={item.name}
						    description={`${item.links.length} links`}
						    left={props => <List.Icon {...props} icon="folder" />}
						    onPress={() => {
					           	setCurrentCategory(item)
					        }}
						 />

			        )}
			    />
	      }
	      	{currentCategory && currentCategory.links &&
	      		<FlatList
	      			keyExtractor={item => item.id.toString()}
			        data={currentCategory.links}
			        renderItem={RenderUrl}
			    />
	      	}


		</View>
	)
}

function RenderUrl({item}) {
	return (
		<RNUrlPreview 
			descriptionStyle={{color:"black"}} 
			titleStyle={{fontSize: 20, color:"black"}} 
			text={`${item.name} , ${item.url}`}
		/>
	)
}

 const styles = StyleSheet.create({
       Button: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        alignItems: "center",
        width: Dimensions.get('window').width - Dimensions.get('window').width * 0.05,
        height: 50,
        elevation: 2
      },
    });

export default Search