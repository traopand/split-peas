import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text , Alert,  Image } from 'react-native';
import GroceryItem from './GroceryItem';

import * as firebase from "firebase";
import { Appbar, Button, TextInput } from 'react-native-paper';
import Logo from "../assets/Logo.png";

export default function GroceryList({ navigation }) {
    let currentUserUID = firebase.auth().currentUser.uid;
    const [firstName, setFirstName] = useState("No one");

    const [groceryItem, setGroceryItem] = useState('');
    // const groupRef = firebase.firestore().collection("group/Rodaxem1mzuhpqAOq25u");
    const ref = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection");

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
              .doc("UMa1GQigE73aEWGC9dUM")
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

        return ref.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { itemName, quantity, addedBy} = doc.data();
                list.push({
                    id: doc.id,
                    itemName,
                    quantity,
                    addedBy,
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
        });
        setGroceryItem('');
    }

    const handleDashboard = () => {
        navigation.replace("Dashboard");
      };

    if (loading) {
        return null; // or a spinner
    }
    return (
        <View style={styles.container}>

            <Button onPress={() => handleDashboard()}>
                <Text>Back</Text>
            </Button>

            <Image style={styles.logo} source={Logo} />

            <Text style={styles.h1}>{groceryItemName}</Text>
            <Text style={styles.shopper}>Shopper: Kathy Cao</Text>
           
           {/* name is currently hardcoded!*/}

            {/* Table headings*/}
            <View style={{ flexDirection: 'row',  justifyContent: 'center'}}>
                <Text style={styles.h2}>Item</Text>
                <Text style={styles.h2}>Quantity</Text>
                <Text style={styles.h2}>Added By</Text>
            </View>
            
            {/* name is currently hardcoded!*/}
            <FlatList
                style={{ flex: 1 }}
                data={groceryList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <GroceryItem {...item} />}
            />
            <TextInput label={'New Item'} value={groceryItem} onChangeText={setGroceryItem} />
           
            <View style={{ flexDirection: 'row', marginHorizontal: -5}}>
                <Button onPress={() => addGroceryItem()} style={styles.button}>
                        <Text style={styles.p}>Add Item +</Text>
                </Button>
                <Button onPress={() => addGroceryItem()} style={styles.button}>
                        <Text style={styles.p}>Claim Items</Text>
                </Button>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#fff',
        // alignItems: 'stretch',
        justifyContent: 'center',
        padding: 30,
    },
    h1: {
        marginBottom: '5%',
        fontSize: 20,
        color: '#5C7F7B',
        fontWeight: 'bold',
    },
    h2: {
        flex: 1,
        marginTop: '10%',
        fontSize: 15,
        color: '#5C7F7B',
        fontWeight: 'bold',
    },
    p:{
        color: '#fff',
    },
    shopper: {
        alignSelf: 'flex-end',
        color: '#5D7E7D',
    },
    button: {
        flex: 1,
        marginTop: '10%',
        marginHorizontal: 5,
        backgroundColor: '#B4B7FF',   
    },
    logo: {
        alignSelf: 'center',
        width: 170,
        height: 215,
        margin: 0,
    },
})