"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createAppointment } from "@/lib/firebase-collections";
import type { Service } from "@/types";

interface ServiceBookingDialogProps {
  service: Service;
  userId: string;
  trigger?: React.ReactNode;
}

interface BookingFormData {
  name: string;
  phone: string;
  date: Date | undefined;
  time: string;
}

const initialFormData: BookingFormData = {
  name: "",
  phone: "",
  date: undefined,
  time: "",
};

export function ServiceBookingDialog({ service, userId, trigger }: ServiceBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        clientName: formData.name,
        clientPhone: formData.phone,
        serviceId: service.id,
        serviceName: service.name,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time,
        duration: service.duration,
        price: service.price,
        status: "scheduled" as const,
        paymentStatus: "pending" as const,
      };

      await createAppointment(appointmentData);

      toast({
        title: "Success",
        description: "Your appointment has been scheduled!",
      });

      setOpen(false);
      setFormData(initialFormData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Book Now</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-80px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({ ...formData, date })}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <TimePicker
                value={formData.time}
                onChange={(time) => setFormData({ ...formData, time })}
              />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service Duration:</span>
                <span>{service.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price:</span>
                <span>${service.price}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Scheduling..." : "Book Appointment"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}