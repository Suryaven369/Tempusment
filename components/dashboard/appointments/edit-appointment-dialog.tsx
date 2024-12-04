"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateAppointment, getAllServices, getAllStaff } from "@/lib/firebase-collections";
import type { Appointment, Service, Staff } from "@/types";

interface EditAppointmentDialogProps {
  appointment: Appointment;
  onAppointmentUpdated: (appointment: Appointment) => void;
}

export function EditAppointmentDialog({ 
  appointment, 
  onAppointmentUpdated 
}: EditAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Appointment>>(appointment);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedServices, fetchedStaff] = await Promise.all([
          getAllServices(),
          getAllStaff()
        ]);
        setServices(fetchedServices);
        setStaffMembers(fetchedStaff.filter(staff => staff.active));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (open) {
      fetchData();
    }
  }, [open]);

  const validateForm = () => {
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();

    if (selectedDate < now) {
      toast({
        title: "Invalid Date",
        description: "Cannot schedule appointments in the past",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const selectedService = services.find(s => s.id === formData.serviceId);
      const selectedStaff = staffMembers.find(s => s.id === formData.staffId);

      if (!selectedService || !selectedStaff) {
        throw new Error("Please select both service and staff member");
      }

      const updatedAppointment = {
        ...appointment,
        ...formData,
        serviceName: selectedService.name,
        staffName: selectedStaff.name,
        duration: selectedService.duration,
        price: selectedService.price,
        updatedAt: new Date().toISOString(),
      };

      await updateAppointment(appointment.id!, updatedAppointment);
      onAppointmentUpdated(updatedAppointment);
      
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
      
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id || ""}>
                    {service.name} - ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) => setFormData({ ...formData, staffId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id || ""}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}