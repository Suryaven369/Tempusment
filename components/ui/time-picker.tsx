"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  interval?: number;
  className?: string;
}

export function TimePicker({ 
  value, 
  onChange, 
  interval = 15,
  className 
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const totalMinutesInDay = 24 * 60;
    
    for (let minutes = 0; minutes < totalMinutesInDay; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const formattedMinute = minute.toString().padStart(2, '0');
      const displayTime = `${formattedHour}:${formattedMinute} ${ampm}`;
      const militaryTime = `${hour.toString().padStart(2, '0')}:${formattedMinute}`;
      slots.push(militaryTime);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDisplayTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const displayHours = parsedHours === 0 ? 12 : parsedHours > 12 ? parsedHours - 12 : parsedHours;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn("w-full justify-between", className)}
        >
          {value ? formatDisplayTime(value) : "Select time"}
          <Clock className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ScrollArea className="h-80">
          <div className="grid">
            {timeSlots.map((timeSlot) => (
              <Button
                key={timeSlot}
                variant="ghost"
                className={cn(
                  "justify-start font-normal",
                  value === timeSlot && "bg-accent"
                )}
                onClick={() => {
                  onChange(timeSlot);
                  setIsOpen(false);
                }}
              >
                {formatDisplayTime(timeSlot)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}