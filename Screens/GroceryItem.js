import React from 'react';
import * as firebase from "firebase";
import { List } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

function GroceryItem({ id, itemName, quantity, addedBy}) {
  

  async function updateInfo() {
    await firebase.firestore()
      .collection('groceryList/UMa1GQigE73aEWGC9dUM/itemCollection')
      .doc(id)
      .update({
        quantity: firebase.firestore.FieldValue.increment(1),
        addedBy: addedBy,
      });
      // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
  }

  return (
    <List.Item
      style={styles.listItem}
      title={quantity}
      onPress={() => updateInfo()}
      left={props => (
        <View style={styles.view}>
          <Text style={styles.text}>{itemName}</Text>
        </View>
      )}
      right={props => (
          <Text style={styles.addedBy}>{addedBy}</Text>
        )}
    />
  );
}

const styles = StyleSheet.create({
  view:{
    width: '47%',
  },
  text: {
     paddingTop: '3%',
  },
  addedBy:{
    paddingTop: '2%',
  },
  listItem:{
    padding: 0,
  }
})

export default React.memo(GroceryItem);