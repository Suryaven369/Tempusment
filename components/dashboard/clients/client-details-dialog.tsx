"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDialog } from "./client-dialog";
import { NewAppointmentDialog } from "../new-appointment-dialog";
import { getClientAppointments } from "@/lib/firebase-collections";
import { format } from "date-fns";
import type { Client, Appointment } from "@/types";

interface ClientDetailsDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: (client: Client) => void;
}

export function ClientDetailsDialog({
  client,
  open,
  onOpenChange,
  onClientUpdated,
}: ClientDetailsDialogProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      if (!client.id) return;
      
      try {
        const fetchedAppointments = await getClientAppointments(client.id);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching client appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchAppointments();
    }
  }, [client.id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{client.name}</span>
            <div className="flex items-center gap-2">
              <NewAppointmentDialog preselectedClient={client} />
              <ClientDialog client={client} onClientUpdated={onClientUpdated} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(80vh-12rem)] mt-4">
            <TabsContent value="info" className="space-y-4">
              <div>
                <h4 className="font-semibold">Contact Information</h4>
                <div className="mt-2 space-y-2">
                  <p>Email: {client.email}</p>
                  <p>Phone: {client.phone}</p>
                  <p>Address: {client.address}</p>
                </div>
              </div>

              {client.notes && (
                <div>
                  <h4 className="font-semibold">Notes</h4>
                  <p className="mt-2 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}

              {client.tags && client.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold">Tags</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="appointments">
              <div className="space-y-4">
                {loading ? (
                  <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p>No appointments found.</p>
                ) : (
                  appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{appointment.serviceName}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(`${appointment.date}T${appointment.time}`),
                            "PPP p"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${appointment.price}</p>
                        <p
                          className={`text-sm ${
                            appointment.status === "completed"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {appointment.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}