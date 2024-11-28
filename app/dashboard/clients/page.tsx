"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDialog } from "@/components/dashboard/clients/client-dialog";
import { ClientList } from "@/components/dashboard/clients/client-list";
import { ClientSearch } from "@/components/dashboard/clients/client-search";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAllClients } from "@/lib/firebase-collections";
import type { Client } from "@/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClients() {
      if (!user) return;
      
      try {
        const fetchedClients = await getAllClients();
        setClients(fetchedClients);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [user, toast]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleClientAdded = (newClient: Client) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <ClientDialog onClientAdded={handleClientAdded} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <ClientSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ClientList 
        clients={filteredClients}
        loading={loading}
        onClientUpdated={handleClientUpdated}
      />
    </div>
  );
}