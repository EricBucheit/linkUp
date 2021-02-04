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

const Category = ({ item, onPress, style, setData, data }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  var swipeoutBtns = [
    {
      text: 'Edit',
      onPress: function() {
        setShowEditModal(true)
      },
    },
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
      <View>
         <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={[styles.item, style]}
          onPress={onPress}
        >
          <Text style={styles.title}>{item.title}</Text>
        </Link>
        <EditCategoryModal modalVisible={showEditModal} setModalVisible={setShowEditModal} setData={setData} data={data} item={item}/>
      </View>
    </Swipeout>
   
  )
}

const Categories = ({setCurrentCategory, data, setData}) => {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "white" : "white";
    return (
      <Category
        item={item}
        onPress={() => {
          setCurrentCategory(item)
        }}
        data={data}
        setData={setData}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
      
      <AddCategoryModal setData={setData} data={data} setData={setData}/>
    </SafeAreaView>
  );
};

const EditCategoryModal = ({modalVisible, setModalVisible, setData, data, item}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <EditCategoryInput data={data} setData={setData} setModalVisible={setModalVisible} item={item}/>
              <View style={styles.modalButtonWrapper}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
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
    </View>
  );
};


const AddCategoryModal = ({setData, data}) => {
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
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <Input data={data} setData={setData} setModalVisible={setModalVisible}/>
              <View style={styles.modalButtonWrapper}>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
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

const EditCategoryInput = ({setModalVisible, data, setData, item}) => {
  const [value, onChangeText] = React.useState('');
  return (
    <View>
    <TextInput
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />

    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
      onPress={() => {
        for (let category of data) {
          if (category.id === item.id) {
            category.title = value
            break ;
          }
        }

        data = data.slice();
        setData(data);
        storeData(data);
        if (setModalVisible) {
          setModalVisible(false);
        }
      }}
    >
      <Text style={styles.textStyle}>Save</Text>
    </TouchableHighlight>
    </View>
  );
}

const Input = ({setModalVisible, data, setData}) => {
  const [value, onChangeText] = React.useState('');
  return (
    <View>
    <TextInput
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />

    <TouchableHighlight
      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
      onPress={() => {
        
        data.push({
          id: `${data.length + 1}`,
          title: value,
          links: [],
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

export default Categories
