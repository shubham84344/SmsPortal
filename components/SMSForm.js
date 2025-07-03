import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputComponent from './InputComponent';
import ButtonComponent from './ButtonComponent';

const SMSForm = ({ 
  formData, 
  onFieldChange, 
  onSubmit 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send SMS</Text>
      
      <InputComponent
        placeholder="Name *"
        value={formData.name}
        onChangeText={(text) => onFieldChange('name', text)}
      />
      
      <InputComponent
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => onFieldChange('email', text)}
        keyboardType="email-address"
      />
      
      <InputComponent
        placeholder="Mobile *"
        value={formData.mobile}
        onChangeText={(text) => onFieldChange('mobile', text)}
        keyboardType="phone-pad"
      />
      
      <InputComponent
        placeholder="Message *"
        value={formData.message}
        onChangeText={(text) => onFieldChange('message', text)}
        multiline={true}
      />
      
      <ButtonComponent 
        title="Send SMS" 
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom:16,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  }
});

export default SMSForm;