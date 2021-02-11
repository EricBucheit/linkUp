import React, { useState } from "react";
import { View, Button, Text, TextInput, TouchableHighlight, Alert, StyleSheet, FlatList, SafeAreaView, Linking } from "react-native";
import axios from 'axios'
import { Dimensions } from 'react-native';
import CategoryApi from '../API/categories'
import Users from '../API/users'
import Links from '../API/links'


import Categories from '../Categories'
import RNUrlPreview from 'react-native-url-preview';
import { List } from 'react-native-paper';
import ProfilePicture from 'react-native-profile-picture'

function Navigation({setSearchOption, setData, search}) {
	return (
		<View style={styles.NavButtonContainer}>
	       <TouchableHighlight
	       		underlayColor='green'
	            style={styles.NavButtons}
	            onPress={async () => {
	            	setSearchOption('users')
	            	setData([])
	            	search('users');
	            }}
	        >
	            <Text>Profiles</Text>
	        </TouchableHighlight>
	       <TouchableHighlight
	       		underlayColor='green'
	            style={styles.NavButtons}
	            onPress={async () => {
	            	setSearchOption('categories')
	            	setData([])
	            	search('categories');

	            }}
	        >
	            <Text>Categories</Text>
	        </TouchableHighlight>
	        <TouchableHighlight
	       		underlayColor='green'
	            style={styles.NavButtons}
	            onPress={async () => {
					setSearchOption('links')
					setData([])
					search('links');
	            }}
	        >
	            <Text>Links</Text>
	        </TouchableHighlight>
	       
    	</View>
    )
}

function LinkResults({data}) {

	if (!data || data.length === 0) return false

	return (
		<FlatList
  			keyExtractor={item => item.id.toString()}
	        data={data}
	        renderItem={RenderUrl}
		/>
	)
}




function RenderUrl({item}) {
	    return (
	      <View
	        style={[
	          { backgroundColor: "#efeff4", height: 125, marginBottom: 15 },
	        ]}>
	            <List.Item
	                title={item.name}
	                description={`${item.url}`}
	                left={props => <List.Icon {...props} icon="folder" />}
	                onPress={ ()=>{ Linking.openURL(item.url)}}
	             />
	      </View>
	    )


	  
}


function CategoryResults({data}) {
	let [currentLinks, setCurrentLinks] = React.useState(false);
	
	React.useEffect(function() {
		setCurrentLinks(false)
	}, [data])
	
	if (!data) {
		return false
	}

	if (data.length > 0 && data[0].links && !currentLinks.length) {
		return <FlatList
	      			style={{flex: 1}}
	      			keyExtractor={item => item.id.toString()}
			        data={data}
			        renderItem={({ item }) => (
			        	<List.Item
						    title={item.name}
						    description={`${item.links.length} links`}
						    left={props => <List.Icon {...props} icon="folder" />}
						    onPress={() => {
						    	if (item.links && item.links.length > 0)
						    	{
					           		setCurrentLinks(item.links)
						    	}
					        }}
						 />

			        )}
			    />
	}

	if (currentLinks.length > 0) {
		return (
			<FlatList
	  			keyExtractor={item => item.id.toString()}
		        data={currentLinks}
		        renderItem={RenderUrl}
			/>
		)
	}

	return false
}


function UserResults({data}) {
	let [currentCategories, setCurrentCategories] = React.useState(false);
	
	React.useEffect(function() {
		setCurrentCategories(false)
	}, [data])
	
	if (!data) return false
	if (data.length > 0 && data[0].categories && !currentCategories.length) {
		return (
				<FlatList
	      			style={{flex: 1}}
	      			keyExtractor={item => item.id.toString()}
			        data={data}
			        renderItem={({ item }) => (
			        	<List.Item
						    title={item.email}
						    description={`${item.categories.length} categories`}
						    left={props => <List.Icon {...props} icon="folder" />}
						    onPress={() => {
						    	if (item.categories && item.categories.length > 0)
						    	{
					           		setCurrentCategories(item.categories)
						    	}
					        }}
						 />

			        )}
			    />
			)
	}

	if (currentCategories.length > 0) {
		return (
			<CategoryResults data={currentCategories} />
		)
	}
	return false


}

function Search() {
	let [text, setText] = React.useState('')
	let [data, setData] = React.useState([]);
	
	let [searchOption, setSearchOption] = React.useState('categories');

	function search(searchOpt) {
		if (!text) {
    		setData([]);
    		return;
    	}
    	if (searchOpt === 'categories') {
         	CategoryApi.find(text).then(res => {
         		setData(res.data.search);
         	})
    	}

    	if (searchOpt === 'users') {
    		Users.search(text).then(res => {
    			setData(res.data.search)
    		})
    	}

    	if (searchOpt === 'links') {
    		Links.search(text).then(res => {
    			setData(res.data.search)
    		})
    	}
	}

	return (
		<View style={{flex: 1}}>
	      <Text>Search</Text>
	      <TextInput
	        style={{ height: 50, width: Dimensions.get('window').width, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
	        onChangeText={text => setText(text)}
	        value={text}
	      />
			<Navigation setSearchOption={setSearchOption} setData={setData} search={search}/>

	        <TouchableHighlight
	            style={{ height: 50, backgroundColor: "lightgreen", alignItems: "center", justifyContent: "center", borderBottomWidth: 2, marginBottom: 10}}
	            onPress={() => {search(searchOption)}}
	        >
	            <Text>Search</Text>
	        </TouchableHighlight>
	      
	        {searchOption === 'categories' &&
	        	<CategoryResults data={data} />
	    	}

	    	 {searchOption === 'users' &&

	        	<UserResults data={data} />
	    	}

	    	{searchOption === 'links' &&
	        	<LinkResults data={data} />
	    	}

		</View>
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

	  NavButtonContainer: {
	    flexDirection: 'row',
	    justifyContent: 'space-between'
	  },
	  NavButtons: {
	    // backgroundColor: 'green',
	    alignItems: "center",
	   	justifyContent: 'center',

	    width: '33%',
	    height: 40
	  }

    });

export default Search