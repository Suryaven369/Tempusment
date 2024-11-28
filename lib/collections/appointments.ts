"use client";

import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserCollection, ensureUserDocument, prepareForFirestore } from '../firebase-utils';
import type { Appointment } from '@/types';

export async function getRecentAppointments(): Promise<Appointment[]> {
  try {
    await ensureUserDocument();
    const appointmentsRef = getUserCollection('appointments');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      appointmentsRef,
      where('date', '>=', today.toISOString().split('T')[0]),
      orderBy('date', 'asc'),
      orderBy('time', 'asc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Appointment));
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
  await ensureUserDocument();
  const appointmentRef = doc(getUserCollection('appointments'), id);
  const updateData = prepareForFirestore(data);
  
  await updateDoc(appointmentRef, updateData);
  return { id, ...data } as Appointment;
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  await ensureUserDocument();
  const appointmentsRef = getUserCollection('appointments');
  const docData = prepareForFirestore(data);
  
  const docRef = await addDoc(appointmentsRef, docData);
  return { id: docRef.id, ...data } as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  await ensureUserDocument();
  const appointmentRef = doc(getUserCollection('appointments'), id);
  await deleteDoc(appointmentRef);
}

export async function getAllAppointments(): Promise<Appointment[]> {
  await ensureUserDocument();
  const appointmentsRef = getUserCollection('appointments');
  const snapshot = await getDocs(appointmentsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Appointment));
}