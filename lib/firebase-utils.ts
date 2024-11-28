"use client";

import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

// Helper function to ensure user document exists
export async function ensureUserDocument() {
  if (!auth.currentUser) {
    throw new Error('Authentication required');
  }

  try {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: auth.currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        collections: {
          appointments: true,
          clients: true,
          services: true,
          staff: true
        }
      });
    }

    return userDocRef;
  } catch (error) {
    console.error('Error ensuring user document:', error);
    throw error;
  }
}

// Helper function to get user-specific collection reference
export function getUserCollection(collectionName: string) {
  if (!auth.currentUser) {
    throw new Error('Authentication required');
  }
  return collection(db, 'users', auth.currentUser.uid, collectionName);
}

// Helper function to prepare data for Firestore
export function prepareForFirestore(data: any) {
  const prepared = { ...data };
  delete prepared.id;
  
  // Convert string numbers to actual numbers
  if (typeof prepared.price !== 'undefined') {
    prepared.price = Number(prepared.price);
  }
  if (typeof prepared.duration !== 'undefined') {
    prepared.duration = Number(prepared.duration);
  }
  
  // Add timestamps
  prepared.updatedAt = serverTimestamp();
  if (!prepared.createdAt) {
    prepared.createdAt = serverTimestamp();
  }
  
  return prepared;
}