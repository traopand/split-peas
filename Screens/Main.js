// @refresh reset

import React, { useState, useEffect, useCallback } from 'react'
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet, TextInput, View, YellowBox, Button, TouchableOpacity, Text, LogBox } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { Icon } from 'react-native-elements'

const firebaseConfig= {
    apiKey: "AIzaSyCsforS_dmlkPL3etOClpQR_AVYz_yOtnk",
    authDomain: "split-peas.firebaseapp.com",
    projectId: "split-peas",
    storageBucket: "split-peas.appspot.com",
    messagingSenderId: "284288624580",
    appId: "1:284288624580:web:13f27792a39500c1f6c6691",
    measurementId: "G-0XZ0S52ZFF"
  }

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

// LogBox.ignoreLogs();

YellowBox.ignoreWarnings(['Setting a timer for a long period of time'])

const db = firebase.firestore()
const chatsRef = db.collection('chats')

export default function App() {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        readUser()
        const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data()
                    //createdAt is firebase.firestore.Timestamp instance
                    //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        })
        return () => unsubscribe()
    }, [])

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    async function readUser() {
        const user = await AsyncStorage.getItem('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }
    async function handlePress() {
        const _id = Math.random().toString(36).substring(7)
        const user = { _id, name }
        await AsyncStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }
    async function handleSend(messages) {
        const writes = messages.map((m) => chatsRef.add(m))
        await Promise.all(writes)
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
                <Button onPress={handlePress} title="Enter the chat" />
            </View>
        )
    }
    return <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={user} 
        renderInputToolbar={props => customtInputToolbar(props)}
        renderSystemMessage= {props => customSystemMessage(props)}
        renderSend={props => renderSend(props)}
    />
}

const renderSend = (sendProps) => {
    <TouchableOpacity>
      {/* <Image source={require('path/to/your/button/icon')} /> */}
      <Icon name="lock" color="#9d9d9d" size={16} />
      <Text style={styles.ChatMessageSystemMessageText}>
          Add
        </Text>
    </TouchableOpacity>
}

const customSystemMessage = props => {
    return (
      <View style={styles.ChatMessageSytemMessageContainer}>
        <Icon name="lock" color="#9d9d9d" size={16} />
        <Text style={styles.ChatMessageSystemMessageText}>
          Add it
        </Text>
      </View>
    );
  };

const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
          padding: 8
        }}
      />
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
    ChatMessageSystemMessageText:{
        color: 'purple',
    }
})