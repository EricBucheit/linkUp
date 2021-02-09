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
  Button,

} from 'react-native';
import { Icon } from 'react-native-elements'
import Animated from 'react-native-reanimated';
import SwipeableItem, { UnderlayParams } from 'react-native-swipeable-item';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Link } from "react-router-native";
import RNUrlPreview from 'react-native-url-preview';
import LinkApi from '../API/links';

const { multiply, sub } = Animated;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

class SwipableLinks extends React.Component {
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
    const updatedData = this.props.currentCategory.links.filter((d) => d.id !== item.id);

    LinkApi.delete(item.id).then(res => {
      console.log(res.data.message)
    })
    // Animate list to close gap when item is deleted
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    
    this.props.currentCategory.links = updatedData;
    let data = this.props.data.slice();
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
        this.setState({currentLink: item});
        this.setShowEditModal(true)
      }}>
        <Text style={styles.text}>Edit</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  renderItem = ({ item, index, drag }: RenderItemParams<Item>) => {
    console.log(item)
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
              <RNUrlPreview drag={drag} descriptionStyle={{color:"white"}} titleStyle={{fontSize:20, color:"black"}} text={`${item.name} , ${item.url}`}/>
            
      
        </View>
      </SwipeableItem>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <DraggableFlatList
          keyExtractor={(item) => { 
            return (`${item.id.toString()}${item.name}`)
          }}
          data={this.props.currentCategory.links}
          renderItem={this.renderItem}
          onDragEnd={({ data }) => {
              let links = [];
              for (let index in data) {
                links.push({order_number: index, id: data[index].id})
              }
              console.log(links)
              LinkApi.updateOrderNumbers(links).then(res => {
                Alert.alert(res.data.message);
              }).catch(err => {
                console.log(err)
              })

              this.props.currentCategory.links = data;
              data = this.props.data.slice();
              // console.log(data)
              this.props.setData(data)
          }}
          activationDistance={20}
        />

         <LinkModal currentCategory={this.props.currentCategory} setModalVisible={this.setModalVisible} modalVisible={this.state.modalVisible} showButton={true}>
          <Input
             title={"New"}
             onSubmit={async (url, name) => {
                let res = await LinkApi.create(this.props.currentCategory.id, name, url)

               this.props.currentCategory.links.push({
                 id: res.data.link.id,
                 name: name,
                 url: url,
               })
               
              let data = this.props.data.slice();
              this.props.setData(data);
              // storeData(data);
              this.setModalVisible(false);
             }}
            />
       </LinkModal>


        <LinkModal currentCategory={this.props.currentCategory} modalVisible={this.state.editModalVisible} setModalVisible={this.setShowEditModal}  showButton={false}>
           <Input
              title={"Edit"}
              onSubmit={(url, name) => {
                  console.log("UPDATING")
                  LinkApi.update(this.props.currentCategory.id, this.state.currentLink.id, name, url).then(res => {
                      console.log(res);
                  })

                  let links = this.props.currentCategory.links;
                  for (let link of links){
                    if (link.id === this.state.currentLink.id) {
                      link.url = url;
                      link.name = name;
                      break ;
                    }
                  }
                  let data = this.props.data.slice();
                  this.props.setData(data);
                  // storeData(data);
                  this.setShowEditModal(false);
              }}
           />
        </LinkModal>
      </SafeAreaView>
    );
  }
}

const LinkModal = ({currentCategory, setModalVisible, modalVisible, children, showButton}) => {
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
          {children}
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


const Input = ({onSubmit, title}) => {
  const [url, setUrl] = React.useState('https://');
  const [name, setName] = React.useState('');
  return (
    <View>
    <Text>{title}</Text>
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
      onPress={() => onSubmit(url, name)}
    >
      <Text style={styles.textStyle}>Add</Text>
    </TouchableHighlight>
    </View>
  );
}



export default SwipableLinks;

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