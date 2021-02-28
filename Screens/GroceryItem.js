import React from 'react';
import * as firebase from "firebase";
import { List } from 'react-native-paper';
import { Text } from 'react-native';


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
      title={itemName}
      onPress={() => updateInfo()}
      description={addedBy}
      right={props => (
          <Text>{quantity}</Text>
        )}
    />
  );
}

export default React.memo(GroceryItem);