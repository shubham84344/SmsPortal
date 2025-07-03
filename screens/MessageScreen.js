import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { getLibraries, addMessage } from '../services/firebaseService';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import PickerComponent from '../components/PickerComponent';
import { useIsFocused } from '@react-navigation/native';

export default function MessageScreen({ navigation }) {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const libs = await getLibraries();
      setLibraries(libs);
    } catch (error) {
      ToastAndroid.show('Failed to fetch libraries', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchLibraries();
    }
  }, [isFocused]);

  const handleSubmit = async () => {
    if (!selectedLibraryId || !message.trim()) {
      ToastAndroid.show('Select a library and enter a message', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      await addMessage(selectedLibraryId, message);
      ToastAndroid.show('Message added successfully!', ToastAndroid.SHORT);
      setMessage('');
      setSelectedLibraryId('');
      navigation.navigate('Home');
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Select Library</Text>

        <PickerComponent
          selectedValue={selectedLibraryId}
          onValueChange={setSelectedLibraryId}
          items={libraries}
          loading={loading}
        />

        <InputComponent
          value={message}
          onChangeText={setMessage}
          placeholder="Enter message"
          multiline={true}
        />

        <ButtonComponent
          title="Add Message"
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
