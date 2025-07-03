import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function InputComponent({ value, onChangeText, placeholder, multiline = false }) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={'#888'}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginVertical: 10,
    color: 'black'
  },
  multiline: {
    minHeight: 60,
  },
});
