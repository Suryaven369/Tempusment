"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateAppointment, createPayment } from "@/lib/firebase-collections";
import type { Appointment, Payment } from "@/types";

interface PaymentStatusDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentUpdated: (appointment: Appointment) => void;
}

const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export function PaymentStatusDialog({ 
  appointment, 
  open,
  onOpenChange,
  onAppointmentUpdated 
}: PaymentStatusDialogProps) {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<Payment['method']>("credit_card");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payment record
      const payment = await createPayment({
        appointmentId: appointment.id,
        clientId: appointment.clientId,
        clientName: appointment.clientName,
        amount: appointment.price,
        method,
        description: `Payment for ${appointment.serviceName} on ${appointment.date}`,
        status: 'completed'
      });

      // Update appointment payment status
      const updatedAppointment = {
        ...appointment,
        paymentStatus: 'paid' as const,
        paymentId: payment.id
      };

      await updateAppointment(appointment.id!, updatedAppointment);
      onAppointmentUpdated(updatedAppointment);
      
      toast({
        title: "Success",
        description: "Payment recorded successfully.",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment.",
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
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="text"
              value={`$${appointment.price.toFixed(2)}`}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={method}
              onValueChange={(value: Payment['method']) => setMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Record Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}