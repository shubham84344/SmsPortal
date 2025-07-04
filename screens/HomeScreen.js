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
  // State declarations
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

  // Fetch initial data when screen is focused
  useEffect(() => {
    if (!isFocused) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [libs, grps] = await Promise.all([getLibraries(), getGroups()]);
        setLibraries(libs);
        setGroups(grps);

        if (libs.length > 0) {
          const firstLibraryId = libs[0].id;
          setSelectedLibraryId(firstLibraryId);
          const msgs = await getMessages(firstLibraryId);
          setMessages(msgs);
        }

        if (grps.length > 0) {
          const firstGroupId = grps[0].id;
          setSelectedGroupId(firstGroupId);
          const cntcts = await getContacts(firstGroupId);
          setContacts(cntcts);
        }
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Failed to load data', ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isFocused]);

  // Fetch messages when library changes
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

  // Fetch contacts when group changes
  useEffect(() => {
    if (!selectedGroupId) return;
    setSelectedContactId('');
    const fetchContactsData = async () => {
      setLoading(true);
      try {
        const cntcts = await getContacts(selectedGroupId);
        setContacts(cntcts);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Failed to load contacts', ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };
    fetchContactsData();
  }, [selectedGroupId]);

  // Update form with selected contact info
  useEffect(() => {
    if (!selectedContactId) return;
    const selected = contacts.find(c => c.id === selectedContactId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        name: selected.name || '',
        email: selected.email || '',
        mobile: selected.mobile || '',
      }));
    }
  }, [selectedContactId]);

  // Update form with selected message text
  useEffect(() => {
    if (!selectedMessageId) return;
    const selected = messages.find(m => m.id === selectedMessageId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        message: selected.messageText || '',
      }));
    }
  }, [selectedMessageId]);

  // Form input change
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle send SMS
  const handleSendSMS = () => {
    if (!formData.name || !formData.mobile || !formData.message) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    ToastAndroid.show('SMS Send', ToastAndroid.LONG);
    setFormData({ name: '', email: '', mobile: '', message: '' });
  };

  // Handle library deletion
  const handleDeleteLibrary = async (libraryId) => {
    setLoading(true);
    try {
      const lib = libraries.find(l => l.id === libraryId);
      const name = lib?.libraryName || '';
      await deleteMessagesByLibraryId(libraryId);
      await deleteLibrary(libraryId);

      const updated = libraries.filter(l => l.id !== libraryId);
      setLibraries(updated);

      if (selectedLibraryId === libraryId) {
        setSelectedLibraryId(updated[0]?.id || '');
        setMessages([]);
      }

      ToastAndroid.show(`Deleted library: ${name}`, ToastAndroid.LONG);
    } catch (error) {
      console.error('Error deleting library:', error);
      ToastAndroid.show('Failed to delete library', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  // Handle group deletion
  const handleDeleteGroup = async (groupId) => {
    setLoading(true);
    try {
      const grp = groups.find(g => g.id === groupId);
      const name = grp?.groupName || '';
      await deleteContactsByGroupId(groupId);
      await deleteGroup(groupId);

      const updated = groups.filter(g => g.id !== groupId);
      setGroups(updated);

      if (selectedGroupId === groupId) {
        setSelectedGroupId(updated[0]?.id || '');
        setContacts([]);
      }

      ToastAndroid.show(`Deleted group: ${name}`, ToastAndroid.LONG);
    } catch (error) {
      console.error('Error deleting group:', error);
      ToastAndroid.show('Failed to delete group', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
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
