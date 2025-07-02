import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListCard = ({ 
  title, 
  items, 
  selectedId, 
  onSelect, 
  textKey = 'text',
  showDelete = false,
  onDelete,
  style
}) => (
  <View style={[styles.card, style]}>
    <Text style={styles.heading}>{title}</Text>
    {items.length === 0 ? (
      <Text style={styles.noMessage}>No {title.toLowerCase()} found</Text>
    ) : (
      items.map((item) => (
        <View key={item.id} style={styles.listItemContainer}>
          <TouchableOpacity
            style={[
              styles.item,
              item.id === selectedId && styles.activeItem,
            ]}
            onPress={() => onSelect(item.id)}
          >
            <Text style={[
              styles.itemText,
              item.id === selectedId && styles.activeItemText,
            ]}>
              {item[textKey]}
            </Text>
          </TouchableOpacity>
          {showDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(item.id)}
            >
              <Icon name="delete" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </View>
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
  },
  activeItem: {
    backgroundColor: '#90e0ef',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  activeItemText: {
    color: '#000',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
  noMessage: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default ListCard;