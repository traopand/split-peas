import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, FlatList, View, Text, Alert, Modal, Image, TouchableOpacity, Keyboard, Pressable } from "react-native";
import GroceryItemSplitBill from "./GroceryItemSplitBill";
import { Input } from "react-native-elements";
import * as firebase from "firebase";
import {  } from "react-native-paper";
import Logo from "../assets/Logo.png";
import LeftArrow from "../assets/left-arrow.png";
import Document from "../assets/Document.png";

export default function GroceryListSplitBill({ navigation, route }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [firstName, setFirstName] = useState("Amanda");
  const [tempListName] = useState(route.params.listName);
  const [listID] = useState(route.params.id);

  const [totalPrice, setTotalPrice] = useState(0);
  // const groupRef = firebase.firestore().collection("group/Rodaxem1mzuhpqAOq25u");
  const ref = firebase.firestore().collection( `groceryList/${listID}/itemCollection`);
  const query = firebase.firestore().collection(`groceryList/${listID}/itemCollection`).orderBy('createdAt');

  const [groceryItemName, setGroceryItemName] = useState("");

  const [loading, setLoading] = useState(true);
  const [groceryList, setGroceryList] = useState([]);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [amountOwed, setAmountOwed] = useState(0);
  const [billReady, setBillReady] = useState(false);

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

    async function getGroupInfo() {
      let doc = await firebase
        .firestore()
        .collection("groceryList")
        .doc(route.params.id)
        .get();

      // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
      if (!doc.exists) {
        Alert.alert("No grocery list name found!");
      } else {
        let dataObj = doc.data();
        setGroceryItemName(dataObj.groceryListName);
      }
    }
    getGroupInfo();

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
          parentList: route.params.id,
        });
      });

      setGroceryList(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  async function setBillTotal() {
    await firebase
      .firestore()
      .collection("groceryList")
      .doc(route.params.id)
      .update({
        totalPrice: Number(totalPrice.replace(/[^0-9]/g, '')),
      })
      .then(async function () {
        await firebase
          .firestore()
          .collection("group")
          .where('code', '==', "oOmqvO")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              const userCollectionRef = firebase.firestore().collection('groceryList').doc(route.params.id)

              userCollectionRef.update({
                oweAmount: totalPrice / doc.numOfUsers,
              })

              setAmountOwed(totalPrice / doc.data().numOfUsers);

              // await userCollectionRef.add({
              //     userId: currentUserUID,
              // });
            });
          })
      });
    Keyboard.dismiss()
    // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
  }

  const payNow = () => {
    navigation.replace("GroceryList", {listName: tempListName, id: route.params.id});
  };

  //UPDATE LIST NAME:
  async function updateName(groceryItemName) {
    await firebase
      .firestore()
      .collection("groceryList")
      .doc(route.params.id)
      .update({
        groceryListName: groceryItemName,
      });
  }

  const handleDashboard = () => {
    navigation.replace("GroceryList", {listName: tempListName, id: route.params.id});
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
        <Text style={styles.h1} >{route.params.listName}</Text>
      </Input>

      <TouchableOpacity
        onPress={updateName}
        value={groceryItemName}
      ></TouchableOpacity>

      <Text style={styles.shopperText}>Even Split</Text>
      <Text style={styles.shopperText}>Shopper: Kathy Cao</Text>

      {/* name is currently hardcoded!*/}

      {/* Table headings*/}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={[styles.h2, styles.h2left]}>Item</Text>
        <Text style={styles.h2}>Quantity</Text>
        <Text style={[styles.h2, styles.h2right]}>Claim</Text>
      </View>

      {/* name is currently hardcoded!*/}
      <FlatList
        style={{ flex: 1 }}
        data={groceryList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroceryItemSplitBill {...item} />}
      />



      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={() => setCreateGroupVisible(true)}>
          <Image source={Document} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCreateGroupVisible(true)} style={styles.button}>
          <Text style={styles.p}>Split Bill</Text>
        </TouchableOpacity>
      </View>


      {/* Modal Starts */}
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

            {billReady ?
              <>
                <Text style={styles.modalText}>You Owe Zoey Wei ${amountOwed}</Text>

                <Pressable onPress={() => payNow()} style={styles.modalButton}>
                  <Text style={styles.buttonText}>Pay Now</Text>
                </Pressable>

                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setCreateGroupVisible(!createGroupVisible);
                    setBillTotal();
                    setBillReady(true);
                  }}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
                </>

                :
                <>
                  <Text style={styles.modalText}>Input Bill Total</Text>
                  
                  <TextInput
                    label={"Total Bill"}
                    placeholder="$"
                    keyboardType='numeric'
                    value={totalPrice.toString()}
                    style={styles.input}
                    onChangeText={setTotalPrice}
                    
                />
                 <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setCreateGroupVisible(!createGroupVisible);
                    setBillTotal();
                    setBillReady(true);
                  }}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>
              
                </>
                }
                

          </View>
        </View>
      </Modal>

      {/* Modal Ends */}


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
  title: {
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
  h2left: {
    textAlign: 'left',
  },
  h2right: {
    textAlign: 'right',
  },
  p: {
    color: "#fff",
  },
  shopperText: {
    alignSelf: "flex-end",
    color: "#5D7E7D",
  },

  input:{
    backgroundColor: '#e7e7e7',
    width: 200,
    height: 60,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 4,
    borderBottomColor: "#969696",
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // buttons
  button: {
    backgroundColor: "#B4B7FF",
    width: 160,
    marginLeft: 30,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
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


  // modal styles
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
    height: 300,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalButton: {
    backgroundColor: "#B4B7FF",
    marginVertical: 10,
    width: 150,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },

  modalText: {
    fontSize: 23,
    textAlign: "center",
    color: "#5C7F7B",
    marginBottom: 25,
    fontWeight: "bold",
  },

});
