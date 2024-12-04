"use client";

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Appointment } from '@/types';

export async function getBusinessAppointments(userId: string): Promise<Appointment[]> {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    const snapshot = await getDocs(appointmentsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Appointment));
  } catch (error) {
    console.error('Error fetching business appointments:', error);
    throw error;
  }
}

export async function createAppointment(userId: string, data: Partial<Appointment>): Promise<Appointment> {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    const docRef = await addDoc(appointmentsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data } as Appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(userId: string, appointmentId: string, data: Partial<Appointment>): Promise<Appointment> {
  try {
    const appointmentRef = doc(db, 'users', userId, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id: appointmentId, ...data } as Appointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function deleteAppointment(userId: string, appointmentId: string): Promise<void> {
  try {
    const appointmentRef = doc(db, 'users', userId, 'appointments', appointmentId);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}