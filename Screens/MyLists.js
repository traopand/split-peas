import React, { useEffect, useState } from "react";
import {Text, StyleSheet, Image, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import BillIcon from "../assets/BillIcon.png";

export default function MyLists({ navigation }){
    const [groceryList, setGroceryList] = useState([]);
    const query = firebase.firestore().collection("groceryList").orderBy('createdAt');

    useEffect(() => {

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
    })

    return (
        <>
        <FlatList
            contentContainerStyle={styles.container}
            data={groceryList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate('GroceryList')
                          }
                    >
                        <Image style={styles.listIcon} source={BillIcon} />
                        <Text style={styles.nameText}>{item.listName}</Text>
                    </TouchableOpacity>
                )
            }}
        />
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
    },
    h1: {
        fontSize: 35,
        color: "#5C7F7B",
        fontWeight: "bold",
        alignSelf: "center",
    },
    nameText: {
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
    button: {
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