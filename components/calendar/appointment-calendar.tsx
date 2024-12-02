"use client";

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from 'next-themes';
import { getAllAppointments, getAllBlockedTimes } from '@/lib/firebase-collections';
import { BlockTimeDialog } from './block-time-dialog';
import { useToast } from '@/components/ui/use-toast';
import type { Appointment, BlockedTime } from '@/types';

export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [fetchedAppointments, fetchedBlockedTimes] = await Promise.all([
        getAllAppointments(),
        getAllBlockedTimes()
      ]);
      setAppointments(fetchedAppointments);
      setBlockedTimes(fetchedBlockedTimes);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive"
      });
    }
  }

  const getEventColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6'; // blue
      case 'completed':
        return '#22c55e'; // green
      case 'cancelled':
        return '#ef4444'; // red
      case 'blocked':
        return '#6b7280'; // gray
      default:
        return '#3b82f6';
    }
  };

  const events = [
    ...appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.clientName} - ${appointment.serviceName}`,
      start: `${appointment.date}T${appointment.time}`,
      end: `${appointment.date}T${appointment.time}`,
      backgroundColor: getEventColor(appointment.status),
      extendedProps: {
        type: 'appointment',
        appointment
      }
    })),
    ...blockedTimes.map(blocked => ({
      id: blocked.id,
      title: blocked.reason || 'Blocked',
      start: blocked.startTime,
      end: blocked.endTime,
      backgroundColor: getEventColor('blocked'),
      extendedProps: {
        type: 'blocked',
        blocked
      }
    }))
  ];

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setShowBlockDialog(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const eventType = clickInfo.event.extendedProps.type;
    
    if (eventType === 'appointment') {
      // Handle appointment click
      const appointment = clickInfo.event.extendedProps.appointment;
      toast({
        title: appointment.serviceName,
        description: `${appointment.clientName} - ${appointment.status}`,
      });
    } else if (eventType === 'blocked') {
      // Handle blocked time click
      const blocked = clickInfo.event.extendedProps.blocked;
      toast({
        title: "Blocked Time",
        description: blocked.reason || "This time slot is blocked",
      });
    }
  };

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="100%"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        slotDuration="00:15:00"
        themeSystem={theme === 'dark' ? 'darkly' : 'standard'}
      />

      <BlockTimeDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        selectedDate={selectedDate}
        onSuccess={() => {
          fetchData();
          setShowBlockDialog(false);
        }}
      />
    </div>
  );
}