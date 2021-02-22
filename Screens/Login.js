Login;

import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { signIn } from "../API/firebaseMethods";

import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Logo from "../assets/Logo.png";
import { BorderlessButton } from "react-native-gesture-handler";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePress = () => {
    if (!email) {
      Alert.alert("Email field is required.");
    }

    if (!password) {
      Alert.alert("Password field is required.");
    }

    signIn(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.loginText}>Sign In</Text>
        <Text style={styles.welcomeText}>Welcome back, </Text>
        <Text style={styles.welcomeText}>
          Sign in to continue grocery planning!
        </Text>
      </View>
      <Input
        inputContainerStyle={{
          borderBottomColor: "#C5C5C7",
          paddingHorizontal: 20,
        }}
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Icon name="envelope" size={24} color="#C5C5C7" />}
      />

      <Input
        inputContainerStyle={{
          borderBottomColor: "#C5C5C7",
          paddingHorizontal: 25,
        }}
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        leftIcon={<Icon name="lock" size={30} color="#C5C5C7" />}
        secureTextEntry={true}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePress}>
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
    textAlign: "left",
  },

  forgotPassword: {
    color: "#A4BEAD",
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 5,
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
