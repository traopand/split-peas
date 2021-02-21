import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import Logo from "../assets/Logo.png";
import { BorderlessButton } from "react-native-gesture-handler";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.welcomeText}>Welcome back, </Text>
        <Text style={styles.welcomeText}>
          Sign in to continue grocery planning!
        </Text>
      </View>

      <View style={{ marginLeft: "-70%" }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          defaultValue={email}
        />
      </View>
      <View style={styles.underline}></View>

      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          defaultValue={password}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.underline}></View>

      <TouchableOpacity>
        <View style={styles.button}>
          <Text style={{ color: "white", fontSize: 17 }}>Sign In</Text>
        </View>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text style={styles.lowerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
          <Text style={styles.lowerTextPurple}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
  },

  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 180,
    height: 215,
  },

  loginText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5C7F7B",
    marginTop: -30,
    paddingBottom: 15,
  },

  welcomeText: {
    fontSize: 18,
    color: "#808080",
  },

  textInput: {
    paddingTop: 10,
    fontSize: 18,
    paddingBottom: 10,
    paddingTop: 30,
    textAlign: "left",
  },

  forgotPassword: {
    color: "#A4BEAD",
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingTop: 30,
    paddingLeft: "30%",
  },

  underline: {
    borderBottomColor: "#C5C5C7",
    borderBottomWidth: 1,
    width: "85%",
    justifyContent: "center",
    paddingBottom: 10,
  },

  button: {
    backgroundColor: "#B4B7FF",
    marginTop: 70,
    width: 343,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  lowerText: {
    fontSize: 15,
    color: "#8A8A8E",
  },

  lowerTextPurple: {
    fontSize: 15,
    color: "#B4B7FF",
  },
});
