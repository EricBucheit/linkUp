import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  TouchableOpacity,
  Platform,
  UIManager,
  Modal,
  TouchableHighlight,
  TextInput,
  SafeAreaView,
  Alert,

} from 'react-native';
import { Icon } from 'react-native-elements'
import axios from 'axios'
import Animated from 'react-native-reanimated';
import SwipeableItem, { UnderlayParams } from 'react-native-swipeable-item';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Link } from "react-router-native";

const { multiply, sub } = Animated;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

class Categories extends React.Component {
  constructor(props) {
    super();
    this.state = {
      modalVisible: false,
      editModalVisible: false,
      currentCategory: false,
    };
  }


  itemRefs = new Map();

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }
  setShowEditModal = (visible) => {
    console.log("SETTING")
    this.setState({editModalVisible: visible});
  }


  deleteItem = (item: Item) => {
    const updatedData = this.props.data.filter((d) => d !== item);
    const deleteItem = this.props.data.filter((d) => d === item);

    console.log(deleteItem)
    axios.delete(`http://192.168.1.3:8080/categories/${deleteItem[0].id}`).then(res => {
      console.log(res.data.message)
    })
    // Animate list to close gap when item is deleted
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.props.setData(updatedData);
  };

  renderUnderlayLeft = ({ item, percentOpen }: UnderlayParams<Item>) => (
    <Animated.View
      style={[styles.row, styles.underlayLeft, { opacity: percentOpen }]} // Fade in on open
    >
      <TouchableOpacity onPressOut={() => this.deleteItem(item)}>
        <Text style={styles.text}>{`Delete`}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  renderUnderlayRight = ({
    item,
    percentOpen,
    open,
    close,
  }: UnderlayParams<Item>) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayRight,
        {
          transform: [{ translateX: multiply(sub(1, percentOpen), -100) }], // Translate from left on open
        },
      ]}>
      <TouchableOpacity onPressOut={close} onPress={() => {
        this.setState({currentCategory: item});
        this.setShowEditModal(true)
      }}>
        <Text style={styles.text}>Edit</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  renderItem = ({ item, index, drag }: RenderItemParams<Item>) => {
    return (
      <SwipeableItem
        key={item.key}
        item={item}
        ref={(ref) => {
          if (ref && !this.itemRefs.get(item.key)) {
            this.itemRefs.set(item.key, ref);
          }
        }}
        onChange={({ open }) => {
          if (open) {
            // Close all other open items
            [...this.itemRefs.entries()].forEach(([key, ref]) => {
              if (key !== item.key && ref) ref.close();
            });
          }
        }}
        overSwipe={20}
        renderUnderlayLeft={this.renderUnderlayLeft}
        renderUnderlayRight={this.renderUnderlayRight}
        snapPointsLeft={[100]}
        snapPointsRight={[100]}>
        <View
          style={[
            styles.row,
            { backgroundColor: "white",borderWidth: 1, borderColor: "black", height: 100 },
          ]}>
          <Link
          to="/link"
          underlayColor="#f0f4f7"
          style={[styles.item]}
          onPress={()=> {this.props.setCurrentCategory(item)}}
          onLongPress={drag}
        >
        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Text style={[styles.title, {justifyContent: "flex-start"}]}>{item.name}</Text>
        </View>
        </Link>
        </View>
      </SwipeableItem>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <DraggableFlatList
          keyExtractor={(item) => item.id.toString()}
          data={this.props.data}
          renderItem={this.renderItem}
          onDragEnd={({ data }) => {
              let categories = [];
              for (let index in data) {
                categories.push({order_number: index, id: data[index].id})
              }
              axios.put('http://192.168.1.3:8080/categories/update/order_numbers', categories).then(res => {
                Alert.alert(res.data.message)
              })
              this.props.setData(data)
          }}
          activationDistance={20}
        />
        <AModal modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} showButton={true}>
         <Input
           setModalVisible={this.setModalVisible}
           modalVisible={this.state.modalVisible}
           onSubmit={(value) => {
              axios.post('http://192.168.1.3:8080/categories', {name: value}).then(res => {
                console.log(res)
              })

              let data = this.props.data.slice();

              data.push({
                id: `${data.length + 1}`,
                name: value,
                links: [],
              })
              data = data.slice();
              this.props.setData(data);
              // this.props.storeData(data);
              this.setModalVisible(false);
            }}
        />
      </AModal>
      <AModal modalVisible={this.state.editModalVisible} setModalVisible={this.setShowEditModal} showButton={false}>
          <Input 
           setModalVisible={this.setShowEditModal}
           modalVisible={this.state.editModalVisible}
           onSubmit={(value) => {
              // needs id from the db, local id is not the same right now
              axios.put(`http://192.168.1.3:8080/categories/${this.state.currentCategory.id}`, {name: value}).then(res => {
                console.log(res)
              })

              let data = this.props.data.slice();
                for (let category of data) {
                  if (category.id === this.state.currentCategory.id) {
                    category.name = value
                    break ;
                  }
                }

                data = data.slice();
                this.props.setData(data);
                // storeData(data);
                this.setShowEditModal(false);
            }}
            
        />
        </AModal>
      </SafeAreaView>
    );
  }
}

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



export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: 'yellow',
    color: "black",
    justifyContent: 'flex-start',
    // borderRadius: 10,
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
    // borderRadius: 10,
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