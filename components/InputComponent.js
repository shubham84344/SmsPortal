import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function InputComponent({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    marginVertical: 10
  }
});
