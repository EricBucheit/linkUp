import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Linking, Button, Modal } from "react-native";
import { TextInput } from 'react-native';

import { NativeRouter, Route, Link } from "react-router-native";

import { Icon } from 'react-native-elements'



const DATA = [
  {
    id: "1",
    title: "First Item",
  },
];


const LinkData = [
  {
    id: "11",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "12",
    name: "Ericb",
    link: "http://ericbucheit.com",
  },
  {
    id: "13",
    name: "REDDIT",
    link: "http://reddit.com",
  },
  {
    id: "14",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "15",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "16",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "17",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "18",
    name: "Google",
    link: "http://google.com",
  },
  {
    id: "19",
    name: "Google",
    link: "http://google.com",
  },
];



const Home = () => <LinkCategories />;

const About = () => <Links />;

const App = () => (
  <NativeRouter>
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Home</Text>
        </Link>
        <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={styles.navItem}
        >
          <Text>Links</Text>
        </Link>
      </View>
      <Route exact path="/" component={Home} />
      <Route path="/link" component={About} />

    </View>
    <AddCategoryModal />

  </NativeRouter>
);


const LinkItem = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Button title={item.name} onPress={ ()=>{ Linking.openURL(item.link)}} />

  </TouchableOpacity>
);

const Links = () => {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    return (
      <LinkItem
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
        data={LinkData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};




const Item = ({ item, onPress, style }) => (
  
    <Link
      to="/link"
      underlayColor="#f0f4f7"
      style={[styles.item, style]}
    >
      <Text style={styles.title}>{item.title}</Text>
    </Link>


);

const LinkCategories = () => {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";

    return (
      <Item
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
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};




const AddCategoryModal = () => {
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
           <Input setModalVisible={setModalVisible}/>
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


const Input = ({setModalVisible}) => {
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
        DATA.push({
          id: `${DATA.length + 1}`,
          title: value,
        })
        setModalVisible(false);
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

    backgroundColor: "#F194FF",
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

export default App;







