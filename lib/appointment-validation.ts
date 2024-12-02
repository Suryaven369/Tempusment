"use client";

import { BlockedTime, Appointment } from "@/types";
import { addMinutes, parseISO, isWithinInterval, isSameDay, format } from "date-fns";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function isTimeSlotBlocked(
  date: string,
  time: string,
  duration: number,
  blockedTimes: BlockedTime[],
  existingAppointments: Appointment[]
): { blocked: boolean; reason?: string } {
  const appointmentStart = parseISO(`${date}T${time}`);
  const appointmentEnd = addMinutes(appointmentStart, duration);

  // Check blocked times
  for (const blocked of blockedTimes) {
    const blockStart = parseISO(blocked.startTime);
    const blockEnd = parseISO(blocked.endTime);

    if (blocked.isAllDay && isSameDay(appointmentStart, blockStart)) {
      return { 
        blocked: true, 
        reason: blocked.reason || "This entire day is blocked" 
      };
    }

    if (isWithinInterval(appointmentStart, { start: blockStart, end: blockEnd }) ||
        isWithinInterval(appointmentEnd, { start: blockStart, end: blockEnd })) {
      return { 
        blocked: true, 
        reason: blocked.reason || "This time slot is blocked" 
      };
    }
  }

  // Check existing appointments
  for (const appointment of existingAppointments) {
    if (appointment.date === date) {
      const existingStart = parseISO(`${appointment.date}T${appointment.time}`);
      const existingEnd = addMinutes(existingStart, appointment.duration);

      if (isWithinInterval(appointmentStart, { start: existingStart, end: existingEnd }) ||
          isWithinInterval(appointmentEnd, { start: existingStart, end: existingEnd })) {
        return { 
          blocked: true, 
          reason: "Another appointment is scheduled for this time" 
        };
      }
    }
  }

  return { blocked: false };
}

export function getAvailableTimeSlots(
  date: string,
  duration: number,
  blockedTimes: BlockedTime[],
  existingAppointments: Appointment[],
  businessHours: { start: string; end: string } = { start: "09:00", end: "17:00" }
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startTime = parseISO(`${date}T${businessHours.start}`);
  const endTime = parseISO(`${date}T${businessHours.end}`);
  const interval = 15; // 15-minute intervals

  let currentTime = startTime;
  while (currentTime < endTime) {
    const timeString = format(currentTime, "HH:mm");
    const { blocked } = isTimeSlotBlocked(
      date,
      timeString,
      duration,
      blockedTimes,
      existingAppointments
    );

    slots.push({
      time: timeString,
      available: !blocked
    });

    currentTime = addMinutes(currentTime, interval);
  }

  return slots;
}