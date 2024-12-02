"use client";

import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>

      <div className="flex-1 min-h-0">
        <AppointmentCalendar />
      </div>
    </div>
  );
}