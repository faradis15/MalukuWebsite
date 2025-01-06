import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const addListToFirebase = async (newList) => {
    try {
        const docRef = await addDoc(collection(db, 'savedLists'), newList);
        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

export const fetchListsFromFirebase = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'savedLists'));
        const fetchedLists = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const uniqueLists = Array.from(new Set(fetchedLists.map(a => JSON.stringify(a.details))))
            .map(e => JSON.parse(e));

        return uniqueLists;
    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
};

export const deleteListFromFirebase = async (docId) => {
    try {
        const docRef = doc(db, 'savedLists', docId);
        await deleteDoc(docRef);
        console.log(`Document with ID ${docId} has been deleted.`);
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
};

export const updateListInFirebase = async (docId, updatedData) => {
    try {
        const docRef = doc(db, 'savedLists', docId);
        await updateDoc(docRef, updatedData);
        console.log(`Document with ID ${docId} has been updated.`);
        return true;
    } catch (error) {
        console.error('Error updating document: ', error);
        return false;
    }
};