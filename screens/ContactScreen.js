import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { getGroups, addContact } from '../services/firebaseService';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import PickerComponent from '../components/PickerComponent';
import { useIsFocused } from '@react-navigation/native';

export default function ContactScreen({ navigation }) {
    const [groups, setGroups] = useState([]);
    console.log(groups);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [contactData, setContactData] = useState({
        name: '',
        mobile: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused) {
            fetchGroups();
        }
    }, [isFocused]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const groupsData = await getGroups();
            setGroups(groupsData);
        } catch (error) {
            ToastAndroid.show('Failed to fetch groups', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setContactData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedGroupId || !contactData.name || !contactData.mobile) {
            ToastAndroid.show('Select a group and fill required fields', ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);
            await addContact(selectedGroupId, contactData);
            ToastAndroid.show('Contact added successfully!', ToastAndroid.SHORT);
            setContactData({
                name: '',
                mobile: '',
                email: ''
            });
            setSelectedGroupId('');
            navigation.navigate('Home');
        } catch (error) {
            ToastAndroid.show('Failed to add contact', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.heading}>Add Contact</Text>

                <PickerComponent
                    selectedValue={selectedGroupId}
                    onValueChange={setSelectedGroupId}
                    items={groups}
                    loading={loading}
                    labelKey="groupName"
                />

                <InputComponent
                    placeholder="Name *"
                    value={contactData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />

                <InputComponent
                    placeholder="Mobile *"
                    value={contactData.mobile}
                    onChangeText={(text) => handleInputChange('mobile', text)}
                    keyboardType="phone-pad"
                />

                <InputComponent
                    placeholder="Email"
                    value={contactData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                />

                <ButtonComponent
                    title="Add Contact"
                    onPress={handleSubmit}
                    loading={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f2f2f2',
        flex: 1,
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