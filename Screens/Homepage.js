import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { loggingOut } from "../API/firebaseMethods";
import Logo from "../assets/Logo.png";
import Plitpeas from "../assets/Plitpeas.png";

export default function Homepage({ navigation }) {
    let currentUserUID = firebase.auth().currentUser.uid;
    const [firstName, setFirstName] = useState("");
    const [createGroupVisible, setCreateGroupVisible] = useState(false);
    const [groupName, setGroupName] = useState("Pod Name");
    const [listMembers, setListMembers] = useState("");

    // TUTORIAL GROUP CREATOR //
    const [group, setGroup] = useState("");

    const [listName, setListName] = useState("List Name");
    const [infoVisible, setInfoVisible] = useState(false);
    const listRef = firebase.firestore().collection("groceryList");

    useEffect(() => {
        async function getUserInfo() {
            let doc = await firebase
                .firestore()
                .collection("usersList")
                .doc(currentUserUID)
                .get();

            if (!doc.exists) {
                Alert.alert("No user data found!");
            } else {
                let dataObj = doc.data();
                setFirstName(dataObj.firstName);
            }
        }
        getUserInfo();
    });

    const logout = () => {
        loggingOut();
        navigation.replace("Login");
    };


    const temp = () => {

    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    return (
        <>
            <View style={styles.container}>
                {/* SplitPeas Title */}
                <View style={{ flexGrow: 2, marginBottom: -70, flexDirection: 'row', backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                    <Image style={styles.logo} source={Logo} />
                    <Image source={Plitpeas} />
                </View>

                {/* Edit Profile and Logout Buttons */}
                <View style={{ flexGrow: 1, marginBottom: 30, flexDirection: 'row', backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>LogOut</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexGrow: 4 }} >
                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>My Fridge</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={temp} >
                        <Text style={styles.buttonText}>Reci-peas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>Coupons</Text>
                    </TouchableOpacity>

                    {/* Bottom View */}
                    <Text style={styles.h2}>My Pods</Text>

                    <TouchableOpacity style={styles.myPodButton} onPress={() => navigation.navigate("Dashboard")}>
                        <Text style={styles.myPodText}>Ravenous Raccoons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>Create new Pod</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>Join new Pod</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 4,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 80,
        height: 110,
    },

    h2:{
        fontSize: 25,
        fontWeight: "bold",
        color: "#5C7F7B",
        textAlign: 'center',
        marginTop: 30,
    },

    titleText: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#5C7F7B",
        marginTop: -30,
        paddingBottom: 10,
    },

    button: {
        backgroundColor: "#B4B7FF",
        marginTop: 5,
        width: 150,
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        alignSelf: 'center',
    },

    buttonText: {
        fontSize: 18,
        color: "white",
    },

    myPodButton:{
        backgroundColor: "#5C7F7B",
        marginTop: 5,
        width: 250,
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    myPodText:{
        fontSize: 20,
        color: "white",
    }

});
