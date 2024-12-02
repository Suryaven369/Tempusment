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
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { createAppointment, getAllClients, getAllServices, getAllStaff, getAllBlockedTimes, getAllAppointments } from "@/lib/firebase-collections";
import { isTimeSlotBlocked, getAvailableTimeSlots, type TimeSlot } from "@/lib/appointment-validation";
import { Command } from "cmdk";
import { Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Appointment, Client, Service, Staff, BlockedTime } from "@/types";

interface NewAppointmentDialogProps {
  onAppointmentAdded?: () => void;
  preselectedClient?: Client;
  trigger?: React.ReactNode;
}

export function NewAppointmentDialog({ 
  onAppointmentAdded, 
  preselectedClient,
  trigger 
}: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (preselectedClient) {
      setFormData(prev => ({
        ...prev,
        clientId: preselectedClient.id || "",
        clientName: preselectedClient.name,
        clientEmail: preselectedClient.email,
        clientPhone: preselectedClient.phone,
      }));
    }
  }, [preselectedClient]);

  useEffect(() => {
    async function fetchData() {
      if (!open) return;
      
      try {
        const [
          fetchedClients, 
          fetchedServices, 
          fetchedStaff,
          fetchedBlockedTimes,
          fetchedAppointments
        ] = await Promise.all([
          getAllClients(),
          getAllServices(),
          getAllStaff(),
          getAllBlockedTimes(),
          getAllAppointments()
        ]);
        setClients(fetchedClients);
        setServices(fetchedServices);
        setStaffMembers(fetchedStaff.filter(staff => staff.active));
        setBlockedTimes(fetchedBlockedTimes);
        setExistingAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [open]);

  useEffect(() => {
    if (formData.date && selectedService?.duration) {
      const slots = getAvailableTimeSlots(
        formData.date,
        selectedService.duration,
        blockedTimes,
        existingAppointments
      );
      setAvailableSlots(slots);
    }
  }, [formData.date, selectedService, blockedTimes, existingAppointments]);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setFormData(prev => ({ ...prev, serviceId }));
  };

  const validateTimeSlot = () => {
    if (!formData.date || !formData.time || !selectedService) return true;

    const { blocked, reason } = isTimeSlotBlocked(
      formData.date,
      formData.time,
      selectedService.duration,
      blockedTimes,
      existingAppointments
    );

    if (blocked) {
      toast({
        title: "Invalid Time Slot",
        description: reason || "This time slot is not available for booking. Please select a different date/time.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleClientSelect = (client: Client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id || "",
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
    }));
    setSearchQuery(client.name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTimeSlot()) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create appointments.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const selectedService = services.find(s => s.id === formData.serviceId);
      const selectedStaff = staffMembers.find(s => s.id === formData.staffId);

      if (!selectedService || !selectedStaff) {
        throw new Error("Please select both service and staff member");
      }

      const appointmentData: Partial<Appointment> = {
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        staffId: selectedStaff.id,
        staffName: selectedStaff.name,
        date: formData.date,
        time: formData.time,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: formData.notes,
        status: "scheduled",
        paymentStatus: "pending",
      };

      await createAppointment(appointmentData);
      
      toast({
        title: "Success",
        description: "Appointment has been scheduled successfully.",
      });

      setOpen(false);
      setFormData({
        clientId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        serviceId: "",
        staffId: "",
        date: "",
        time: "",
        notes: "",
      });

      onAppointmentAdded?.();
    } catch (error: any) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search clients..."
                  className="w-full"
                />
                {showDropdown && searchQuery && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md">
                    <Command>
                      <div className="max-h-[200px] overflow-auto p-1">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer"
                            onClick={() => handleClientSelect(client)}
                          >
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </div>
                            {client.id === formData.clientId && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </Command>
                  </div>
                )}
              </div>
            </div>

            {!formData.clientId && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                value={formData.serviceId}
                onValueChange={handleServiceSelect}
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
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {formData.date && selectedService && (
              <div className="space-y-2">
                <Label>Available Time Slots</Label>
                <TimeSlotPicker
                  slots={availableSlots}
                  selectedTime={formData.time}
                  onTimeSelected={(time) => setFormData({ ...formData, time })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}