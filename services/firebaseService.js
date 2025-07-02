import firestore from '@react-native-firebase/firestore';

export const getLibraries = async () => {
    try {
        const snapshot = await firestore().collection('library').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching libraries:', error);
        throw error;
    }
};

export const addLibrary = async (libraryName) => {
    try {
        await firestore().collection('library').add({
            libraryName: libraryName.trim(),
        });
    } catch (error) {
        console.error('Error adding library:', error);
        throw error;
    }
};

export const getMessages = async (libraryId) => {
    try {
        const snapshot = await firestore()
            .collection('message')
            .where('libraryId', '==', libraryId)
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const addMessage = async (libraryId, messageText) => {
    try {
        await firestore().collection('message').add({
            libraryId,
            messageText: messageText.trim(),
        });
    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
};

export const deleteLibrary = async (libraryId) => {
    try {
        await firestore().collection('library').doc(libraryId).delete();
    } catch (error) {
        console.error('Error deleting library:', error);
        throw error;
    }
};

export const deleteMessagesByLibraryId = async (libraryId) => {
    try {
        // Get all messages for this library
        const snapshot = await firestore()
            .collection('message')
            .where('libraryId', '==', libraryId)
            .get();

        // Delete each message in a batch
        const batch = firestore().batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    } catch (error) {
        console.error('Error deleting messages:', error);
        throw error;
    }
};