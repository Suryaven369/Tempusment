"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createBlockedTime } from "@/lib/firebase-collections";
import { Switch } from "@/components/ui/switch";

interface BlockTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onSuccess: () => void;
}

const recurrenceOptions = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function BlockTimeDialog({
  open,
  onOpenChange,
  selectedDate,
  onSuccess
}: BlockTimeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [isAllDay, setIsAllDay] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setLoading(true);

    try {
      const blockData = {
        startTime: isAllDay 
          ? `${format(selectedDate, 'yyyy-MM-dd')}T00:00:00`
          : `${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`,
        endTime: isAllDay
          ? `${format(selectedDate, 'yyyy-MM-dd')}T23:59:59`
          : `${format(selectedDate, 'yyyy-MM-dd')}T${endTime}`,
        reason,
        recurrence,
        isAllDay,
        createdAt: new Date().toISOString()
      };

      await createBlockedTime(blockData);
      
      toast({
        title: "Success",
        description: "Time block has been created successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to block time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Block Time Slot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              value={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
              disabled
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="all-day"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
            />
            <Label htmlFor="all-day">All Day</Label>
          </div>

          {!isAllDay && (
            <>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  interval={15}
                />
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  interval={15}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Recurrence</Label>
            <Select
              value={recurrence}
              onValueChange={setRecurrence}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence pattern" />
              </SelectTrigger>
              <SelectContent>
                {recurrenceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for blocking"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Blocking..." : "Block Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}