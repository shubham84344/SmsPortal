import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function HomeScreen() {

    const getData = async () => {
        const library = await firestore().collection('library').get();
        console.log(library.docs[0].data());
    }
    useEffect(() => {
        getData();
    })
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20 }
});
