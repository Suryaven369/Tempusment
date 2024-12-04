"use client";

import { 
  collection, 
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  limit,
  serverTimestamp,
  Timestamp,
  enableNetwork,
  disableNetwork,
  FirestoreError,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Appointment, Client, Service, Staff, BlockedTime } from '@/types';

// Network status management
export const goOnline = () => enableNetwork(db);
export const goOffline = () => disableNetwork(db);

// Helper function to get user-specific collection reference
const getUserCollection = (collectionName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');
  return collection(db, 'users', user.uid, collectionName);
};

// Helper function to convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toISOString();
  return new Date().toISOString();
};

// Helper function to convert document to typed data
function convertDocument<T>(doc: DocumentSnapshot | QueryDocumentSnapshot): T {
  if (!doc.exists()) {
    throw new Error('Document does not exist');
  }
  
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data?.createdAt ? convertTimestamp(data.createdAt) : new Date().toISOString(),
    updatedAt: data?.updatedAt ? convertTimestamp(data.updatedAt) : new Date().toISOString()
  } as T;
}

// Helper function to prepare data for Firestore
function prepareForFirestore(data: any) {
  const prepared = { ...data };
  delete prepared.id;
  
  if (typeof prepared.price !== 'undefined') {
    prepared.price = Number(prepared.price);
  }
  
  return prepared;
}

// Dashboard Stats
export async function getDashboardStats() {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentsRef = getUserCollection('appointments');
    const clientsRef = getUserCollection('clients');

    const [appointmentsSnapshot, clientsSnapshot] = await Promise.all([
      getDocs(query(appointmentsRef)),
      getDocs(query(clientsRef))
    ]);

    let totalRevenue = 0;
    let completedAppointments = 0;

    appointmentsSnapshot.forEach((doc) => {
      const data = doc.data();
      totalRevenue += Number(data.price) || 0;
      if (data.status === 'completed') {
        completedAppointments++;
      }
    });

    return {
      totalAppointments: appointmentsSnapshot.size,
      totalRevenue,
      totalClients: clientsSnapshot.size,
      completionRate: appointmentsSnapshot.size > 0 
        ? Math.round((completedAppointments / appointmentsSnapshot.size) * 100)
        : 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalAppointments: 0,
      totalRevenue: 0,
      totalClients: 0,
      completionRate: 0
    };
  }
}

// Recent Appointments
export async function getRecentAppointments(): Promise<Appointment[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentsRef = getUserCollection('appointments');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const snapshot = await getDocs(query(appointmentsRef));
    
    return snapshot.docs
      .map(doc => convertDocument<Appointment>(doc))
      .filter(appointment => new Date(appointment.date) >= today)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 9);
  } catch (error) {
    console.error('Error in getRecentAppointments:', error);
    return [];
  }
}

// Create Appointment
export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentsRef = getUserCollection('appointments');
    const preparedData = prepareForFirestore({
      ...data,
      status: data.status || 'scheduled',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(appointmentsRef, preparedData);
    const docSnap = await getDoc(docRef);
    
    return convertDocument<Appointment>(docSnap);
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

// Update Appointment
export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentRef = doc(getUserCollection('appointments'), id);
    const preparedData = prepareForFirestore({
      ...data,
      updatedAt: serverTimestamp()
    });

    await updateDoc(appointmentRef, preparedData);
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

// Delete Appointment
export async function deleteAppointment(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentRef = doc(getUserCollection('appointments'), id);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

// Get Client Appointments
export async function getClientAppointments(clientId: string): Promise<Appointment[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentsRef = getUserCollection('appointments');
    const snapshot = await getDocs(
      query(appointmentsRef, where('clientId', '==', clientId))
    );

    return snapshot.docs
      .map(doc => convertDocument<Appointment>(doc))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching client appointments:', error);
    return [];
  }
}

// Get All Appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const appointmentsRef = getUserCollection('appointments');
    const snapshot = await getDocs(query(appointmentsRef));

    return snapshot.docs
      .map(doc => convertDocument<Appointment>(doc))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    return [];
  }
}

