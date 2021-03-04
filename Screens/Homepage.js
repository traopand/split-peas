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

export default function Homepage({ navigation }) {
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

  const temp = () => {

  }

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
      <Text style={styles.titleText}>Split Peas</Text>

{/* Top View */}
      <TouchableOpacity style={styles.button} onPress={temp}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>LogOut</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={temp}>
        <Text style={styles.buttonText}>My Fridge</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={temp} >
        <Text style={styles.buttonText}>Reci-peas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={temp}>
        <Text style={styles.buttonText}>Coupons</Text>
      </TouchableOpacity>


{/* Bottom View */}
      <Text style={styles.buttonText}>My Pods</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard")}>
      <Text style={styles.titleText}>Ravenous Raccoons</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={temp}>
        <Text style={styles.buttonText}>Create new Pod</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={temp}>
        <Text style={styles.buttonText}>Join new Pod</Text>
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

  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#5C7F7B",
    marginTop: -30,
    paddingBottom: 10,
  },

  button: {
    backgroundColor: "#B4B7FF",
    marginTop: 5,
    width: 150,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    color: "white",
  },

  logo: {
    width: 80,
    height: 110,
    marginTop: -90,
  },
  
});
