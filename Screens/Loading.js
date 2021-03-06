import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as firebase from "firebase";

export default function Loading({ navigation }) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Homepage");
      } else {
        navigation.replace("Login");
      }
    });
  });

  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
}
