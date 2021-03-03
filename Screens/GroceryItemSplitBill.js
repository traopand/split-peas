import React from 'react';
import * as firebase from "firebase";
import { List } from 'react-native-paper';
import { StyleSheet, Text, View, Image } from 'react-native';
import T from "../assets/T.png";
import A from "../assets/A.png";
import Z from "../assets/Z.png";

function GroceryItemSplitBill({ id, itemName, quantity, addedBy }) {

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
        <View style={styles.addedBy}>
          {addedBy === 'Amanda' ? <Image source={A} />
            : null}

          {addedBy === 'Tara' ? <Image source={T} />
            : null}

          {addedBy !== 'Tara' || addedBy !== 'Amanda' ? null
            :  <Image source={Z} />
          }

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
  }
})

export default React.memo(GroceryItemSplitBill);