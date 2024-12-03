"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getAllBlockedTimes, getAllAppointments } from "@/lib/firebase-collections";
import { getAvailableTimeSlots } from "@/lib/appointment-validation";
import type { TimeSlot } from "@/lib/appointment-validation";

interface TimeSelectionProps {
  userId: string;
  onNext: () => void;
  onBack: () => void;
}

export function TimeSelection({ userId, onNext, onBack }: TimeSelectionProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;

      setLoading(true);
      try {
        const [blockedTimes, appointments] = await Promise.all([
          getAllBlockedTimes(),
          getAllAppointments()
        ]);

        const slots = getAvailableTimeSlots(
          format(date, "yyyy-MM-dd"),
          30, // Default duration, should be based on selected service
          blockedTimes,
          appointments
        );

        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [date, toast]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Select Date & Time</h2>
          <p className="text-muted-foreground">
            Choose your preferred appointment time
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div>
          {date ? (
            loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <TimeSlotPicker
                slots={availableSlots}
                selectedTime={selectedTime}
                onTimeSelected={handleTimeSelect}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Please select a date first
            </div>
          )}
        </div>
      </div>
    </div>
  );
}