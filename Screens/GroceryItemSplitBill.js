import React, { useState, useEffect } from 'react';
import * as firebase from "firebase";
import { List } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

function GroceryItemSplitBill({ id, itemName, quantity, addedBy }) {
  const [colourCode, setColourCode] = useState('');

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

  useEffect(() => {
    var x = addedBy.substring(1, 2).toLowerCase();
    if (x === "a" || x === "b" || x === "c") { setColourCode("#B4B7FF") }
    if (x === "d" || x === "e" || x === "f") { setColourCode("#699BF7") }
    if (x === "g" || x === "h" || x === "i") { setColourCode("#7CC093") }
    if (x === "j" || x === "k" || x === "l") { setColourCode("#FBAF78") }
    if (x === "m" || x === "n" || x === "o") { setColourCode("#FEAFCB") }
    if (x === "p" || x === "q" || x === "r") { setColourCode("#6368CA") }
    if (x === "s" || x === "t" || x === "u" || x === "v") { setColourCode("#FF8577") }
    if (x === "w" || x === "x" || x === "y" || x === "z") { setColourCode("#FFE55C") }

  }, [])

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
        <View style={styles.addedBy}>
          <Text style={[styles.letter, { backgroundColor: colourCode }]}>{addedBy.substring(0, 1)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  view: {
    width: '47%',
  },
  text: {
    paddingTop: '3%',
  },
  addedBy: {
    paddingTop: '2%',
  },
  listItem: {
    padding: 0,
  },
  letter: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    borderRadius: 100,
    height: 28,
    width: 28,
  }
})

export default React.memo(GroceryItemSplitBill);