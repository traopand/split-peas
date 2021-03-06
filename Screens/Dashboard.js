import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  Switch,
  Image,
  Keyboard,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { Input } from "react-native-elements";
import Logo from "../assets/Logo.png";
import LeftArrow from "../assets/left-arrow.png";
import Rectangle from "../assets/Rectangle.png";
import BillIcon from "../assets/BillIcon.png";
import Member1 from "../assets/Member1.png";
import Member2 from "../assets/Member2.png";
import Member3 from "../assets/Member3.png";
import Member4 from "../assets/Member4.png";
import Member5 from "../assets/Member5.png";
import Member6 from "../assets/Member6.png";
import { TabRouter } from "react-navigation";


export default function Dashboard({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [listMembers, setListMembers] = useState("");
  const [loading, setLoading] = useState(true);

  const [groceryList, setGroceryList] = useState([]);
  const query = firebase.firestore().collection("groceryList").orderBy('createdAt');

  // TUTORIAL GROUP CREATOR //
  const [groupID, setGroupID] = useState("");

  const [listName, setListName] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);

  const listRef = firebase.firestore().collection("groceryList");

  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("usersList")
        .doc(currentUserUID)
        .get();

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
        setGroupID(dataObj.groupID);
      }
    }
    getUserInfo();

    return query.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          const { listName } = doc.data();
          list.push({
              id: doc.id,
              listName,
          });

      });

      setGroceryList(list);
  });

  });

  async function setBillTotal() {
    await firebase
      .firestore()
      .collection("group")
      .where('id', '==', groupID)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const userCollectionRef = firebase.firestore().collection(`group/${groupID}/groceryList`).get();

          userCollectionRef.update({
            oweAmount: totalPrice / doc.numOfUsers,
          })

          setAmountOwed(totalPrice / doc.data().numOfUsers);

          // await userCollectionRef.add({
          //     userId: currentUserUID,
          // });
        });
      })
}


  const gotoHomepage = () => {
    navigation.replace("Homepage");
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  async function addList() {
    await listRef.add({
      listName: listName,
      admin: firstName,
      evenSplit: isEnabled,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()).toDate(),
    });
    setListName("");
    setCreateGroupVisible(!createGroupVisible)
    Keyboard.dismiss();
  }

  return (
    <>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => gotoHomepage()}>
          <Image style={styles.backButtonImg} source={LeftArrow} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Image style={styles.logo} source={Logo} />

        <Text style={styles.h1}>Ravenous Raccoons</Text>
        <Text style={styles.listNameText}>Hi {firstName}</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={createGroupVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!createGroupVisible);
          }}
        >
          <View style={styles.centeredView}>

            {/* The popuup */}
            <View style={styles.modalView}>
              <Input
                inputContainerStyle={{
                  borderBottomColor: "#A4BEAD",
                  borderBottomWidth: 1.5,
                }}
                onChangeText={(listName) => setListName(listName)}
                placeholder="Enter List Name"
                value={listName}
                style={styles.listName}
              />

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.evenSplit}>Even Split Mode</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#B4B7FF" }}
                  thumbColor={isEnabled ? "#E1EFD6" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>

              <Pressable onPress={() => addList()} style={styles.button}>
                <Text style={styles.buttonText}>Add List</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => setCreateGroupVisible(!createGroupVisible)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>

            </View>
          </View>
        </Modal>

        <View style={styles.quickAddContainer}>
          <Image style={styles.rectangle} source={Rectangle} />
          <Text style={styles.quickAddText}>Quick Add</Text>
          <Input
            inputContainerStyle={{
              borderBottomColor: "#C5C5C7",
              paddingHorizontal: 10,
              width: "70%",
              marginLeft: 40,
              marginRight: 40,
            }}
            style={styles.textInput}
          >
            Enter Item
        </Input>
          <Input
            inputContainerStyle={{
              borderBottomColor: "#C5C5C7",
              paddingHorizontal: 10,
              width: "70%",
              marginLeft: 40,
              marginRight: 40,
            }}
            style={styles.textInput}
          >
            Select List
        </Input>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Image style={styles.avatar} source={Member1} />
          <Image style={styles.avatar} source={Member2} />
          <Image style={styles.avatar} source={Member3} />
          <Image style={styles.avatar} source={Member4} />
          <Image style={styles.avatar} source={Member5} />
          <Image style={styles.avatar} source={Member6} />
        </View>

        <View style={{ flexDirection: 'row', paddingTop: 30,}}>
          <Text style={styles.listText}>My Lists</Text>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => setCreateGroupVisible(true)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
        
        <FlatList
            contentContainerStyle={styles.listContainer}
            data={groceryList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        style={styles.listButton}
                        onPress={() =>
                            navigation.navigate('GroceryList', {listName: item.listName, id: item.id} )
                          }
                    >
                        <Image style={styles.listIcon} source={BillIcon} />
                        <Text style={styles.listNameText}>{item.listName}</Text>
                    </TouchableOpacity>
                )
            }}
        />
  

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    alignSelf: "center",
},

  // header peice
  backButtonContainer: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  backButton: {
    backgroundColor: "#fff",
    marginLeft: 30,
    marginTop: 40,
  },

  logo: {
    alignSelf: "center",
    width: 80,
    height: 110,
    marginTop: -50,
  },

  // quick add stuff
  quickAddContainer: {
    backgroundColor: "#E1EFD6",
    width: "70%",
    height: "28%",
    marginTop: -700,
    marginBottom: -10,
    justifyContent: "center",
  },

  textInput: {
    marginTop: -20,
    paddingTop: 10,
    fontSize: 15,
    textAlign: "center",
    color: "#393C35",
  },

  quickAddText: {
    fontSize: 23,
    paddingTop: 7,
    paddingBottom: 19,
    fontWeight: "bold",
    textAlign: "center",
  },

  rectangle: {
    width: "55%",
    height: "14%",
    marginLeft: "22%",
    marginRight: "22%",
    marginTop: -30,
  },

  addButton: {
    backgroundColor: "#B4B7FF",
    marginTop: -10,
    width: 120,
    height: 40,
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  // Text
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#5C7F7B",
    marginTop: -20,
  },

  buttonText: {
    fontSize: 18,
    color: "white",
  },

  nameText: {
    fontSize: 18,
    color: "#5C7F7B",
    paddingBottom: 20,
  },

  listNameText: {
    flex: 11,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000000",
},

  listText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#5C7F7B",
    paddingRight: 20,
  },

  listName: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 30,
    color: "#5D7E7D",
    fontWeight: "bold",
  },

  // containers
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: "#A4BEAD",
    borderWidth: 2,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: "90%",
    height: 400,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  evenSplit: {
    fontSize: 25,
    paddingRight: 10,
    color: "#5D7E7D",
  },

  avatar: {
    width: 50,
    height: 50,
    marginTop: 40,
  },

  // buttons
  button: {
    backgroundColor: "#B4B7FF",
    marginTop: 30,
    width: 150,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    padding: 0,
    color: 'purple',
  },

  plusButton: {
    backgroundColor: "#B4B7FF",
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  // list styles

listNameText: {
    flex: 11,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000000",
},

listIcon:{
    flex: 1,
    marginLeft: 20,
    marginRight: 30,
    width: 10,
    height: 26,
},
listButton: {
    flexDirection: 'row',
    backgroundColor: "#E1EFD6",
    marginTop: 15,
    width: 300,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
},
});
