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
  Button,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { loggingOut } from "../API/firebaseMethods";
import { GiftedChat } from "react-native-gifted-chat";
import { Input } from "react-native-elements";
import Logo from "../assets/Logo.png";
import BillIcon from "../assets/BillIcon.png";
import GroceryIcon from "../assets/groceryIcon.png";
import AddMember from "../assets/AddMember.png";
import Member1 from "../assets/Member1.png";
import Member2 from "../assets/Member2.png";
import Member3 from "../assets/Member3.png";
import Member4 from "../assets/Member4.png";
import Member5 from "../assets/Member5.png";
import Member6 from "../assets/Member6.png";
import Rectangle from "../assets/Rectangle.png";

export default function Dashboard({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [groupName, setGroupName] = useState("Pod Name");
  const [listMembers, setListMembers] = useState("");

  // TUTORIAL GROUP CREATOR //
  const [group, setGroup] = useState("");

  const [listName, setListName] = useState("List Name");
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
      }
    }
    getUserInfo();
  });

  const logout = () => {
    loggingOut();
    navigation.replace("Login");
  };

  const gotoGroceryList = () => {
    navigation.replace("GroceryList");
  };

  const handlePress = () => {
    loggingOut();
    navigation.replace("Login");
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  async function addList() {
    await listRef.add({
      title: listName,
      admin: firstName,
      members: listMembers,
      evenSplit: isEnabled,
    });
    setListName("");
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <Text style={styles.titleText}>Ravenous Raccoons</Text>
      <Text style={styles.nameText}>Hi {firstName}</Text>
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
          <View style={styles.modalView}>
            <Input
              inputContainerStyle={{
                borderBottomColor: "#A4BEAD",
                borderBottomWidth: 1.5,
              }}
              onChangeText={(listName) => setListName(listName)}
              value={listName}
              style={styles.listName}
            ></Input>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.evenSplit}>Even Split Mode </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#B4B7FF" }}
                thumbColor={isEnabled ? "#E1EFD6" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>

            <TouchableOpacity onPress={addList} style={[styles.button]}>
              <Text style={styles.textStyle}>Add List</Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.button]}
              onPress={() => setCreateGroupVisible(!createGroupVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.quickAdd}>
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
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.logout}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCreateGroupVisible(true)}
      >
        <Text style={styles.logout}>Create List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GroceryList")}
      >
        <Text style={styles.logout}>Go to list</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 144,
    height: 172,
  },

  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#5C7F7B",
    marginTop: -30,
    paddingBottom: 10,
  },

  rectangle: {
    width: "55%",
    height: "16%",
    marginLeft: "22%",
    marginRight: "22%",
    marginTop: -80,
    marginBottom: 15,
  },

  nameText: {
    fontSize: 20,
    color: "#5C7F7B",
    paddingBottom: 25,
  },

  quickAdd: {
    backgroundColor: "#E1EFD6",
    width: "70%",
    height: "30%",
    paddingTop: 20,
    justifyContent: "center",
    alignContent: "center",
  },

  quickAddText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  textInput: {
    paddingTop: 10,
    fontSize: 15,
    paddingBottom: 10,
    textAlign: "center",
    color: "#393C35",
  },

  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    backgroundColor: "#B4B7FF",
    marginTop: 30,
    width: 150,
    height: 56,
    borderRadius: 30,
    marginLeft: 70,
    marginRight: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#B4B7FF",
    marginTop: 30,
    width: 150,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

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
    height: "40%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  listName: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 36,
    color: "#5D7E7D",
    fontWeight: "bold",
  },

  evenSplit: {
    fontSize: 25,
    paddingRight: 10,
    color: "#5D7E7D",
  },

  logout: {
    fontSize: 18,
    color: "white",
  },

  evenSplitIcon: {
    width: 30,
    height: 30,
    marginLeft: 20,
  },
});
