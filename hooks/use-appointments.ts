"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, where } from 'firebase/firestore';
import type { Appointment } from '@/types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Set up real-time listener for appointments
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const appointmentsRef = collection(db, 'users', user.uid, 'appointments');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      appointmentsRef,
      where('date', '>=', today.toISOString().split('T')[0]),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];

        setAppointments(updatedAppointments);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try refreshing.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [user, toast]);

  const addAppointment = useCallback((newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    }));
  }, []);

  const updateAppointment = useCallback((updatedAppointment: Appointment) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  }, []);

  const removeAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  }, []);

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    removeAppointment
  };
}