import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    Modal,
    Pressable,
    Keyboard,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { loggingOut } from "../API/firebaseMethods";
import Logo from "../assets/Logo.png";
import Plitpeas from "../assets/Plitpeas.png";
import Fridge from "../assets/Fridge.png";
import Recipeas from "../assets/Recipeas.png";
import Coupon from "../assets/Coupon.png";
import { Input } from "react-native-elements";

export default function Homepage({ navigation }) {
    let currentUserUID = firebase.auth().currentUser.uid;
    const [firstName, setFirstName] = useState("");
    const [userId, setUserId] = useState("");
    const groupRef = firebase.firestore().collection("group");

    const [createGroupVisible, setCreateGroupVisible] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [listMembers, setListMembers] = useState("");
    const [createPod, setCreatePod] = useState(true);
    const [podCode, setPodCode] = useState('');

    // TUTORIAL GROUP CREATOR //
    const [group, setGroup] = useState("");

    const [podName, setPodName] = useState("");
    const [infoVisible, setInfoVisible] = useState(false);


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

    const addPod = async () => {
        await groupRef.add({
            name: podName,
            code: "12345",
        })
        .then( async function (docRef){
            await groupRef.doc(docRef.id).update({
                code: docRef.id.substr(docRef.id.length - 6),
                numOfUsers: 1,
            });

            const userCollectionRef = firebase.firestore().collection(`group/${docRef.id}/usersCollection`);
            
            await userCollectionRef.add({
                userId: currentUserUID,
            });
            
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

        setPodName("");
        setCreateGroupVisible(!createGroupVisible)
        Keyboard.dismiss();
    }

    const joinPod = async (code) => {
        // check if user exists already
        await firebase
        .firestore()
        .collection("group")
        .where('code', '==', code)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                
             await firebase.firestore()
                .collection(`group/${doc.id}/usersCollection`)
                .where('userId', '==', currentUserUID).get()
                .then((doc) => {
                    if (doc.exists) {
                        return null;
                    }
                });
             })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        
        // adds user if they havent existed yet
        await firebase
        .firestore()
        .collection("group")
        .where('code', '==', code)
        .get()
        .update({
            numOfUsers: firebase.firestore.FieldValue.increment(1),
        })
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {

                const userCollectionRef = firebase.firestore().collection(`group/${doc.id}/usersCollection`);

                console.log("It went throguh");
                await userCollectionRef.add({
                    userId: currentUserUID,
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });;

        setPodCode("");
        setCreateGroupVisible(!createGroupVisible)
        Keyboard.dismiss();
    }

    return (
        <View style={styles.container}>

            {/* Modal Starts */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createGroupVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!createGroupVisible);
                }}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        
                        {createPod ? 
                        <>
                        <Input
                         inputContainerStyle={{
                             borderBottomColor: "#A4BEAD",
                             borderBottomWidth: 1.5,
                         }}
                         placeholder={"Enter Pod Name"}
                         onChangeText={(podName) => setPodName(podName)}
                         value={podName}
                         style={styles.podName}
                     />

                     <Pressable onPress={() => addPod()} style={styles.button}>
                         <Text style={styles.buttonText}>Create Pod</Text>
                     </Pressable>
                     </>
                     :
                     <>

                      <Input
                            inputContainerStyle={{
                                borderBottomColor: "#A4BEAD",
                                borderBottomWidth: 1.5,
                            }}
                            placeholder={"Enter Pod Code"}
                            onChangeText={(podCode) => setPodCode(podCode)}
                            value={podCode}
                            style={styles.podName}
                        />

                        <Pressable onPress={() => joinPod(podCode)} style={styles.button}>
                            <Text style={styles.buttonText}>Join Pod</Text>
                        </Pressable>
                     </>
                    }

                        <Pressable
                            style={styles.button}
                            onPress={() => setCreateGroupVisible(!createGroupVisible)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>

            {/* Modal Ends */}


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
            <View style={{ flexGrow: 3 }} >

                {/* My Fridge, Reci-peas, Coupons */}
                <View style={styles.menuContainer}>

                    <View style={styles.menuItemContainer}>
                        <Image style={{ width: 35, height: 48, marginRight: 7 }} source={Fridge} />
                        <TouchableOpacity style={styles.button} onPress={temp}>
                            <Text style={styles.buttonText}>My Fridge</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.menuItemContainer}>
                        <Image style={{ width: 39, height: 47, marginRight: 5 }} source={Recipeas} />
                        <TouchableOpacity style={styles.button} onPress={temp}>
                            <Text style={styles.buttonText}>Reci-peas</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.menuItemContainer}>
                        <Image style={{ width: 48, height: 47, marginRight: 2 }} source={Coupon} />
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
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setCreatePod(true)
                            setCreateGroupVisible(true)}
                        }>
                            <Text style={styles.buttonText}>Create a Pod</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => {
                            setCreatePod(false)
                            setCreateGroupVisible(true)
                        }}>
                            <Text style={styles.buttonText}>Join a Pod</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
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

    greenContainer: {
        backgroundColor: "#E1EFD6",
        borderRadius: 15,
        marginTop: '5%',
    },

    menuContainer: {
        paddingVertical: '5%',
        backgroundColor: "#E1EFD6",
        borderRadius: 15,
        marginVertical: '5%',
    },

    menuItemContainer: {
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
    },

    // modal styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        borderColor: "#A4BEAD",
        borderWidth: 2,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        width: "90%",
        height: 300,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    podName: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: 26,
        color: "#5D7E7D",
        fontWeight: "bold",
    },
});