// Clients
export async function getAllClients(): Promise<Client[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const clientsRef = getUserCollection('clients');
    const snapshot = await getDocs(query(clientsRef));

    return snapshot.docs
      .map(doc => convertDocument<Client>(doc))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export async function createClient(data: Partial<Client>): Promise<Client> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const clientsRef = getUserCollection('clients');
    const preparedData = prepareForFirestore({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(clientsRef, preparedData);
    const docSnap = await getDoc(docRef);
    
    return convertDocument<Client>(docSnap);
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const clientRef = doc(getUserCollection('clients'), id);
    const preparedData = prepareForFirestore({
      ...data,
      updatedAt: serverTimestamp()
    });

    await updateDoc(clientRef, preparedData);
    const docSnap = await getDoc(clientRef);
    
    return convertDocument<Client>(docSnap);
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const clientRef = doc(getUserCollection('clients'), id);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

// Services
export async function getAllServices(): Promise<Service[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const servicesRef = getUserCollection('services');
    const snapshot = await getDocs(query(servicesRef));

    return snapshot.docs
      .map(doc => convertDocument<Service>(doc))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function createService(data: Partial<Service>): Promise<Service> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const servicesRef = getUserCollection('services');
    const preparedData = prepareForFirestore({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(servicesRef, preparedData);
    const docSnap = await getDoc(docRef);
    
    return convertDocument<Service>(docSnap);
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const serviceRef = doc(getUserCollection('services'), id);
    const preparedData = prepareForFirestore({
      ...data,
      updatedAt: serverTimestamp()
    });

    await updateDoc(serviceRef, preparedData);
    const docSnap = await getDoc(serviceRef);
    
    return convertDocument<Service>(docSnap);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const serviceRef = doc(getUserCollection('services'), id);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// Staff
export async function getAllStaff(): Promise<Staff[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const staffRef = getUserCollection('staff');
    const snapshot = await getDocs(query(staffRef));

    return snapshot.docs
      .map(doc => convertDocument<Staff>(doc))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
}

export async function createStaff(data: Partial<Staff>): Promise<Staff> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const staffRef = getUserCollection('staff');
    const preparedData = prepareForFirestore({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(staffRef, preparedData);
    const docSnap = await getDoc(docRef);
    
    return convertDocument<Staff>(docSnap);
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
}

export async function updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const staffRef = doc(getUserCollection('staff'), id);
    const preparedData = prepareForFirestore({
      ...data,
      updatedAt: serverTimestamp()
    });

    await updateDoc(staffRef, preparedData);
    const docSnap = await getDoc(staffRef);
    
    return convertDocument<Staff>(docSnap);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
}

export async function deleteStaff(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const staffRef = doc(getUserCollection('staff'), id);
    await deleteDoc(staffRef);
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
}

// Categories
export interface ServiceCategory {
  id?: string;
  name: string;
}

export async function getAllCategories(): Promise<ServiceCategory[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const categoriesRef = getUserCollection('categories');
    const snapshot = await getDocs(query(categoriesRef));

    return snapshot.docs
      .map(doc => convertDocument<ServiceCategory>(doc))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string): Promise<ServiceCategory> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const categoriesRef = getUserCollection('categories');
    const docRef = await addDoc(categoriesRef, {
      name,
      createdAt: serverTimestamp()
    });
    
    const docSnap = await getDoc(docRef);
    return convertDocument<ServiceCategory>(docSnap);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}


// Payment Stats
export async function getPaymentStats() {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentsRef = getUserCollection('payments');
    const snapshot = await getDocs(query(paymentsRef));
    
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let successfulTransactions = 0;
    let totalTransactions = snapshot.size;
    
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    snapshot.forEach((doc) => {
      const payment = doc.data();
      const amount = Number(payment.amount);
      const paymentDate = payment.createdAt?.toDate() || new Date();
      
      totalRevenue += amount;
      
      if (paymentDate >= firstDayOfMonth) {
        monthlyRevenue += amount;
      }
      
      if (payment.status === 'completed') {
        successfulTransactions++;
      }
    });

    return {
      totalRevenue,
      monthlyRevenue,
      averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      successRate: totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'getPaymentStats');
    }
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageTransaction: 0,
      successRate: 0
    };
  }
}

// Get All Payments
export async function getAllPayments(): Promise<Payment[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentsRef = getUserCollection('payments');
    const snapshot = await getDocs(query(paymentsRef, orderBy('createdAt', 'desc')));
    
    return snapshot.docs.map(doc => convertDocument<Payment>(doc));
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'getAllPayments');
    }
    return [];
  }
}

