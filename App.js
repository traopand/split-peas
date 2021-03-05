// In App.js in a new project

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";
import apiKeys from "./config/keys";
import Login from "./Screens/Login";
import CreateAccount from "./Screens/CreateAccount";
import Loading from "./Screens/Loading";
import Dashboard from "./Screens/Dashboard";
import Main from "./Screens/Main";
import GroceryList from "./Screens/GroceryList";
import GroceryListSplitBill from "./Screens/GroceryListSplitBill";
import Homepage from "./Screens/Homepage";
import MyLists from "./Screens/MyLists";

const Stack = createStackNavigator();

function App() {
  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name={"Loading"} component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name={"Homepage"} component={Homepage} />
        <Stack.Screen name={"Dashboard"} component={Dashboard} />
        <Stack.Screen name={"Main"} component={Main} />
        <Stack.Screen name={"GroceryList"} component={GroceryList} />
        <Stack.Screen name={"MyLists"} component={MyLists} />
        <Stack.Screen name={"GroceryListSplitBill"} component={GroceryListSplitBill} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
