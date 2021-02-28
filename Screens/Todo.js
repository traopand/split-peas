import React from 'react';
import * as firebase from "firebase";
import { List } from 'react-native-paper';

function Todo({ id, title, complete }) {
  async function toggleComplete() {
    await firebase.firestore()
      .collection('groceryList/UMa1GQigE73aEWGC9dUM/itemCollection')
      .doc(id)
      .update({
        complete: firebase.firestore.FieldValue.increment(1)
      });
      // THE GROCERY LIST ID IS CURRENTLY HARDED CODED^^
  }

  return (
    <List.Item
      title={title}
      onPress={() => toggleComplete()}
      description={complete}
      left={props => (
        <List.Icon {...props} icon={complete} />
      )}
    />
  );
}

export default React.memo(Todo);