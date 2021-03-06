import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Keyboard
} from "react-native";
import GroceryItem from "./GroceryItem";
import { Input } from "react-native-elements";
import * as firebase from "firebase";
import { Button, TextInput } from "react-native-paper";
import Logo from "../assets/Logo.png";
import LeftArrow from "../assets/left-arrow.png";

export default function GroceryList({ navigation, route}) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("Amanda");

  const [groceryItem, setGroceryItem] = useState("");
  // const groupRef = firebase.firestore().collection("group/Rodaxem1mzuhpqAOq25u");
  const ref = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection");
  const query = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection").orderBy('createdAt');

  const [groceryItemName, setGroceryItemName] = useState("");

  const [loading, setLoading] = useState(true);
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("usersList")
        .doc(currentUserUID)
        .get();

        // console.log("THESEARE THE PARAMS", route.params.listName);
        // console.log("THIS is THe ID", route.params.id);

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
      }
    }
    getUserInfo();

    async function getGroupInfo() {
      let doc = await firebase
        .firestore()
        .collection("groceryList")
        .where( "listName", "==", route.params.listName )
        // .doc("UMa1GQigE73aEWGC9dUM")
        .get();
       
      // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
      if (!doc.exists) {
        Alert.alert("No grocery list name found!");
      } else {
        let dataObj = doc.data();
        // console.log(dataObj);
        setGroceryItemName(dataObj.listName);
      }
    }
    getGroupInfo();

    //UPDATE LIST NAME:
    async function updateName() {
      await firebase
        .firestore()
        .collection("groceryList/UMa1GQigE73aEWGC9dUM")
        .doc(id)
        .update({
          groceryListName: groceryItemName,
        });
      // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
    }

    return query.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const { itemName, quantity, addedBy, createdAt } = doc.data();
        list.push({
          id: doc.id,
          itemName,
          quantity,
          addedBy,
          createdAt,
        });
      });

      setGroceryList(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  async function addGroceryItem() {
    await ref.add({
      itemName: groceryItem,
      quantity: 0,
      addedBy: firstName,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()).toDate(),
    });
    setGroceryItem("");
    Keyboard.dismiss();
  }

  //UPDATE LIST NAME:
  async function updateName(groceryItemName) {
    await firebase
      .firestore()
      .collection("groceryList")
      .doc("UMa1GQigE73aEWGC9dUM")
      .update({
        groceryListName: groceryItemName,
      });
  }

  const handleDashboard = () => {
    navigation.replace("Dashboard");
  };

  const gotoClaimItems = () => {
    navigation.replace("GroceryListSplitBill");
  };
  

  if (loading) {
    return null; // or a spinner
  }
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => handleDashboard()}>
          <Image source={LeftArrow} />
      </TouchableOpacity>

      <Image style={styles.logo} source={Logo} />

      <Input
        inputContainerStyle={{
          borderBottomColor: "transparent",
        }}
        onChangeText={updateName}
        style={styles.title}
      >
        <Text style={styles.h1} >{groceryItemName}</Text>
      </Input>

      <TouchableOpacity
        onPress={updateName}
        value={groceryItemName}
      ></TouchableOpacity>

      <Text style={styles.shopperText}>Shopper: Kathy Cao</Text>

      {/* name is currently hardcoded!*/}

      {/* Table headings*/}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={[styles.h2, styles.h2left]}>Item</Text>
        <Text style={styles.h2}>Quantity</Text>
        <Text style={[styles.h2, styles.h2right]}>Added By</Text>
      </View>

      {/* name is currently hardcoded!*/}
      <FlatList
        style={{ flex: 1 }}
        data={groceryList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroceryItem {...item} />}
      />
      <TextInput
        label={"New Item"}
        value={groceryItem}
        onChangeText={setGroceryItem}
      />

      <View style={{ flexDirection: "row", marginHorizontal: -20 }}>

        <Button onPress={() => addGroceryItem()} style={styles.button}>
          <Text style={styles.p}>Add Item +</Text>
        </Button>
        <Button onPress={() => gotoClaimItems()} style={styles.button}>
          <Text style={styles.p}>Claim Items</Text>
        </Button>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 30,
  },
  title:{
    textAlign: "center",
  }, 
  h1: {
    fontSize: 25,
    color: "#5C7F7B",
    fontWeight: "bold",
  },
  h2: {
    flex: 1,
    marginTop: "3%",
    fontSize: 15,
    color: "#5C7F7B",
    fontWeight: "bold",
    textAlign: "center",
  },
  h2left:{
    textAlign: 'left',
  },
  h2right:{
    textAlign: 'right',
  },
  p: {
    color: "#fff",
  },
  shopperText: {
    alignSelf: "flex-end",
    color: "#5D7E7D",
  },

  // buttons
  button: {
    flex: 1,
    marginTop: "10%",
    paddingVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#B4B7FF",
  },
  backButton:{
    marginTop: 20,
    alignSelf: "flex-start",
  },

  // images
  logo: {
    alignSelf: "center",
    width: 80,
    height: 110,
    marginTop: -30,
    marginBottom: -20,
  },
});
