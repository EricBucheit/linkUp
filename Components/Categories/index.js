import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StyleSheet, Text, TouchableHighlight, Modal } from "react-native";
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeout from 'react-native-swipeout';

import { Link } from "react-router-native";

import { Icon } from 'react-native-elements'
// import { Dimensions } from 'react-native';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('linkData', jsonValue)
  } catch (e) {
    // saving error
  }
}

const Category = ({ item, onPress, style, setData, data }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  var swipeoutBtns = [
    {
      text: 'Edit',
      color: "black",
      backgroundColor: "yellow",
      onPress: function() {
        setShowEditModal(true)
      },
    },
    {
      text: 'Delete',
      color: "black",
      backgroundColor: "red",
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
    <Swipeout style={{backgroundColor: "white", borderWidth:1, borderColor: "grey", borderRadius: 10}} right={swipeoutBtns}>
      <View>
         <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={[styles.item, style]}
          onPress={onPress}
        >
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Text style={[styles.title, {justifyContent: "flex-start"}]}>{item.title}</Text>
        </View>
        </Link>
        <AModal modalVisible={showEditModal} setModalVisible={setShowEditModal} showButton={false}>
          <Input 
           setModalVisible={setShowEditModal}
           modalVisible={showEditModal}
           onSubmit={(value) => {
                for (let category of data) {
                  if (category.id === item.id) {
                    category.title = value
                    break ;
                  }
                }

                data = data.slice();
                setData(data);
                storeData(data);
                setShowEditModal(false);
            }}
            
        />
        </AModal>
      </View>
    </Swipeout>
   
  )
}


const Categories = ({setCurrentCategory, data, setData}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const renderItem = ({ item }) => {
    const backgroundColor = "white";
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
      />

      <AModal modalVisible={modalVisible} setModalVisible={setModalVisible} showButton={true}>
         <Input
           setModalVisible={setModalVisible}
           modalVisible={modalVisible}
           onSubmit={(value) => {
              data.push({
                id: `${data.length + 1}`,
                title: value,
                links: [],
              })
              data = data.slice();
              setData(data);
              storeData(data);
              setModalVisible(false);
            }}
        />
      </AModal>
    </SafeAreaView>
  );
};


const AModal = ({modalVisible, setModalVisible, showButton, children}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight
              style={{ ...styles.modalClose}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
            <Text style={styles.modalCloseText}>x</Text>
        </TouchableHighlight>
            
           {children}
          </View>
        </View>
      </Modal>
      <View style={{backgroundColor:"green", borderRadius: 10}}>
        {showButton && 
          <Icon 
            name='add-circle'
            style={{padding: 20}}
            onPress={() => {
              setModalVisible(!modalVisible);
            }} size={40} 
          />
        }
      </View>
      
    </View>
  );
};

const Input = ({onSubmit, setModalVisible, modalVisible}) => {
  const [value, onChangeText] = React.useState('');
  return (
    <View>
    <Text>Category Name</Text>
    <TextInput
      style={{ height: 50, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 20}}
      onChangeText={text => onChangeText(text)}
      value={value}
    />

     <View style={styles.modalButtonWrapper}>
        <TouchableHighlight
            style={{ ...styles.addButton }}
            onPress={() => onSubmit(value)}
        >
            <Text style={styles.textStyle}>Add</Text>
        </TouchableHighlight>
    </View>

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
  
  title: {
    fontSize: 20,
  },
  centeredView: {
    marginBottom: 0,
  },
  modalView: {
    margin: 20,
    marginTop: 150,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingTop:200,
    paddingBottom:200,

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
  modalClose: {
    position: 'absolute',
    right: 15,
    top: 15,
    bottom: 0
  },
  modalCloseText: {
    position: 'absolute',
    right: 15,
    top: 15,
    bottom: 0,
    fontSize: 30,
  },

  modalButtonWrapper: {
    flexDirection: "column",
    justifyContent:'space-between'
  },
  addButton: {
    backgroundColor: "green",
    alignSelf: "flex-end",
    borderRadius: 20,
    padding: 10,
    width: 100,
    elevation: 2
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    width: 100,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default Categories
