"use client";

import { getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getBusinessCollection } from '../firebase-utils';
import type { Service } from '@/types';

export async function getBusinessServices(businessId: string): Promise<Service[]> {
  if (!businessId) {
    console.error('Business ID is required');
    return [];
  }

  try {
    const servicesRef = getBusinessCollection(businessId, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
  } catch (error) {
    console.error('Error fetching business services:', error);
    return [];
  }
}

export async function createService(businessId: string, data: Partial<Service>): Promise<Service> {
  try {
    const servicesRef = getBusinessCollection(businessId, 'services');
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

export async function updateService(businessId: string, serviceId: string, data: Partial<Service>): Promise<Service> {
  try {
    const serviceRef = doc(db, 'users', businessId, 'services', serviceId);
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

export async function deleteService(businessId: string, serviceId: string): Promise<void> {
  try {
    const serviceRef = doc(db, 'users', businessId, 'services', serviceId);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}