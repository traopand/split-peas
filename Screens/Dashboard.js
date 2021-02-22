import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { loggingOut } from "../API/firebaseMethods";

export default function Dashboard({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("");

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

  const handlePress = () => {
    loggingOut();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
      <Text>Hi {firstName}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
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

  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#B4B7FF",
    marginTop: 70,
    width: 343,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  logout: {
    fontSize: 18,
    color: "white",
  },
});
