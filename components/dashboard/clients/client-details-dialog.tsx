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
import { ClientTimeline } from "./client-history/timeline";
import { getClientAppointments, getClientPayments } from "@/lib/firebase-collections";
import type { Client, Appointment, Payment } from "@/types";
import { useToast } from "@/components/ui/use-toast";

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!client.id || !open) return;
      
      setLoading(true);
      try {
        const [fetchedAppointments, fetchedPayments] = await Promise.all([
          getClientAppointments(client.id),
          getClientPayments(client.id)
        ]);
        
        setAppointments(fetchedAppointments || []);
        setPayments(fetchedPayments || []);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Error",
          description: "Failed to load client history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [client.id, open, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{client.name}</span>
            <div className="flex items-center gap-2">
              <NewAppointmentDialog preselectedClient={client} />
              <ClientDialog client={client} onClientUpdated={onClientUpdated} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="history" className="mt-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="history">History & Timeline</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-12rem)] mt-4">
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

            <TabsContent value="history">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ClientTimeline 
                  appointments={appointments}
                  payments={payments}
                  clientName={client.name}
                />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
