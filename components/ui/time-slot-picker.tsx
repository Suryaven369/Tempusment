"use client";

import { TimeSlot } from "@/lib/appointment-validation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string;
  onTimeSelected: (time: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedTime,
  onTimeSelected
}: TimeSlotPickerProps) {
  return (
    <ScrollArea className="h-[280px] rounded-md border">
      <div className="grid grid-cols-3 gap-2 p-4">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && onTimeSelected(slot.time)}
            disabled={!slot.available}
            className={cn(
              "px-3 py-2 rounded-md text-sm transition-colors",
              slot.available
                ? selectedTime === slot.time
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                : "opacity-50 cursor-not-allowed bg-muted line-through"
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}