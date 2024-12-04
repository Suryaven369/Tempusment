"use client";

import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export async function ensureUserDocument() {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        name: user.displayName || 'Business Name',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return userDocRef;
  } catch (error) {
    console.error('Error ensuring user document:', error);
    throw error;
  }
}

export function getUserCollection(collectionName: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');
  return collection(db, 'users', user.uid, collectionName);
}

export function getBusinessCollection(userId: string, collectionName: string) {
  if (!userId) throw new Error('Business ID is required');
  return collection(db, 'users', userId, collectionName);
}