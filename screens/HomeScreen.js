import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getLibraries, getMessages, deleteLibrary, deleteMessagesByLibraryId } from '../services/firebaseService';
import Loader from '../components/Loader';
import ListCard from '../components/ListCard';
import SMSForm from '../components/SMSForm';

const HomeScreen = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const libs = await getLibraries();
      setLibraries(libs);
      if (libs.length > 0) {
        setSelectedLibraryId(libs[0].id);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to load libraries', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!selectedLibraryId) return;
    setSelectedMessageId('');

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const msgs = await getMessages(selectedLibraryId);
        setMessages(msgs);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Failed to load messages', ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedLibraryId]);

  const handleDeleteLibrary = async (libraryId) => {
    setLoading(true);
    try {
      // Get library name before deleting
      const libraryToDelete = libraries.find(lib => lib.id === libraryId);
      const libraryName = libraryToDelete?.libraryName || '';

      await deleteMessagesByLibraryId(libraryId);
      await deleteLibrary(libraryId);

      const updatedLibraries = libraries.filter(lib => lib.id !== libraryId);
      setLibraries(updatedLibraries);

      if (selectedLibraryId === libraryId) {
        setSelectedLibraryId(updatedLibraries[0]?.id || '');
        setMessages([]);
      }

      // Show toast with library name
      ToastAndroid.show(
        `Deleted library: ${libraryName}`,
        ToastAndroid.LONG
      );
    } catch (error) {
      console.error('Error deleting library:', error);
      ToastAndroid.show(
        'Failed to delete library',
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendSMS = () => {
    if (!formData.name || !formData.mobile || !formData.message) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    ToastAndroid.show('SMS prepared!', ToastAndroid.LONG);
    setFormData({ name: '', email: '', mobile: '', message: '' });
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <ScrollView style={styles.screen}>
        <ListCard
          title="Library"
          items={libraries.map(lib => ({ ...lib, text: lib.libraryName }))}
          selectedId={selectedLibraryId}
          onSelect={setSelectedLibraryId}
          showDelete
          onDelete={handleDeleteLibrary}
        />

        <ListCard
          title="Messages"
          items={messages.map(msg => ({ ...msg, text: msg.messageText }))}
          selectedId={selectedMessageId}
          onSelect={setSelectedMessageId}
        />
        <SMSForm 
          formData={formData}
          onFieldChange={handleFieldChange}
          onSubmit={handleSendSMS}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
});

export default HomeScreen;