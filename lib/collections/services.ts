"use client";

import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getBusinessCollection } from '../firebase-utils';
import type { Service } from '@/types';

export async function getBusinessServices(userId: string): Promise<Service[]> {
  try {
    const servicesRef = getBusinessCollection(userId, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
  } catch (error) {
    console.error('Error fetching business services:', error);
    throw error;
  }
}

export async function createService(userId: string, data: Partial<Service>): Promise<Service> {
  try {
    const servicesRef = getBusinessCollection(userId, 'services');
    const docRef = await addDoc(servicesRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data } as Service;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function updateService(userId: string, serviceId: string, data: Partial<Service>): Promise<Service> {
  try {
    const serviceRef = doc(getBusinessCollection(userId, 'services'), serviceId);
    await updateDoc(serviceRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id: serviceId, ...data } as Service;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function deleteService(userId: string, serviceId: string): Promise<void> {
  try {
    const serviceRef = doc(getBusinessCollection(userId, 'services'), serviceId);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}