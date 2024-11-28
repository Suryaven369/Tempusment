"use client";

import { getDocs } from 'firebase/firestore';
import { getUserCollection } from '../firebase-utils';
import { ensureUserDocument } from '../firebase-utils';

export interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  totalClients: number;
  completionRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await ensureUserDocument();
    
    const appointmentsRef = getUserCollection('appointments');
    const clientsRef = getUserCollection('clients');
    
    const [appointmentsSnapshot, clientsSnapshot] = await Promise.all([
      getDocs(appointmentsRef),
      getDocs(clientsRef)
    ]);

    const appointments = appointmentsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    const totalRevenue = appointments.reduce((sum, apt) => sum + (Number(apt.price) || 0), 0);
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

    return {
      totalAppointments: appointments.length,
      totalRevenue,
      totalClients: clientsSnapshot.size,
      completionRate: appointments.length > 0 
        ? Math.round((completedAppointments / appointments.length) * 100)
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