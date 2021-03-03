import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
//import { AuthContext } from "../Navigation/AuthProvider";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { registration } from "../API/firebaseMethods";

import { StyleSheet, TouchableOpacity, Text, View, Image,
  ScrollView, Keyboard, Alert } from "react-native";
import Logo from "../assets/Logo.png";

export default function CreateAccount({ navigation }) {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emptyState = () => {
    setFirstName("");
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handlePress = () => {
    if (!firstName) {
      Alert.alert("First name is required");
    } else if (!userName) {
      Alert.alert("Username is required.");
    } else if (!email) {
      Alert.alert("Email field is required.");
    } else if (!password) {
      Alert.alert("Password field is required.");
    } else if (!confirmPassword) {
      setPassword("");
      Alert.alert("Confirm password field is required.");
    } else if (password !== confirmPassword) {
      Alert.alert("Password does not match!");
    } else {
      registration(email, password, userName, firstName);
      navigation.navigate("Loading");
      emptyState();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.loginText}>Create Account</Text>
        <Text style={styles.welcomeText}>Enter your details to begin!</Text>
      </View>
      <ScrollView onBlur={Keyboard.dismiss}>
        <Input
          inputContainerStyle={{
            borderBottomColor: "#C5C5C7",
            paddingHorizontal: 20,
          }}
          style={styles.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={(firstName) => setFirstName(firstName)}
          leftIcon={<Icon name="user" size={26} color="#C5C5C7" />}
        />

        <Input
          inputContainerStyle={{
            borderBottomColor: "#C5C5C7",
            paddingHorizontal: 20,
          }}
          style={styles.textInput}
          placeholder="Username"
          value={userName}
          onChangeText={(userName) => setUserName(userName)}
          leftIcon={<Icon name="user" size={26} color="#C5C5C7" />}
        />

        <Input
          inputContainerStyle={{
            borderBottomColor: "#C5C5C7",
            paddingHorizontal: 20,
          }}
          style={styles.textInput}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={(email) => setEmail(email)}
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

        <Input
          inputContainerStyle={{
            borderBottomColor: "#C5C5C7",
            paddingHorizontal: 25,
          }}
          style={styles.textInput}
          placeholder="Retype your password to confirm*"
          value={confirmPassword}
          onChangeText={(password2) => setConfirmPassword(password2)}
          leftIcon={<Icon name="lock" size={30} color="#C5C5C7" />}
          secureTextEntry={true}
        />

        <TouchableOpacity onPress={handlePress}>
          <View style={styles.button}>
            <Text style={{ color: "white", fontSize: 17 }}>Create Account</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Text style={styles.lowerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.lowerTextPurple}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 40,
  },

  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 144,
    height: 172,
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
    fontSize: 15,
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
    marginTop: 40,
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
