import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  getLibraries,
  getMessages,
  deleteLibrary,
  deleteMessagesByLibraryId,
  getGroups,
  getContacts,
  deleteGroup,
  deleteContactsByGroupId
} from '../services/firebaseService';
import Loader from '../components/Loader';
import ListCard from '../components/ListCard';
import SMSForm from '../components/SMSForm';

const HomeScreen = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [libs, grps] = await Promise.all([
        getLibraries(),
        getGroups()
      ]);

      setLibraries(libs);
      setGroups(grps);

      if (libs.length > 0) {
        setSelectedLibraryId(libs[0].id);
        const msgs = await getMessages(libs[0].id);
        setMessages(msgs);
      }

      if (grps.length > 0) {
        setSelectedGroupId(grps[0].id);
        const cntcts = await getContacts(grps[0].id);
        setContacts(cntcts);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Failed to load data', ToastAndroid.LONG);
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

      ToastAndroid.show(`Deleted library: ${libraryName}`, ToastAndroid.LONG);
    } catch (error) {
      console.error('Error deleting library:', error);
      ToastAndroid.show('Failed to delete library', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    setLoading(true);
    try {
      const groupToDelete = groups.find(grp => grp.id === groupId);
      const groupName = groupToDelete?.groupName || '';

      await deleteContactsByGroupId(groupId);
      await deleteGroup(groupId);

      const updatedGroups = groups.filter(grp => grp.id !== groupId);
      setGroups(updatedGroups);

      if (selectedGroupId === groupId) {
        setSelectedGroupId(updatedGroups[0]?.id || '');
        setContacts([]);
      }

      ToastAndroid.show(`Deleted group: ${groupName}`, ToastAndroid.LONG);
    } catch (error) {
      console.error('Error deleting group:', error);
      ToastAndroid.show('Failed to delete group', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!selectedContactId) return;

    const selectedContact = contacts.find(c => c.id === selectedContactId);
    if (selectedContact) {
      setFormData(prev => ({
        ...prev,
        name: selectedContact.name || '',
        email: selectedContact.email || '',
        mobile: selectedContact.mobile || '',
      }));
    }
  }, [selectedContactId]);

  useEffect(() => {
    if (!selectedMessageId) return;

    const selectedMessage = messages.find(m => m.id === selectedMessageId);
    if (selectedMessage) {
      setFormData(prev => ({
        ...prev,
        message: selectedMessage.messageText || '',
      }));
    }
  }, [selectedMessageId]);

  const handleSendSMS = () => {
    if (!formData.name || !formData.mobile || !formData.message) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    ToastAndroid.show('SMS Send', ToastAndroid.LONG);
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
          onSelect={(id) => {
            setSelectedMessageId(id);
            setSelectedContactId('');
          }}
        />
        <SMSForm
          formData={formData}
          onFieldChange={handleFieldChange}
          onSubmit={handleSendSMS}
        />
        <ListCard
          title="Groups"
          items={groups.map(grp => ({ ...grp, text: grp.groupName }))}
          selectedId={selectedGroupId}
          onSelect={setSelectedGroupId}
          showDelete
          onDelete={handleDeleteGroup}
        />
        <ListCard
          title="Contacts"
          items={contacts.map(contact => ({
            ...contact,
            text: `${contact.name} - ${contact.mobile} - ${contact.email}`
          }))}
          selectedId={selectedContactId}
          onSelect={(id) => {
            setSelectedContactId(id);
            setSelectedMessageId('');
          }}
          style={{ marginBottom: 40 }}
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