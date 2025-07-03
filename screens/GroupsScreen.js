import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { addGroup } from '../services/firebaseService';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function GroupsScreen({ navigation }) {
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!groupName.trim()) {
            ToastAndroid.show('Group name cannot be empty', ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);
            await addGroup(groupName);
            ToastAndroid.show('Group added successfully!', ToastAndroid.SHORT);
            setGroupName('');
            navigation.navigate('Home');
        } catch (error) {
            ToastAndroid.show('Error adding group. Try again.', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <Text style={styles.heading}>Add Group</Text>
                <InputComponent
                    placeholder="Enter Group Name"
                    value={groupName}
                    onChangeText={setGroupName}
                />
                <ButtonComponent
                    title="Add Group"
                    onPress={handleSubmit}
                    loading={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 4,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
});