import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/utils';

export function useFirebase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCollectionData = useCallback(async (collectionPath, constraints = []) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.currentUser) throw new Error("Not authenticated");
      const q = query(
        collection(db, collectionPath),
        where('userId', '==', auth.currentUser.uid),
        ...constraints
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      handleFirestoreError(err, OperationType.LIST, collectionPath);
    }
  }, []);

  const addDocument = useCallback(async (collectionPath, data) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.currentUser) throw new Error("Not authenticated");
      const docRef = await addDoc(collection(db, collectionPath), {
        ...data,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp()
      });
      setLoading(false);
      return { id: docRef.id, ...data };
    } catch (err) {
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, collectionPath);
    }
  }, []);

  const updateDocument = useCallback(async (collectionPath, docId, data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleFirestoreError(err, OperationType.UPDATE, `${collectionPath}/${docId}`);
    }
  }, []);

  const removeDocument = useCallback(async (collectionPath, docId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionPath, docId));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${docId}`);
    }
  }, []);

  return {
    loading,
    error,
    getCollectionData,
    addDocument,
    updateDocument,
    removeDocument
  };
}
