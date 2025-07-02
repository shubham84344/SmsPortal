import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { addLibrary } from '../services/firebaseService';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function LibraryScreen({ navigation }) {
  const [libraryName, setLibraryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!libraryName.trim()) {
      ToastAndroid.show('Library name cannot be empty', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      await addLibrary(libraryName);
      ToastAndroid.show('Library added successfully!', ToastAndroid.SHORT);
      setLibraryName('');
      navigation.navigate('Home');
    } catch (error) {
      ToastAndroid.show('Error adding library. Try again.', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.heading}>Add Library</Text>
        <InputComponent
          placeholder="Enter Library Name"
          value={libraryName}
          onChangeText={setLibraryName}
        />
        <ButtonComponent 
          title="Add Library" 
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