// Create Payment
export async function createPayment(data: Partial<Payment>): Promise<Payment> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentsRef = getUserCollection('payments');
    const preparedData = prepareForFirestore({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(paymentsRef, preparedData);
    const docSnap = await getDoc(docRef);
    
    return convertDocument<Payment>(docSnap);
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'createPayment');
    }
    throw error;
  }
}

// Delete Payment
export async function deletePayment(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentRef = doc(getUserCollection('payments'), id);
    await deleteDoc(paymentRef);
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'deletePayment');
    }
    throw error;
  }
}

// Update Payment
export async function updatePayment(id: string, data: Partial<Payment>): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentRef = doc(getUserCollection('payments'), id);
    const preparedData = prepareForFirestore({
      ...data,
      updatedAt: serverTimestamp()
    });

    await updateDoc(paymentRef, preparedData);
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'updatePayment');
    }
    throw error;
  }
}


// Add this function to handle Firestore errors
function handleFirestoreError(error: FirestoreError, operation: string) {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
}

export async function getClientPayments(clientId: string): Promise<Payment[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required');
    }

    const paymentsRef = getUserCollection('payments');
    const snapshot = await getDocs(
      query(
        paymentsRef,
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      )
    );

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Payment[];
  } catch (error) {
    console.error('Error fetching client payments:', error);
    return [];
  }
}



// Blocked Times
export async function getAllBlockedTimes(): Promise<BlockedTime[]> {
  try {
    const blockedTimesRef = getUserCollection('blockedTimes');
    const snapshot = await getDocs(query(blockedTimesRef, orderBy('startTime')));
    return snapshot.docs.map(doc => convertDocument<BlockedTime>(doc));
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    return [];
  }
}

export async function createBlockedTime(data: Partial<BlockedTime>): Promise<BlockedTime> {
  const blockedTimesRef = getUserCollection('blockedTimes');
  const preparedData = prepareForFirestore({
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  const docRef = await addDoc(blockedTimesRef, preparedData);
  const docSnap = await getDoc(docRef);
  return convertDocument<BlockedTime>(docSnap);
}

export async function deleteBlockedTime(id: string): Promise<void> {
  const blockedTimeRef = doc(getUserCollection('blockedTimes'), id);
  await deleteDoc(blockedTimeRef);
}




// Helper function to get services for a specific business
export async function getBusinessServices(userId: string) {
  try {
    const servicesRef = collection(db, 'users', userId, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching business services:', error);
    throw error;
  }
}

// Helper function to get staff members for a specific business
export async function getBusinessStaff(userId: string) {
  try {
    const staffRef = collection(db, 'users', userId, 'staff');
    const snapshot = await getDocs(staffRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching business staff:', error);
    throw error;
  }
}

// Helper function to get business settings
export async function getBusinessSettings(userId: string) {
  try {
    const settingsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching business settings:', error);
    throw error;
  }
}

// Helper function to get business appointments
export async function getBusinessAppointments(userId: string) {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    const snapshot = await getDocs(appointmentsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching business appointments:', error);
    throw error;
  }
}

// Helper function to create a new appointment
export async function createBusinessAppointment(userId: string, appointmentData: any) {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return {
      id: docRef.id,
      ...appointmentData
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

// Helper function to get blocked times
export async function getBusinessBlockedTimes(userId: string) {
  try {
    const blockedTimesRef = collection(db, 'users', userId, 'blockedTimes');
    const snapshot = await getDocs(blockedTimesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    throw error;
  }
}

export async function getBusinessInfo(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('Business not found');
    }

    const settingsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
    const businessData = userDoc.data();
    const settings = settingsDoc.exists() ? settingsDoc.data() : null;

    return {
      ...businessData,
      settings,
      id: userId
    };
  } catch (error) {
    console.error('Error fetching business info:', error);
    throw error;
  }
}