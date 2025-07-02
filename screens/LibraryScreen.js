import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function LibraryScreen() {
  const [libraryName, setLibraryName] = useState('');

  const handleSubmit = () => {
    console.log('Library Submitted:', libraryName);
    setLibraryName('');
  };

  return (
    <View style={styles.container}>
      <InputComponent
        placeholder="Enter Library Name"
        value={libraryName}
        onChangeText={setLibraryName}
      />
      <ButtonComponent title="Add Library" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
