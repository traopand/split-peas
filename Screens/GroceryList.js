import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text , Alert,  Image } from 'react-native';
import GroceryItem from './GroceryItem';

import * as firebase from "firebase";
import { Appbar, Button, TextInput } from 'react-native-paper';
import Logo from "../assets/Logo.png";

export default function GroceryList({ navigation }) {
    const ref = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection");
    const query = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection").orderBy('createdAt');
    
    let currentUserUID = firebase.auth().currentUser.uid;
    const [firstName, setFirstName] = useState("");
    const [groceryItem, setGroceryItem] = useState('');
    const [groceryItemName, setGroceryItemName] = useState("");
    const [groceryList, setGroceryList] = useState([]);
    const [loading, setLoading] = useState(true);

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

        return query.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { itemName, quantity, addedBy, createdAt} = doc.data();
                const item = doc.data();
                list.push({
                    id: doc.id,
                    itemName,
                    quantity,
                    addedBy,
                    createdAt,
                });
            })

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

            { /* Grocery List Name */}
            <Text style={styles.h1}>{groceryItemName}</Text>
            <Text style={styles.shopper}>Shopper: Kathy Cao</Text>
           {/* Shopper name is currently hardcoded!*/}

            {/* Table headings*/}
            <View style={styles.tableHeadings}>
                <Text style={styles.h2}>Item</Text>
                <Text style={[styles.h2, styles.h2mid]}>Quantity</Text>
                <Text style={[styles.h2, styles.h2right]}>Added By</Text>
            </View>
            
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
        justifyContent: 'center',
        padding: 30,
    },
    h1: {
        marginTop: '7%',
        marginBottom: '10%',
        fontSize: 20,
        color: '#5C7F7B',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    h2: {
        flex: 1,
        marginTop: '6%',
        marginBottom: '3%',
        fontSize: 15,
        color: '#5C7F7B',
        fontWeight: 'bold',
    },
    h2mid: {
        textAlign: 'center',
    },
    h2right: {
        textAlign: 'right',
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
        width: 100,
        height: 90,
        margin: 0,
    },
    tableHeadings:{
        flexDirection: 'row', 
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: 'space-between',
    },
})