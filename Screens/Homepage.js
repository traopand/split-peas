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
import Fridge from "../assets/Fridge.png";
import Recipeas from "../assets/Recipeas.png";
import Coupon from "../assets/Coupon.png";

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
                <View style={{ flexGrow: 4, marginBottom: -70, flexDirection: 'row', backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                    <Image style={styles.logo} source={Logo} />
                    <Image source={Plitpeas} />
                </View>

                {/* Edit Profile and Logout Buttons */}
                <View style={styles.horizButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={temp}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>LogOut</Text>
                    </TouchableOpacity>
                </View>

                {/* Entire Bottom Portion, both green containers*/}
                <View style={{ flexGrow: 3}} >
                
                    {/* My Fridge, Reci-peas, Coupons */}
                    <View style={styles.menuContainer}>
                   
                        <View style={styles.menuItemContainer}>
                            <Image style={{width: 35, height: 48, marginLeft: 23}} source={Fridge} />
                            <TouchableOpacity style={styles.button} onPress={temp}>
                                <Text style={styles.buttonText}>My Fridge</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuItemContainer}>
                            <Image style={{width: 39, height: 47, marginLeft: 17}} source={Recipeas} />
                            <TouchableOpacity style={styles.button} onPress={temp}>
                                <Text style={styles.buttonText}>Reci-peas</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuItemContainer}>
                            <Image style={{width: 48, height: 47, marginLeft: 10}} source={Coupon} />
                            <TouchableOpacity style={styles.button} onPress={temp}>
                                <Text style={styles.buttonText}>Coupons</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* My pods */}
                    <View style={styles.greenContainer}>

                        <Text style={styles.h2}>My Pods</Text>
                        <TouchableOpacity style={styles.myPodButton} onPress={() => navigation.navigate("Dashboard")}>
                            <Text style={styles.myPodText}>Ravenous Raccoons</Text>
                        </TouchableOpacity>

                        <View style={styles.horizButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={temp}>
                                <Text style={styles.buttonText}>Create a Pod</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={temp}>
                                <Text style={styles.buttonText}>Join a Pod</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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

    horizButtonContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },

    greenContainer:{
        backgroundColor: "#E1EFD6",
         borderRadius: 15, 
         marginTop: '5%',
    },

    menuContainer:{
        paddingVertical: '5%',
        backgroundColor: "#E1EFD6",
         borderRadius: 15, 
         marginVertical: '5%',
    },

    menuItemContainer:{
       flexDirection: 'row',
       alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 80,
        height: 110,
    },

    h2: {
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
        textAlign: 'center',
        marginTop: 30,
    },

    button: {
        backgroundColor: "#B4B7FF",
        marginVertical: 10,
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

    myPodButton: {
        backgroundColor: "#5C7F7B",
        marginVertical: 20,
        width: 250,
        height: 56,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    myPodText: {
        fontSize: 20,
        color: "white",
    }

});
