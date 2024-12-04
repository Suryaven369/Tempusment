"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { isTimeSlotBlocked } from "@/lib/appointment-validation";
import { getAllBlockedTimes, getAllAppointments } from "@/lib/firebase-collections";
import type { BlockedTime, Appointment } from "@/types";

export function useBookingValidation() {
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedBlockedTimes, fetchedAppointments] = await Promise.all([
          getAllBlockedTimes(),
          getAllAppointments()
        ]);
        setBlockedTimes(fetchedBlockedTimes);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const validateTimeSlot = (date: string, time: string, duration: number) => {
    if (!settings?.booking?.enabled) {
      return { valid: false, message: "Online booking is currently disabled" };
    }

    // Check booking window
    const selectedDate = new Date(`${date}T${time}`);
    const now = new Date();
    const minAdvanceHours = parseInt(settings?.booking?.minAdvanceBooking || "24");
    const maxAdvanceDays = parseInt(settings?.booking?.maxAdvanceBooking || "30");

    const minAllowedDate = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
    const maxAllowedDate = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

    if (selectedDate < minAllowedDate) {
      return { 
        valid: false, 
        message: `Appointments must be booked at least ${minAdvanceHours} hours in advance` 
      };
    }

    if (selectedDate > maxAllowedDate) {
      return { 
        valid: false, 
        message: `Appointments cannot be booked more than ${maxAdvanceDays} days in advance` 
      };
    }

    // Check if time slot is blocked
    const { blocked, reason } = isTimeSlotBlocked(
      date,
      time,
      duration,
      blockedTimes,
      appointments
    );

    if (blocked) {
      return { valid: false, message: reason || "This time slot is not available" };
    }

    return { valid: true };
  };

  return {
    validateTimeSlot,
    loading,
    settings
  };
}