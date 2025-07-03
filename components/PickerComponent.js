import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerComponent({ selectedValue, onValueChange, items = [], labelKey = 'libraryName', }) {
    return (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
                dropdownIconColor="#333"
            >
                <Picker.Item label="Select" value="" color='#000' />
                {items.map(item => (
                    <Picker.Item color='#000' label={item[labelKey]} value={item.id} key={item.id} />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        height: 40,
        marginBottom: 12,
    },
    picker: {
        height: 55,
        width: '100%',
    },
});
