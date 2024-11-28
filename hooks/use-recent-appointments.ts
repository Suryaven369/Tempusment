"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { getRecentAppointments, updateAppointment } from '@/lib/collections/appointments';
import type { Appointment } from '@/types';

export function useRecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await getRecentAppointments();
      setAppointments(data);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateAppointmentStatus = async (appointment: Appointment, newStatus: string) => {
    if (!appointment.id) return;

    try {
      const updatedAppointment = await updateAppointment(appointment.id, {
        ...appointment,
        status: newStatus as Appointment["status"],
      });
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => 
          app.id === appointment.id ? updatedAppointment : app
        )
      );

      toast({
        title: "Success",
        description: `Appointment status updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadAppointments = async () => {
      if (mounted) {
        await fetchAppointments();
      }
    };

    loadAppointments();
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(loadAppointments, 30000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    updateAppointmentStatus,
    refreshAppointments: fetchAppointments
  };
}