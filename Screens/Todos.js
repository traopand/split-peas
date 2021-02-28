import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import Todo from './Todo';

import * as firebase from "firebase";
import { Appbar, Button, TextInput } from 'react-native-paper';

export default function Todos() {

    const [todo, setTodo] = useState('');
    // const groupRef = firebase.firestore().collection("group/Rodaxem1mzuhpqAOq25u");
    const ref = firebase.firestore().collection("groceryList/UMa1GQigE73aEWGC9dUM/itemCollection");
    

    // creating reference to grocery list
    // const groceryListRef = firebase.firestore().collection("groceryList").doc("UMa1GQigE73aEWGC9dUM");
    // groceryListRef.get().then((doc) => {
    //     groceryListData = doc.data();
    // })
    // const groceryListData = "";

    const [groceryListName, setGroceryListName] = useState("");

    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
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
              setGroceryListName(dataObj.groceryListName);
            }
          }
          getGroupInfo();

        return ref.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { title, complete } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    complete,
                });
            });

            setTodos(list);

            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    async function addTodo() {
        await ref.add({
            title: todo,
            complete: false,
        });
        setTodo('');
    }

    if (loading) {
        return null; // or a spinner
    }
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{groceryListName}</Text>
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
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Todo {...item} />}
            />
            <TextInput label={'New Item'} value={todo} onChangeText={setTodo} />
           
            <View style={{ flexDirection: 'row', marginHorizontal: -5}}>
                <Button onPress={() => addTodo()} style={styles.button}>
                        <Text style={styles.p}>Add Item +</Text>
                </Button>
                <Button onPress={() => addTodo()} style={styles.button}>
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
        marginVertical: '5%',
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
    }
})