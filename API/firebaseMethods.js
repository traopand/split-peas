import * as firebase from "firebase";
import "firebase/firestore";
import { Alert } from "react-native";

export async function registration(email, password, userName, firstName) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    // automatically adds all users to the same group
    const groupRef = firebase.firestore().collection("group/Rodaxem1mzuhpqAOq25u/usersCollection");
    await groupRef.add({
      userID: currentUser.uid,
    });
    // end of auto add to same group
    
    const db = firebase.firestore();
    db.collection("usersList").doc(currentUser.uid).set({
      email: currentUser.email,
      userName: userName,
      firstName: firstName,
      groupID: "Rodaxem1mzuhpqAOq25u",
    });

    

  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}
