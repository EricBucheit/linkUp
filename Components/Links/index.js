import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StatusBar, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Linking, Button, Modal } from "react-native";
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';

import { NativeRouter, Route, Link } from "react-router-native";
import RNUrlPreview from 'react-native-url-preview';

import { Icon } from 'react-native-elements'

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('linkData', jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('linkData')
    console.log(jsonValue)
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch(e) {
    // error reading value
  }
}


const UrlLink = ({ item, onPress, style }) => {
  let [showButton, setShowButton] = React.useState(true);


  const [showEditModal, setShowEditModal] = React.useState(false);
  var swipeoutBtns = [
    // {
    //   text: 'Edit',
    //   onPress: function() {
    //     setShowEditModal(true)
    //   },
    // },
    {
      text: 'Delete',
      onPress: function() {
        for(let category in data) {
          if (data[category].id === item.id) {
            data.splice(category, 1);
            data = data.slice();
            setData(data);
            storeData(data);
          }
        }
      }
    }
  ]
  return (
    <Swipeout right={swipeoutBtns}>
       <View style={{
          borderBottomColor: "#e8e8e8",
          borderBottomWidth: 1,
          marginBottom: 5

        }}>
         <Link
          to="/link"
          
          onPress={onPress}
        >
          <React.Fragment>
            {showButton && <Button color= {"white"} title={item.name} onPress={ ()=>{ Linking.openURL(item.link)}} />}
            <RNUrlPreview descriptionStyle={{color:"white"}} text={`${item.name} , ${item.link}`} onLoad={() => {setShowButton(false)}}/>
          </React.Fragment>
        </Link>
      </View>
    </Swipeout>
    )
};

const Links = ({currentCategory, setData, data}) => {
  const [selectedId, setSelectedId] = useState(null);
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "black" : "black";
    return (
      <UrlLink
        item={item}
        onPress={() => {
          setSelectedId(item.id)
        }}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <Text> Links </Text>
      <FlatList
        data={currentCategory.links}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
      <AddLinkModal setData={setData} data={data} currentCategory={currentCategory}/>
    </SafeAreaView>
  );
};

const AddLinkModal = ({currentCategory, setData, data}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
        currentCategory={currentCategory}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <AddLinkInput setData={setData} data={data} currentCategory={currentCategory} setModalVisible={setModalVisible}/>
              <View style={styles.modalButtonWrapper}>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "black" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>

            </View>
          </View>
        </View>
      </Modal>
        <Icon name='add-circle-outline' 
          onPress={() => {
            setModalVisible(true);
          }} size={40} />
      
    </View>
  );
};


const AddLinkInput = ({setModalVisible, currentCategory, setData, data}) => {
  const [url, setUrl] = React.useState('https://');
  const [name, setName] = React.useState('');
  return (
    <View>
    <Text>Name</Text>
    <TextInput
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => setName(text)}
      value={name}
    />
    <Text>URL</Text>
    <TextInput
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => setUrl(text)}
      value={url}
    />

    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "black" }}
      onPress={() => {
        currentCategory.links.push({
          id: `${currentCategory.links.length + 1}`,
          name: name,
          link: url,
        })
        data = data.slice();
        setData(data);
        storeData(data);
        if (setModalVisible) {
          setModalVisible(false);
        }
      }}
    >
      <Text style={styles.textStyle}>Add</Text>
    </TouchableHighlight>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  header: {
    fontSize: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  },
  title: {
    fontSize: 32,
  },
  centeredView: {
    // justifyContent: "flex-end",
    // alignItems: "center",
    marginBottom: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalButtonWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  openButton: {
    backgroundColor: "black",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Links;