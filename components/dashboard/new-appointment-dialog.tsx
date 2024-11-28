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
import { createAppointment, getAllClients, getAllServices, getAllStaff } from "@/lib/firebase-collections";
import { Command } from "cmdk";
import { Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Appointment, Client, Service, Staff } from "@/types";

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
    async function fetchData() {
      try {
        const [fetchedClients, fetchedServices, fetchedStaff] = await Promise.all([
          getAllClients(),
          getAllServices(),
          getAllStaff()
        ]);
        setClients(fetchedClients);
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

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

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      if (onAppointmentAdded) {
        onAppointmentAdded();
      }
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

  if (!user) {
    return null;
  }

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
                  onFocus={handleSearchFocus}
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
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}