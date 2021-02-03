import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Linking, Button, Modal } from "react-native";
import { TextInput } from 'react-native';

import { NativeRouter, Route, Link } from "react-router-native";

import { Icon } from 'react-native-elements'



const DATA = [
  {
    id: "1",
    title: "First Item",
    links: [
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
    ],
  },
];


const Home = ({currentCategory, setCurrentCategory, data, setData}) => <LinkCategories setData={setData} data={data} setCurrentCategory={setCurrentCategory} />;

const LinkPage = ({currentCategory, setCurrentCategory, data, setData}) => <Links data={data} setData={setData} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory}/>;

const App = () => {

let [currentCategory, setCurrentCategory] = React.useState({})
let [data, setData] = React.useState([]);



return (
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
      <Route exact path="/" component={() => <Home data={data} setData={setData} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} />} />
      <Route path="/link" component={() => <LinkPage data={data} setData={setData} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} />} />

    </View>
  </NativeRouter>

  )
};


const LinkItem = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Button title={item.name} onPress={ ()=>{ Linking.openURL(item.link)}} />
  </TouchableOpacity>
);

const Links = ({currentCategory, setData, data}) => {
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


const AddLinkInput = ({setModalVisible, currentCategory, setData, data}) => {
  const [url, setUrl] = React.useState('');
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
      style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
      onPress={() => {
        //needed
        // parse url for https://
        currentCategory.links.push({
          id: `${currentCategory.links.length + 1}`,
          name: name,
          link: url,
        })
        data = data.slice();
        setData(data);

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

const Item = ({ item, onPress, style }) => (
  
    <Link
      to="/link"
      underlayColor="#f0f4f7"
      style={[styles.item, style]}
      onPress={onPress}
    >
      <Text style={styles.title}>{item.title}</Text>
    </Link>


);

const LinkCategories = ({setCurrentCategory, data, setData}) => {
  const [selectedId, setSelectedId] = useState(null);
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    return (
      <Item
        item={item}
        onPress={() => {
          setCurrentCategory(item)
        }}
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







