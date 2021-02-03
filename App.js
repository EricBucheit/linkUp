





import React, { useState } from "react";
import { FlatList, SafeAreaView, View, StatusBar, StyleSheet, Text, TouchableOpacity, Linking, Button } from "react-native";

import { NativeRouter, Route, Link } from "react-router-native";

const DATA = [
  {
    id: "1",
    title: "First Item",
  },
  {
    id: "2",
    title: "Second Item",
  },
  {
    id: "3",
    title: "Third Item",
  },
  {
    id: "4",
    title: "First Item",
  },
  {
    id: "5",
    title: "Second Item",
  },
  {
    id: "6",
    title: "Third Item",
  },
  {
    id: "7",
    title: "First Item",
  },
  {
    id: "8",
    title: "Second Item",
  },
  {
    id: "9",
    title: "Third Item",
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
});

export default App;







